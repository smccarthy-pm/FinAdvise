import React from 'react';
import { Users, TrendingUp, Clock, Calendar } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  time: string;
  duration: string;
  type: string;
  client?: string;
}

interface ClientInsightsProps {
  events: Event[];
}

export function ClientInsights({ events }: ClientInsightsProps) {
  const clientMeetings = events.filter(event => event.client);
  const uniqueClients = new Set(clientMeetings.map(event => event.client));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Meeting Insights</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
              <Users className="w-5 h-5" />
              <span className="font-medium">Clients</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{uniqueClients.size}</p>
            <p className="text-sm text-gray-600">This week</p>
          </div>
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Meetings</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{clientMeetings.length}</p>
            <p className="text-sm text-gray-600">Scheduled</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Reviews</h3>
        <div className="space-y-4">
          {clientMeetings.map(meeting => (
            <div key={meeting.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="bg-indigo-100 rounded-full p-2">
                <Clock className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{meeting.client}</p>
                <p className="text-sm text-gray-600">{meeting.title}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <span>{meeting.time}</span>
                  <span>•</span>
                  <span>{meeting.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}