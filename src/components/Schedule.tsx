import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Schedule() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
        <button 
          onClick={() => navigate('/calendar')}
          className="text-indigo-600 hover:text-indigo-700"
        >
          <Calendar className="h-5 w-5" />
        </button>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg border border-indigo-100">
          <div>
            <p className="font-medium text-gray-900">Portfolio Review</p>
            <p className="text-sm text-gray-600">John Smith • Investment Strategy</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-indigo-600">2:00 PM</p>
            <p className="text-xs text-gray-500">30 min</p>
          </div>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div>
            <p className="font-medium text-gray-900">Market Update</p>
            <p className="text-sm text-gray-600">Team Meeting</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-600">4:00 PM</p>
            <p className="text-xs text-gray-500">45 min</p>
          </div>
        </div>
      </div>
    </div>
  );
}