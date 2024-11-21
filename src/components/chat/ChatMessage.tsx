import React from 'react';
import { ChatSuggestions } from './ChatSuggestions';
import { Message } from '../../types/chat';

interface ChatMessageProps {
  message: Message;
  onSuggestionClick: (suggestion: string) => void;
}

export function ChatMessage({ message, onSuggestionClick }: ChatMessageProps) {
  return (
    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] ${
        message.type === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100'
      } rounded-lg p-2.5`}>
        <p className={message.type === 'user' ? 'text-white' : 'text-gray-800'}>
          {message.content}
        </p>
        {message.suggestions && (
          <ChatSuggestions 
            suggestions={message.suggestions} 
            onSelect={onSuggestionClick}
          />
        )}
      </div>
    </div>
  );
}