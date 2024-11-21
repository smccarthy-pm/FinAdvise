import { create } from 'zustand';
import { Message, ConversationState } from './types';

interface AIStore {
  messages: Message[];
  isProcessing: boolean;
  error: string | null;
  state: ConversationState;
  addMessage: (message: Omit<Message, 'id'>) => void;
  setProcessing: (processing: boolean) => void;
  setError: (error: string | null) => void;
  setState: (state: ConversationState) => void;
  reset: () => void;
}

const INITIAL_MESSAGE: Message = {
  id: '1',
  type: 'ai',
  content: 'Hello! I can help you manage tasks, schedule meetings, analyze portfolios, and generate reports. What would you like to do?',
  suggestions: [
    'Schedule a meeting',
    'Create a task',
    'Generate a report',
    'Review portfolio'
  ]
};

export const useAIStore = create<AIStore>((set) => ({
  messages: [INITIAL_MESSAGE],
  isProcessing: false,
  error: null,
  state: 'idle',
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, { ...message, id: Date.now().toString() }]
  })),
  setProcessing: (processing) => set({ isProcessing: processing }),
  setError: (error) => set({ error }),
  setState: (state) => set({ state }),
  reset: () => set({
    messages: [INITIAL_MESSAGE],
    isProcessing: false,
    error: null,
    state: 'idle'
  })
}));