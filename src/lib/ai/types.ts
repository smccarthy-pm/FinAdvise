export type MessageType = 'user' | 'ai' | 'system';
export type ConversationState = 'idle' | 'task' | 'meeting' | 'portfolio' | 'report' | 'crm';

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  suggestions?: string[];
}

export interface AIResponse {
  content: string;
  suggestions: string[];
  intent?: ConversationState;
}