import React from 'react';
import { Clock, User, AlertCircle, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Estimate } from '../../types';
import { Button } from '../ui/Button';

interface EstimateCardProps {
  estimate: Estimate;
  onSelect?: (id: string) => void;
}

export function EstimateCard({ estimate, onSelect }: EstimateCardProps) {
  const navigate = useNavigate();
  
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_review: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  const handleViewDetails = () => {
    if (onSelect) {
      onSelect(estimate.id);
    }
    navigate(`/estimates/${estimate.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{estimate.title}</h3>
          <p className="text-sm text-gray-500">#{estimate.claimNumber}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${statusColors[estimate.status]}`}>
          {estimate.status.replace('_', ' ')}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center text-gray-600">
          <Building2 className="w-4 h-4 mr-2" />
          <span className="text-sm">
            {estimate.bodyShop.name}
            <span className="ml-1 px-1.5 py-0.5 text-xs rounded bg-blue-100 text-blue-800">
              {estimate.bodyShop.confidence}
            </span>
          </span>
        </div>

        <div className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <span className="text-sm">
            {new Date(estimate.uploadedAt).toLocaleDateString()}
          </span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <User className="w-4 h-4 mr-2" />
          <span className="text-sm">
            {estimate.assignedTo?.name || 'Unassigned'}
          </span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span className="text-sm">
            {estimate.actionItems.length} action items
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <p className="text-gray-500">Labor Hours</p>
            <p className="font-medium">{estimate.laborHours}</p>
          </div>
          <div>
            <p className="text-gray-500">Paint Hours</p>
            <p className="font-medium">{estimate.paintHours}</p>
          </div>
        </div>

        <Button
          onClick={handleViewDetails}
          className="w-full"
        >
          View Details
        </Button>
      </div>
    </div>
  );
}