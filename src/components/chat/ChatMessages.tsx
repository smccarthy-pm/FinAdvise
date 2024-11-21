import React from 'react';
import { Message } from '../../lib/ai/types';
import { ChatMessage } from './ChatMessage';

interface ChatMessagesProps {
  messages: Message[];
  isProcessing: boolean;
  onSuggestionClick: (suggestion: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export function ChatMessages({
  messages,
  isProcessing,
  onSuggestionClick,
  messagesEndRef
}: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-3">
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          onSuggestionClick={onSuggestionClick}
        />
      ))}
      
      {isProcessing && (
        <div className="flex justify-center">
          <div className="animate-pulse text-gray-400">Processing...</div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}