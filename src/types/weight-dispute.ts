/**
 * Weight Dispute Types
 * Defines the structure for weight dispute data and related operations
 */

export type DisputeStatus = 'pending' | 'in_review' | 'resolved' | 'rejected';
export type DisputePriority = 'low' | 'medium' | 'high' | 'urgent';
export type DisputeType = 'weight_mismatch' | 'dimension_mismatch' | 'label_issue' | 'other';

export interface WeightDispute {
  id: string;
  orderId: string;
  trackingNumber: string;
  carrier: string;
  type: DisputeType;
  status: DisputeStatus;
  priority: DisputePriority;
  claimedWeight: number;
  actualWeight: number;
  claimedDimensions: {
    length: number;
    width: number;
    height: number;
  };
  actualDimensions: {
    length: number;
    width: number;
    height: number;
  };
  evidence: {
    images: string[];
    documents: string[];
    notes: string;
  };
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolution?: {
    outcome: string;
    notes: string;
    refundAmount?: number;
  };
}

export interface WeightDisputeFilters {
  status?: DisputeStatus;
  type?: DisputeType;
  priority?: DisputePriority;
  carrier?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface WeightDisputeResponse {
  disputes: WeightDispute[];
  total: number;
  stats: WeightDisputeStats;
}

export interface WeightDisputeStats {
  total: number;
  byStatus: {
    [key in DisputeStatus]: number;
  };
  byType: {
    [key in DisputeType]: number;
  };
  byPriority: {
    [key in DisputePriority]: number;
  };
  byCarrier: {
    [key: string]: number;
  };
  averageResolutionTime: number;
  totalRefundAmount: number;
}

export interface WeightDisputeUpdate {
  status?: DisputeStatus;
  priority?: DisputePriority;
  evidence?: Partial<WeightDispute['evidence']>;
  resolution?: WeightDispute['resolution'];
}

export interface WeightDisputeComment {
  id: string;
  disputeId: string;
  userId: string;
  userName: string;
  content: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
} 