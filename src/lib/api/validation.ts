import { z } from 'zod';

const envSchema = z.object({
  VITE_OPENAI_API_KEY: z.string().min(1, "OpenAI API key is required"),
  VITE_API_URL: z.string().url("Invalid API URL"),
  VITE_JWT_SECRET: z.string().min(1, "JWT secret is required")
});

export function validateEnvironment(): { 
  isValid: boolean; 
  error?: string 
} {
  try {
    const env = {
      VITE_OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
      VITE_API_URL: import.meta.env.VITE_API_URL,
      VITE_JWT_SECRET: import.meta.env.VITE_JWT_SECRET
    };

    envSchema.parse(env);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(e => e.message);
      return { 
        isValid: false, 
        error: messages.join(', ')
      };
    }
    return { 
      isValid: false, 
      error: 'Failed to validate environment configuration' 
    };
  }
}