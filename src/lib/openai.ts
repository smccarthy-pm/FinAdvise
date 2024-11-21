import { ai } from './api';
import { v4 as uuidv4 } from 'uuid';

export interface AnalysisResult {
  summary: string;
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface TaskSuggestion {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  category: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  suggestions?: string[];
}

class AIService {
  private async validateEnvironment(): Promise<boolean> {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OpenAI API key is missing');
      return false;
    }
    return true;
  }

  async getResponseSuggestions(userMessage: string, history: ChatMessage[] = []): Promise<string[]> {
    try {
      if (!await this.validateEnvironment()) {
        return this.getFallbackSuggestions();
      }

      // Prepare conversation history for API
      const serializedHistory = history.map(msg => ({
        type: msg.type,
        content: msg.content
      }));

      const response = await ai.generateResponse(userMessage, serializedHistory);
      
      if (!response || !Array.isArray(response.suggestions)) {
        return this.getFallbackSuggestions();
      }

      return response.suggestions.filter((s): s is string => 
        typeof s === 'string' && s.length > 0
      );
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      return this.getFallbackSuggestions();
    }
  }

  private getFallbackSuggestions(): string[] {
    return [
      'Schedule a client meeting',
      'Review portfolio performance',
      'Create a financial report',
      'Set up investment strategy'
    ];
  }

  async analyzeCRMData(data: Record<string, unknown>): Promise<AnalysisResult> {
    try {
      if (!await this.validateEnvironment()) {
        throw new Error('Environment not properly configured');
      }

      const response = await ai.analyze(JSON.stringify(data));
      return {
        summary: typeof response.summary === 'string' ? response.summary : '',
        recommendations: Array.isArray(response.recommendations) 
          ? response.recommendations.filter((r): r is string => typeof r === 'string')
          : [],
        riskLevel: this.validateRiskLevel(response.riskLevel)
      };
    } catch (error) {
      console.error('Error analyzing CRM data:', error);
      throw new Error('Failed to analyze CRM data');
    }
  }

  private validateRiskLevel(level: unknown): 'low' | 'medium' | 'high' {
    if (level === 'low' || level === 'medium' || level === 'high') {
      return level;
    }
    return 'medium';
  }

  async generateTaskSuggestions(context: string): Promise<TaskSuggestion[]> {
    try {
      if (!await this.validateEnvironment()) {
        return [];
      }

      const response = await ai.generateTasks(context);
      return Array.isArray(response.tasks) 
        ? response.tasks.filter(this.isValidTaskSuggestion)
        : [];
    } catch (error) {
      console.error('Error generating task suggestions:', error);
      return [];
    }
  }

  private isValidTaskSuggestion(task: unknown): task is TaskSuggestion {
    if (!task || typeof task !== 'object') return false;
    const t = task as Record<string, unknown>;
    return (
      typeof t.title === 'string' &&
      typeof t.description === 'string' &&
      ['low', 'medium', 'high'].includes(String(t.priority)) &&
      typeof t.dueDate === 'string' &&
      typeof t.category === 'string'
    );
  }

  createMessage(type: 'user' | 'ai', content: string, suggestions?: string[]): ChatMessage {
    return {
      id: uuidv4(),
      type,
      content: content.trim(),
      suggestions: suggestions?.map(s => s.trim())
    };
  }

  async processMessage(text: string, context?: string): Promise<ChatMessage> {
    try {
      if (!await this.validateEnvironment()) {
        throw new Error('Environment not properly configured');
      }

      const suggestions = await this.getResponseSuggestions(text);
      const lowerText = text.toLowerCase();

      // Context-aware response generation
      if (context) {
        const response = await ai.generateResponse(text, [{ type: 'system', content: context }]);
        return this.createMessage('ai', response.content, suggestions);
      }

      // Intent-based responses
      if (lowerText.includes('portfolio') || lowerText.includes('investment')) {
        return this.createMessage(
          'ai',
          'I can help you analyze portfolio performance and create investment strategies. What would you like to focus on?',
          ['Review portfolio', 'Investment strategy', 'Market analysis']
        );
      }

      if (lowerText.includes('meeting') || lowerText.includes('schedule')) {
        return this.createMessage(
          'ai',
          'I can help you schedule and manage meetings. Would you like to schedule a new meeting or review your calendar?',
          ['Schedule meeting', 'View calendar', 'Meeting summary']
        );
      }

      if (lowerText.includes('report') || lowerText.includes('analysis')) {
        return this.createMessage(
          'ai',
          'I can help generate various financial reports and analyses. What type of report would you like?',
          ['Performance report', 'Risk analysis', 'Client summary']
        );
      }

      // Default response with dynamic suggestions
      return this.createMessage(
        'ai',
        'I can assist you with portfolio management, meeting scheduling, and financial analysis. How can I help you today?',
        suggestions
      );
    } catch (error) {
      console.error('Error processing message:', error);
      return this.createMessage(
        'ai',
        'I apologize, but I encountered an error. Please try again or rephrase your request.',
        this.getFallbackSuggestions()
      );
    }
  }
}

export const aiService = new AIService();