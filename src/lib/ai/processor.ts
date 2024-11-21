import { ConversationState, AIResponse } from './types';
import { generateResponse } from '../api';

const INTENTS = {
  MEETING: ['schedule', 'meeting', 'appointment', 'calendar'],
  TASK: ['task', 'todo', 'reminder'],
  PORTFOLIO: ['portfolio', 'investment', 'analysis', 'performance'],
  REPORT: ['report', 'generate', 'summary'],
  CRM: ['contact', 'lead', 'opportunity', 'client']
} as const;

export class MessageProcessor {
  private detectIntent(text: string): ConversationState {
    const lowerText = String(text).toLowerCase();
    
    if (INTENTS.MEETING.some(keyword => lowerText.includes(keyword))) return 'meeting';
    if (INTENTS.TASK.some(keyword => lowerText.includes(keyword))) return 'task';
    if (INTENTS.PORTFOLIO.some(keyword => lowerText.includes(keyword))) return 'portfolio';
    if (INTENTS.REPORT.some(keyword => lowerText.includes(keyword))) return 'report';
    if (INTENTS.CRM.some(keyword => lowerText.includes(keyword))) return 'crm';
    
    return 'idle';
  }

  async processMessage(
    text: string,
    history: Array<{ type: string; content: string }> = []
  ): Promise<AIResponse> {
    try {
      const intent = this.detectIntent(text);
      const response = await generateResponse(text, history);

      // Ensure response is serializable
      return {
        content: String(response.content),
        suggestions: Array.isArray(response.suggestions) 
          ? response.suggestions.map(String)
          : ['Schedule meeting', 'Review portfolio', 'Generate report'],
        intent
      };
    } catch (error) {
      console.error('Error processing message:', error);
      return {
        content: 'I apologize, but I encountered an error. Please try again.',
        suggestions: ['Schedule meeting', 'Review portfolio', 'Generate report'],
        intent: 'idle'
      };
    }
  }
}