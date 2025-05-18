/**
 * Service Check Types
 * Defines the structure for service check data and related operations
 */

export interface ServiceCheckFilters {
  startDate?: string;
  endDate?: string;
  status?: ServiceCheckStatus;
  type?: ServiceCheckType;
}

export type ServiceCheckType = 
  | 'pincode'
  | 'service'
  | 'rate'
  | 'tracking';

export type ServiceCheckStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed';

export interface ServiceCheck {
  id: string;
  type: ServiceCheckType;
  status: ServiceCheckStatus;
  sourcePincode: string;
  destinationPincode: string;
  result?: ServiceCheckResult;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

export interface ServiceCheckResult {
  isAvailable: boolean;
  serviceType?: string;
  estimatedDelivery?: string;
  rate?: number;
  message?: string;
}

export interface ServiceCheckResponse {
  checks: ServiceCheck[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ServiceCheckStats {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  byType: {
    [key in ServiceCheckType]: number;
  };
  byStatus: {
    [key in ServiceCheckStatus]: number;
  };
} 