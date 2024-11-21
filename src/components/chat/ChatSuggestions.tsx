import React from 'react';

interface ChatSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

export function ChatSuggestions({ suggestions, onSelect }: ChatSuggestionsProps) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {suggestions.map((suggestion, i) => (
        <button
          key={i}
          onClick={() => onSelect(suggestion)}
          className="text-sm bg-white text-indigo-600 px-3 py-1 rounded-full border border-indigo-200 hover:bg-indigo-50"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}