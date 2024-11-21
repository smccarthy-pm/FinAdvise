import React from 'react';
import { format, isSameDay, isSameMonth } from 'date-fns';
import { Clock, Edit2 } from 'lucide-react';
import { Event } from '../../types/event';

interface CalendarGridProps {
  days: Date[];
  viewType: 'month' | 'week' | 'day';
  events: Event[];
  getEventsForDay: (date: Date) => Event[];
  onEventClick: (event: Event) => void;
  onEventEdit: (event: Event) => void;
}

export function CalendarGrid({ 
  days, 
  viewType, 
  getEventsForDay,
  onEventClick,
  onEventEdit
}: CalendarGridProps) {
  const gridCols = viewType === 'month' ? 'grid-cols-7' : viewType === 'week' ? 'grid-cols-7' : 'grid-cols-1';
  
  return (
    <div className={`grid ${gridCols} gap-4 p-6`}>
      {/* Weekday headers */}
      {viewType !== 'day' && (
        <>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-center">
              <div className="text-sm font-medium text-gray-500">{day}</div>
            </div>
          ))}
        </>
      )}

      {/* Calendar days */}
      {days.map((day, i) => (
        <div 
          key={i} 
          className={`min-h-[150px] ${
            viewType === 'day' ? 'min-h-[500px]' : ''
          } ${
            !isSameMonth(day, days[0]) ? 'bg-gray-50' : ''
          }`}
        >
          <div className="text-center mb-2">
            {viewType === 'month' && (
              <div className={`text-lg font-semibold ${
                isSameDay(day, new Date()) 
                  ? 'text-indigo-600' 
                  : 'text-gray-900'
              }`}>
                {format(day, 'd')}
              </div>
            )}
          </div>
          <div className="space-y-2">
            {getEventsForDay(day).map(event => (
              <div
                key={event.id}
                className="p-2 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => onEventClick(event)}
                  >
                    <div className="font-medium text-sm text-gray-900">
                      {event.title}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                      <Clock className="w-3 h-3" />
                      <span>{event.time}</span>
                      <span>•</span>
                      <span>{event.duration} min</span>
                    </div>
                    {event.client && (
                      <div className="mt-1 text-xs text-gray-600">
                        {event.client}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => onEventEdit(event)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-indigo-200 rounded"
                  >
                    <Edit2 className="w-3 h-3 text-indigo-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}