import React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format } from 'date-fns';

interface CalendarHeaderProps {
  currentDate: Date;
  viewType: 'month' | 'week' | 'day';
  onViewChange: (view: 'month' | 'week' | 'day') => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  onNewEvent: () => void;
}

export function CalendarHeader({
  currentDate,
  viewType,
  onViewChange,
  onNavigate,
  onNewEvent
}: CalendarHeaderProps) {
  const getDateLabel = () => {
    switch (viewType) {
      case 'month':
        return format(currentDate, 'MMMM yyyy');
      case 'week':
        return `Week of ${format(currentDate, 'MMM d, yyyy')}`;
      case 'day':
        return format(currentDate, 'EEEE, MMMM d, yyyy');
      default:
        return '';
    }
  };

  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Calendar</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('prev')}
              className="p-1 rounded-lg hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-lg font-medium text-gray-900">
              {getDateLabel()}
            </span>
            <button
              onClick={() => onNavigate('next')}
              className="p-1 rounded-lg hover:bg-gray-100"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex rounded-lg border border-gray-300 p-1">
            {(['month', 'week', 'day'] as const).map((view) => (
              <button
                key={view}
                onClick={() => onViewChange(view)}
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  viewType === view
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={onNewEvent}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" />
            New Event
          </button>
        </div>
      </div>
    </div>
  );
}