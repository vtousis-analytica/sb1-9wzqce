import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, Phone, Mail, MapPin, Award, FileText, DollarSign } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';

export function BodyShopDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { estimates } = useStore();
  
  // Find all estimates for this shop
  const shopEstimates = estimates.filter(e => e.bodyShop.name === decodeURIComponent(id || ''));
  const shop = shopEstimates[0]?.bodyShop;

  if (!shop) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Body shop not found.</p>
        <Button onClick={() => navigate('/body-shops')} className="mt-4">
          Return to Body Shops
        </Button>
      </div>
    );
  }

  const rateComparison = [
    { item: 'Body Labor', shopRate: 65, suggestedRate: 60 },
    { item: 'Paint Labor', shopRate: 70, suggestedRate: 65 },
    { item: 'Frame Labor', shopRate: 75, suggestedRate: 70 },
    { item: 'Mechanical Labor', shopRate: 175, suggestedRate: 160 },
    { item: 'Paint Materials', shopRate: 45, suggestedRate: 40 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <Building2 className="w-8 h-8 text-gray-700 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{shop.name}</h1>
                <div className="flex items-center mt-1">
                  <Award className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="text-sm font-medium text-blue-600">{shop.certification}</span>
                </div>
              </div>
            </div>
          </div>
          <Button onClick={() => navigate('/body-shops')}>
            Back to Body Shops
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center">
            <Phone className="w-5 h-5 text-gray-400 mr-2" />
            <span>{shop.phone}</span>
          </div>
          <div className="flex items-center">
            <Mail className="w-5 h-5 text-gray-400 mr-2" />
            <span>{shop.email}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-5 h-5 text-gray-400 mr-2" />
            <span>{shop.address}</span>
          </div>
        </div>
      </div>

      {/* Shop Rates */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Shop Rates</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Operation</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Shop Rate</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Market Rate</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Difference</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rateComparison.map((rate, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rate.item}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">${rate.shopRate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">${rate.suggestedRate}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                      rate.shopRate > rate.suggestedRate ? 'text-red-600' : 'text-green-600'
                    }`}>
                      ${Math.abs(rate.shopRate - rate.suggestedRate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-xMF9ev9YINS4RuS6Q1WFtgRMVLyFXf.png"
              alt="Shop Posted Rates"
              className="rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Recent Estimates */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Recent Estimates</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estimate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {shopEstimates.map((estimate) => (
                <tr key={estimate.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{estimate.title}</span>
                    </div>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <div className="flex items-center justify-end">
                      <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                      {estimate.totalCost.toLocaleString()}
                    </div>
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

          {shopEstimates.length === 0 && (
            <p className="text-center py-4 text-gray-500">
              No estimates found for this body shop.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}