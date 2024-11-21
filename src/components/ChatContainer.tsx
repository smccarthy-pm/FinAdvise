import React, { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAIStore } from '../lib/ai/store';
import { MessageProcessor } from '../lib/ai/processor';
import { ChatHeader } from './chat/ChatHeader';
import { ChatMessages } from './chat/ChatMessages';
import { ChatInput } from './chat/ChatInput';

const processor = new MessageProcessor();

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
      const response = await processor.processMessage(text, messageHistory);
      
      addMessage({
        type: 'ai',
        content: response.content,
        suggestions: response.suggestions
      });

      if (response.intent === 'meeting') navigate('/calendar');
      if (response.intent === 'task') navigate('/');
      if (response.intent === 'crm') navigate('/crm');
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
    }
  }, [addMessage, isProcessing, messages, navigate, setError, setProcessing]);

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