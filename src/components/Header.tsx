import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Settings, Bell, Search, User, Grid } from 'lucide-react';

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">FinAdvise AI</h1>
          </div>
          
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients, meetings, or documents..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/marketplace')}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Grid className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <Bell className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
            <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
              <User className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}