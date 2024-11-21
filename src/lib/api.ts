import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json'
  }
});

interface AIResponse {
  content: string;
  suggestions: string[];
}

export async function generateResponse(
  text: string,
  history: Array<{ type: string; content: string }> = []
): Promise<AIResponse> {
  // Ensure data is serializable before sending
  const sanitizedHistory = history.map(msg => ({
    type: String(msg.type),
    content: String(msg.content)
  }));

  try {
    const response = await api.post<AIResponse>('/ai/chat', {
      text: String(text),
      history: sanitizedHistory
    });

    // Ensure response data is serializable
    return {
      content: String(response.data.content || ''),
      suggestions: Array.isArray(response.data.suggestions) 
        ? response.data.suggestions.map(String)
        : ['Create task', 'Check schedule', 'Generate report']
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      content: 'I apologize, but I encountered an error. Please try again.',
      suggestions: ['Create task', 'Check schedule', 'Generate report']
    };
  }
}