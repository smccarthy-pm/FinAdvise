from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel
import openai
from jose import JWTError, jwt
from passlib.context import CryptContext
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

# Initialize FastAPI app
app = FastAPI(title="FinAdvise AI API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security setup
SECRET_KEY = os.getenv("JWT_SECRET", "your-secret-key-keep-it-safe")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class User(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None
    disabled: Optional[bool] = None

class UserInDB(User):
    hashed_password: str

class AIRequest(BaseModel):
    text: str
    history: Optional[List[dict]] = None

class TaskRequest(BaseModel):
    context: str

# AI Helper Functions
async def generate_ai_response(text: str, history: Optional[List[dict]] = None) -> dict:
    try:
        messages = [
            {"role": "system", "content": "You are an AI assistant for financial advisors."}
        ]
        
        if history:
            messages.extend([{"role": msg["type"], "content": msg["content"]} for msg in history])
        
        messages.append({"role": "user", "content": text})
        
        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.7,
            max_tokens=500
        )
        
        return {
            "content": response.choices[0].message.content,
            "suggestions": extract_suggestions(response.choices[0].message.content)
        }
    except Exception as e:
        print(f"OpenAI API Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Error generating AI response")

def extract_suggestions(text: str) -> List[str]:
    # Simple suggestion extraction - could be enhanced
    lines = text.split('\n')
    suggestions = [line.strip('- ') for line in lines if line.strip().startswith('-')]
    return suggestions[:3] if suggestions else ["Create task", "Check schedule", "Generate report"]

# Routes
@app.post("/ai/analyze")
async def analyze_text(request: AIRequest):
    try:
        response = await generate_ai_response(request.text, request.history)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/tasks/generate")
async def generate_tasks(request: TaskRequest):
    try:
        prompt = f"""
        Based on the following context, suggest detailed tasks for a financial advisor:
        Context: {request.context}
        
        Generate 3 specific tasks with the following information for each:
        - Title
        - Description
        - Priority (high/medium/low)
        - Category
        - Suggested due date
        """
        
        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a task planning assistant for financial advisors."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
        
        # Parse the response and structure tasks
        content = response.choices[0].message.content
        # Implementation of task parsing logic would go here
        # For now, returning mock data
        return {
            "tasks": [
                {
                    "title": "Review Portfolio Performance",
                    "description": "Analyze current portfolio performance and prepare recommendations",
                    "priority": "high",
                    "category": "Portfolio Management",
                    "dueDate": (datetime.now() + timedelta(days=3)).isoformat()
                }
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/chat")
async def chat(request: AIRequest):
    try:
        response = await generate_ai_response(request.text, request.history)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Start the server
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)