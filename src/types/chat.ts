export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  suggestions?: string[];
}