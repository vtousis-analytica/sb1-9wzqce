import React, { useState, useMemo } from 'react';
import { Plus, Search, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';

export function MyWork() {
  const navigate = useNavigate();
  const { estimates, currentUser } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const myEstimates = useMemo(() => {
    return estimates.filter(estimate => {
      const matchesSearch = estimate.claimNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || estimate.status === statusFilter;
      const isAssigned = estimate.assignedTo?.id === currentUser?.id;
      return matchesSearch && matchesStatus && isAssigned;
    });
  }, [estimates, searchQuery, statusFilter, currentUser]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Work</h1>
          <p className="text-sm text-gray-600 mt-1">
            Estimates assigned to you for review
          </p>
        </div>
        <Button onClick={() => navigate('/new-estimate')}>
          <Plus className="w-4 h-4 mr-2" />
          New Estimate
        </Button>
      </div>

      <div className="bg-white shadow-md rounded-lg">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by claim number..."
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
                  Body Shop
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {myEstimates.map((estimate) => (
                <tr key={estimate.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {estimate.claimNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {estimate.bodyShop.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {estimate.vehicle.model}
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
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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

          {myEstimates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No estimates found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}