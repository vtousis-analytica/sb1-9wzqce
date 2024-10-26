import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Award, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useStore } from '../store/useStore';
import { Spinner } from '../components/ui/Spinner';
import type { Estimate } from '../types';

export function EstimateDetails() {
  const { id } = useParams();
  const { getEstimate } = useStore();
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEstimate = async () => {
      try {
        const data = await getEstimate(id!);
        setEstimate(data);
      } catch (error) {
        console.error('Error loading estimate:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEstimate();
  }, [id, getEstimate]);

  const getConfidenceIcon = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'medium':
        return <HelpCircle className="w-5 h-5 text-yellow-500" />;
      case 'low':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!estimate) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Estimate not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Estimate Details - {estimate.claimNumber}
            </h1>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              estimate.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              estimate.status === 'in_review' ? 'bg-blue-100 text-blue-800' :
              estimate.status === 'approved' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {estimate.status.replace('_', ' ')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Vehicle Information */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-900">Vehicle Information</h2>
              <p><span className="font-medium">Model:</span> {estimate.vehicle.model}</p>
              <p><span className="font-medium">Year:</span> {estimate.vehicle.year}</p>
              {estimate.vehicle.vin && (
                <p><span className="font-medium">VIN:</span> {estimate.vehicle.vin}</p>
              )}
              <p><span className="font-medium">Value:</span> ${estimate.vehicle.value.toLocaleString()}</p>
            </div>

            {/* Body Shop Information */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-900">Body Shop</h2>
              <div className="flex items-center gap-2">
                <p className="font-medium">{estimate.bodyShop.name}</p>
                {estimate.bodyShop.confidence && getConfidenceIcon(estimate.bodyShop.confidence)}
              </div>
              {estimate.bodyShop.certification && (
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-500" />
                  <p className="text-sm">{estimate.bodyShop.certification}</p>
                </div>
              )}
              <p><span className="font-medium">Contact:</span> {estimate.bodyShop.contact}</p>
              <p><span className="font-medium">Phone:</span> {estimate.bodyShop.phone}</p>
            </div>

            {/* Cost Information */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-900">Cost Summary</h2>
              <p><span className="font-medium">Labor Hours:</span> {estimate.laborHours}</p>
              <p><span className="font-medium">Paint Hours:</span> {estimate.paintHours}</p>
              <p><span className="font-medium">Parts Cost:</span> ${estimate.partsCost.toLocaleString()}</p>
              <p><span className="font-medium">Total Cost:</span> ${estimate.totalCost.toLocaleString()}</p>
            </div>
          </div>

          {/* Line Items */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Line Items</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Line</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part Number</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Labor</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Paint</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {estimate.lineItems.map((item) => (
                    <tr key={item.line}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.line}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.operation}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.partNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{item.laborHours}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{item.paintHours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}