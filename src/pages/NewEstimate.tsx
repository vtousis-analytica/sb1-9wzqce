import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, FileText, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import type { Estimate } from '../types';

export function NewEstimate() {
  const navigate = useNavigate();
  const { addEstimate, users } = useStore();
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState<null | {
    claimNumber?: string;
    bodyShop?: {
      name?: string;
      contact?: string;
      phone?: string;
    };
    vehicle?: {
      model?: string;
      year?: string;
      vin?: string;
    };
  }>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
      setParsing(true);
      
      try {
        // Simulate parsing delay - in a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock parsed data - in a real app, this would come from the API
        setParsedData({
          claimNumber: 'CLM-2024-001',
          bodyShop: {
            name: 'Auto Body Express',
            contact: 'John Smith',
            phone: '(555) 123-4567'
          },
          vehicle: {
            model: 'Toyota Camry',
            year: '2023',
            vin: '1HGCM82633A123456'
          }
        });
      } catch (error) {
        console.error('Error parsing document:', error);
      } finally {
        setParsing(false);
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setParsedData(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parsedData) return;
    
    setUploading(true);
    try {
      const estimateId = Math.random().toString(36).substr(2, 9);
      const newEstimate: Estimate = {
        id: estimateId,
        title: `Claim #${parsedData.claimNumber}`,
        uploadedAt: new Date(),
        status: 'pending',
        documents: files.map((file, index) => ({
          id: index.toString(),
          name: file.name,
          url: URL.createObjectURL(file),
          uploadedAt: new Date(),
          uploadedBy: users[0]?.id || '',
        })),
        actionItems: [],
      };

      addEstimate(newEstimate);
      navigate(`/estimates/${estimateId}`);
    } catch (error) {
      console.error('Error creating estimate:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">New Estimate</h1>
        <p className="mt-1 text-sm text-gray-600">
          Upload an estimate document to get started. We'll automatically extract the relevant information.
        </p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {files.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">
                    PDF, PNG, JPG up to 10MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="h-6 w-6 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {parsing && (
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Analyzing document...</span>
              </div>
            )}

            {parsedData && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-green-800">Information Extracted</h3>
                <dl className="mt-2 divide-y divide-green-200">
                  <div className="py-2">
                    <dt className="text-xs text-green-700">Claim Number</dt>
                    <dd className="text-sm font-medium text-green-900">{parsedData.claimNumber}</dd>
                  </div>
                  <div className="py-2">
                    <dt className="text-xs text-green-700">Body Shop</dt>
                    <dd className="text-sm font-medium text-green-900">
                      {parsedData.bodyShop?.name} ({parsedData.bodyShop?.contact})
                    </dd>
                  </div>
                  <div className="py-2">
                    <dt className="text-xs text-green-700">Vehicle</dt>
                    <dd className="text-sm font-medium text-green-900">
                      {parsedData.vehicle?.year} {parsedData.vehicle?.model}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/my-work')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!parsedData || uploading}
              className="relative"
            >
              {uploading && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              Create Estimate
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}