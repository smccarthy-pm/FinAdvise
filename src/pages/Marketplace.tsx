import React, { useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs';
import { Search, Grid, Star, ArrowUpRight, Shield, Check } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  installed: boolean;
  icon: string;
}

export function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [integrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'Portfolio Analytics Pro',
      description: 'Advanced portfolio analysis and reporting tools',
      category: 'Analytics',
      rating: 4.8,
      installed: true,
      icon: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&h=128&fit=crop'
    },
    {
      id: '2',
      name: 'Client CRM Connect',
      description: 'Seamless CRM integration for client management',
      category: 'CRM',
      rating: 4.5,
      installed: false,
      icon: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=128&h=128&fit=crop'
    },
    {
      id: '3',
      name: 'Market Data Stream',
      description: 'Real-time market data and analytics',
      category: 'Data',
      rating: 4.9,
      installed: false,
      icon: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=128&h=128&fit=crop'
    }
  ]);

  const categories = ['all', 'Analytics', 'CRM', 'Data', 'Communication', 'Compliance'];

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <PageLayout>
      <div className="mb-6 flex items-center justify-between">
        <Breadcrumbs />
      </div>

      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Integration Marketplace</h1>
              <p className="mt-1 text-gray-600">Discover and manage integrations for your workflow</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search integrations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                />
              </div>
              <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                Submit Integration
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  selectedCategory === category
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIntegrations.map((integration) => (
              <div
                key={integration.id}
                className="border border-gray-200 rounded-lg p-6 hover:border-indigo-200 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={integration.icon}
                    alt={integration.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {integration.name}
                      </h3>
                      {integration.installed && (
                        <span className="flex items-center gap-1 text-sm text-green-600">
                          <Check className="w-4 h-4" />
                          Installed
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {integration.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-sm text-gray-600">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          {integration.rating}
                        </span>
                        <span className="text-sm text-gray-600">•</span>
                        <span className="text-sm text-gray-600">{integration.category}</span>
                      </div>
                      <button className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700">
                        {integration.installed ? 'Configure' : 'Install'}
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}