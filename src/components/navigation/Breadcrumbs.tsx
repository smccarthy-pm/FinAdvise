import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routes: Record<string, string> = {
  '/': 'Dashboard',
  '/calendar': 'Calendar',
  '/crm': 'Client Management'
};

export function Breadcrumbs() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600">
      <Link 
        to="/" 
        className="flex items-center hover:text-indigo-600"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
        return (
          <React.Fragment key={path}>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link 
              to={path}
              className="hover:text-indigo-600"
            >
              {routes[path]}
            </Link>
          </React.Fragment>
        );
      })}
    </nav>
  );
}