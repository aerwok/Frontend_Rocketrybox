import axios from 'axios';
import { Warehouse, WarehouseFilters, WarehouseResponse, WarehouseStats, WarehouseUpdate } from '@/types/warehouse';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

/**
 * Warehouse API Service
 * Handles all warehouse-related API calls
 */
export const warehouseApi = {
  /**
   * Get all warehouses with optional filters
   * @param filters WarehouseFilters
   * @returns Promise<WarehouseResponse>
   */
  getWarehouses: async (filters?: WarehouseFilters): Promise<WarehouseResponse> => {
    const response = await axios.get(`${API_URL}/warehouses`, { params: filters });
    return response.data;
  },

  /**
   * Get a single warehouse by ID
   * @param warehouseId string
   * @returns Promise<Warehouse>
   */
  getWarehouse: async (warehouseId: string): Promise<Warehouse> => {
    const response = await axios.get(`${API_URL}/warehouses/${warehouseId}`);
    return response.data;
  },

  /**
   * Create a new warehouse
   * @param warehouse Partial<Warehouse>
   * @returns Promise<Warehouse>
   */
  createWarehouse: async (warehouse: Partial<Warehouse>): Promise<Warehouse> => {
    const response = await axios.post(`${API_URL}/warehouses`, warehouse);
    return response.data;
  },

  /**
   * Update a warehouse
   * @param warehouseId string
   * @param update WarehouseUpdate
   * @returns Promise<Warehouse>
   */
  updateWarehouse: async (warehouseId: string, update: WarehouseUpdate): Promise<Warehouse> => {
    const response = await axios.patch(`${API_URL}/warehouses/${warehouseId}`, update);
    return response.data;
  },

  /**
   * Delete a warehouse
   * @param warehouseId string
   * @returns Promise<void>
   */
  deleteWarehouse: async (warehouseId: string): Promise<void> => {
    await axios.delete(`${API_URL}/warehouses/${warehouseId}`);
  },

  /**
   * Get warehouse statistics
   * @returns Promise<WarehouseStats>
   */
  getWarehouseStats: async (): Promise<WarehouseStats> => {
    const response = await axios.get(`${API_URL}/warehouses/stats`);
    return response.data;
  },

  /**
   * Update warehouse status
   * @param warehouseId string
   * @param status WarehouseStatus
   * @returns Promise<Warehouse>
   */
  updateWarehouseStatus: async (warehouseId: string, status: Warehouse['status']): Promise<Warehouse> => {
    const response = await axios.patch(`${API_URL}/warehouses/${warehouseId}/status`, { status });
    return response.data;
  },

  /**
   * Get warehouse capacity
   * @param warehouseId string
   * @returns Promise<Warehouse['capacity']>
   */
  getWarehouseCapacity: async (warehouseId: string): Promise<Warehouse['capacity']> => {
    const response = await axios.get(`${API_URL}/warehouses/${warehouseId}/capacity`);
    return response.data;
  },
}; 