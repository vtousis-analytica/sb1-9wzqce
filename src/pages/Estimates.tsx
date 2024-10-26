import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useStore } from '../store/useStore';
import { EstimateCard } from '../components/estimates/EstimateCard';
import { Button } from '../components/ui/Button';
import type { Estimate } from '../types';

export function Estimates() {
  const { estimates } = useStore();
  const [selectedEstimate, setSelectedEstimate] = useState<string | null>(null);

  const handleEstimateSelect = (id: string) => {
    setSelectedEstimate(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Estimates</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Estimate
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {estimates.map((estimate) => (
          <EstimateCard
            key={estimate.id}
            estimate={estimate}
            onSelect={handleEstimateSelect}
          />
        ))}
      </div>

      {estimates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No estimates found. Create your first estimate to get started.</p>
        </div>
      )}
    </div>
  );
}