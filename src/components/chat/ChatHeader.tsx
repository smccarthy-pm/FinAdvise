import React from 'react';
import { Brain } from 'lucide-react';

export function ChatHeader() {
  return (
    <div className="p-3 bg-indigo-50 border-b border-indigo-100">
      <div className="flex items-center gap-2">
        <Brain className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
      </div>
    </div>
  );
}