import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Search, SlidersHorizontal, Award, Phone, Mail, MapPin } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';

export function BodyShops() {
  const navigate = useNavigate();
  const { estimates } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [certificationFilter, setCertificationFilter] = useState('all');

  // Extract unique body shops from estimates
  const bodyShops = useMemo(() => {
    const shopsMap = new Map();
    
    estimates.forEach(estimate => {
      const shop = estimate.bodyShop;
      if (!shopsMap.has(shop.name)) {
        shopsMap.set(shop.name, {
          ...shop,
          estimateCount: 1,
          lastEstimate: estimate.uploadedAt,
        });
      } else {
        const existing = shopsMap.get(shop.name);
        existing.estimateCount++;
        if (new Date(estimate.uploadedAt) > new Date(existing.lastEstimate)) {
          existing.lastEstimate = estimate.uploadedAt;
        }
      }
    });

    return Array.from(shopsMap.values());
  }, [estimates]);

  const filteredShops = useMemo(() => {
    return bodyShops.filter(shop => {
      const matchesSearch = 
        shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.contact.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCertification = certificationFilter === 'all' || 
        (shop.certification && shop.certification.toLowerCase().includes(certificationFilter.toLowerCase()));
      return matchesSearch && matchesCertification;
    });
  }, [bodyShops, searchQuery, certificationFilter]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Body Shops</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage body shop information and view performance metrics
          </p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg">
        {/* Search and Filter Bar */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or contact..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="text-gray-400 w-5 h-5" />
              <select
                className="border border-gray-300 rounded-md py-2 px-4 focus:ring-blue-500 focus:border-blue-500"
                value={certificationFilter}
                onChange={(e) => setCertificationFilter(e.target.value)}
              >
                <option value="all">All Certifications</option>
                <option value="mercedes">Mercedes-Benz</option>
                <option value="bmw">BMW</option>
                <option value="tesla">Tesla</option>
              </select>
            </div>
          </div>
        </div>

        {/* Body Shops Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShops.map((shop) => (
              <div
                key={shop.name}
                className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{shop.name}</h3>
                      <div className="flex items-center mt-1">
                        <Award className="w-4 h-4 text-blue-500 mr-1" />
                        <span className="text-sm text-blue-600">{shop.certification}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      shop.confidence === 'high' ? 'bg-green-100 text-green-800' :
                      shop.confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {shop.confidence} confidence
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {shop.phone}
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {shop.email}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {shop.address}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Estimates</p>
                        <p className="font-medium">{shop.estimateCount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Last Work</p>
                        <p className="font-medium">
                          {new Date(shop.lastEstimate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={() => navigate(`/body-shops/${encodeURIComponent(shop.name)}`)}
                      className="w-full"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredShops.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No body shops found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}