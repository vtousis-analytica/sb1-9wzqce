export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
}

export interface Estimate {
  id: string;
  claimNumber: string;
  vehicleModel: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
  assignedTo?: string;
  bodyShop: BodyShop;
  totalCost: number;
  laborHours: number;
  paintHours: number;
  partsCost: number;
}

export interface BodyShop {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  contact: string;
  certification?: string;
  confidence: 'high' | 'medium' | 'low';
  workCount: number;
  lastWorkDate: string;
}

export interface ActionItem {
  id: string;
  estimateId: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  resolved: boolean;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  supportingDocuments?: string[];
}