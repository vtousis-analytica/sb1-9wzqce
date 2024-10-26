import React, { useState, useMemo } from 'react';
import { BarChart, FileText, AlertCircle, Search, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';

export function Dashboard() {
  const navigate = useNavigate();
  const { estimates } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const stats = [
    {
      title: 'Total Estimates',
      value: estimates.length,
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      title: 'Pending Reviews',
      value: estimates.filter(e => e.status === 'pending').length,
      icon: AlertCircle,
      color: 'text-yellow-600',
    },
    {
      title: 'Monthly Estimates',
      value: estimates.filter(e => {
        const date = new Date(e.uploadedAt);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      }).length,
      icon: BarChart,
      color: 'text-purple-600',
    },
  ];

  const filteredEstimates = useMemo(() => {
    return estimates.filter(estimate => {
      const matchesSearch = estimate.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || estimate.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [estimates, searchQuery, statusFilter]);

  // Get current hour to determine greeting
  const hour = new Date().getHours();
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
  if (hour >= 17) greeting = 'Good evening';

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">{greeting}!</h1>
        <p className="text-gray-600">Here's what's happening with your estimates today.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
              </div>
              <stat.icon className={`w-12 h-12 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Estimates</h2>
        </div>

        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search estimates..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="text-gray-400 w-5 h-5" />
              <select
                className="border border-gray-300 rounded-md py-2 px-4 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_review">In Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Claim Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEstimates.map((estimate) => (
                <tr key={estimate.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {estimate.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {estimate.assignedTo?.name || 'Unassigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(estimate.uploadedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      estimate.status === 'approved' ? 'bg-green-100 text-green-800' :
                      estimate.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      estimate.status === 'in_review' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {estimate.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/estimates/${estimate.id}`)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredEstimates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No estimates found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}