/**
 * Warehouse Types
 * Defines the structure for warehouse data and related operations
 */

export type WarehouseStatus = 'active' | 'inactive' | 'maintenance';

export interface Warehouse {
  id: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  status: WarehouseStatus;
  capacity: {
    total: number;
    used: number;
    available: number;
  };
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  operatingHours: {
    open: string;
    close: string;
    timezone: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface WarehouseFilters {
  status?: WarehouseStatus;
  search?: string;
  country?: string;
  state?: string;
}

export interface WarehouseResponse {
  warehouses: Warehouse[];
  total: number;
}

export interface WarehouseStats {
  total: number;
  byStatus: {
    [key in WarehouseStatus]: number;
  };
  byCountry: {
    [key: string]: number;
  };
  totalCapacity: number;
  usedCapacity: number;
}

export interface WarehouseUpdate {
  name?: string;
  address?: Partial<Warehouse['address']>;
  status?: WarehouseStatus;
  contact?: Partial<Warehouse['contact']>;
  operatingHours?: Partial<Warehouse['operatingHours']>;
} 