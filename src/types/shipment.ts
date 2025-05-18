/**
 * Shipment Types
 * Defines the structure for shipment data and related operations
 */

export interface ShipmentFilters {
  startDate?: string;
  endDate?: string;
  status?: ShipmentStatus;
  type?: ShipmentType;
  search?: string;
  page?: number;
  limit?: number;
}

export type ShipmentType = 
  | 'standard'
  | 'express'
  | 'cod';

export type ShipmentStatus = 
  | 'pending'
  | 'processing'
  | 'in_transit'
  | 'delivered'
  | 'failed'
  | 'cancelled';

export interface Address {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface ShipmentItem {
  id: string;
  name: string;
  quantity: number;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  declaredValue: number;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  type: ShipmentType;
  status: ShipmentStatus;
  source: Address;
  destination: Address;
  items: ShipmentItem[];
  totalWeight: number;
  totalValue: number;
  shippingCost: number;
  paymentMode: 'prepaid' | 'cod';
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  notes?: string;
  error?: string;
}

export interface ShipmentResponse {
  shipments: Shipment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ShipmentStats {
  total: number;
  pending: number;
  processing: number;
  in_transit: number;
  delivered: number;
  failed: number;
  cancelled: number;
  byType: {
    [key in ShipmentType]: number;
  };
  byStatus: {
    [key in ShipmentStatus]: number;
  };
  revenue: {
    total: number;
    byType: {
      [key in ShipmentType]: number;
    };
  };
}

export interface ShipmentUpdate {
  status?: ShipmentStatus;
  notes?: string;
  estimatedDelivery?: string;
} 