import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, PieChart, TrendingUp, Users, Briefcase } from 'lucide-react';

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        <Briefcase className="h-5 w-5 text-indigo-600" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button className="flex flex-col items-center justify-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
          <PieChart className="h-6 w-6 text-indigo-600 mb-2" />
          <span className="text-sm font-medium text-gray-900">Portfolio Analysis</span>
        </button>
        <button className="flex flex-col items-center justify-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
          <FileText className="h-6 w-6 text-indigo-600 mb-2" />
          <span className="text-sm font-medium text-gray-900">Generate Report</span>
        </button>
        <button className="flex flex-col items-center justify-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
          <TrendingUp className="h-6 w-6 text-indigo-600 mb-2" />
          <span className="text-sm font-medium text-gray-900">Market Trends</span>
        </button>
        <button 
          onClick={() => navigate('/crm')}
          className="flex flex-col items-center justify-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          <Users className="h-6 w-6 text-indigo-600 mb-2" />
          <span className="text-sm font-medium text-gray-900">Client List</span>
        </button>
      </div>
    </div>
  );
}