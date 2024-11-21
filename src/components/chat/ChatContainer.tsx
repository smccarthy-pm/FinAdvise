import React, { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAIStore } from '../../lib/ai';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { validateEnvironment } from '../../lib/api/validation';

export function ChatContainer() {
  const navigate = useNavigate();
  const {
    messages,
    isProcessing,
    addMessage,
    setProcessing,
    setError
  } = useAIStore();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { isValid, error } = validateEnvironment();
    if (!isValid) {
      setError(error || 'Environment configuration error');
    }
  }, [setError]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isProcessing) return;

    const messageHistory = messages.map(msg => ({
      type: msg.type,
      content: msg.content
    }));

    addMessage({ type: 'user', content: text });
    setProcessing(true);

    try {
      const lowerText = text.toLowerCase();
      
      // Handle navigation based on keywords
      if (lowerText.includes('meeting') || lowerText.includes('calendar')) {
        navigate('/calendar');
      } else if (lowerText.includes('task') || lowerText.includes('todo')) {
        navigate('/');
      } else if (lowerText.includes('client') || lowerText.includes('crm')) {
        navigate('/crm');
      }

      // Add AI response
      addMessage({
        type: 'ai',
        content: 'I understand you want to ' + text + '. How can I help you with that?',
        suggestions: [
          'Schedule a meeting',
          'Create a task',
          'Generate a report',
          'Review portfolio'
        ]
      });
    } catch (error) {
      console.error('Error processing message:', error);
      setError('Failed to process message. Please try again.');
      
      addMessage({
        type: 'ai',
        content: 'I apologize, but I encountered an error. Please try again.',
        suggestions: ['Schedule meeting', 'Review portfolio', 'Generate report']
      });
    } finally {
      setProcessing(false);
      scrollToBottom();
    }
  }, [addMessage, isProcessing, messages, navigate, setError, setProcessing, scrollToBottom]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    handleSendMessage(suggestion);
  }, [handleSendMessage]);

  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col min-h-[300px] max-h-[500px]">
      <ChatHeader />
      
      <ChatMessages
        messages={messages}
        isProcessing={isProcessing}
        onSuggestionClick={handleSuggestionClick}
        messagesEndRef={messagesEndRef}
      />

      <ChatInput
        onSend={handleSendMessage}
        disabled={isProcessing}
      />
    </div>
  );
}