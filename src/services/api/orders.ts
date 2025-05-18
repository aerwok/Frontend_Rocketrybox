import axios from 'axios';

/**
 * Orders API Service
 * Handles all API calls related to managing orders.
 * Replace endpoint URLs with actual backend endpoints when available.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const ordersApi = {
  /**
   * Fetch a list of orders with optional filtering and pagination
   * @param params - Filter and pagination parameters
   * @returns Promise with orders data and pagination info
   */
  getOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<any> => {
    const response = await axios.get(`${API_BASE_URL}/v1/seller/orders`, { params });
    return response.data;
  },

  /**
   * Fetch a single order by ID
   * @param orderId - The ID of the order to fetch
   * @returns Promise with order data
   */
  getOrderById: async (orderId: string): Promise<any> => {
    const response = await axios.get(`${API_BASE_URL}/v1/seller/orders/${orderId}`);
    return response.data;
  },

  /**
   * Update an existing order
   * @param orderId - The ID of the order to update
   * @param data - The updated order data
   * @returns Promise with updated order data
   */
  updateOrder: async (orderId: string, data: any): Promise<any> => {
    const response = await axios.patch(`${API_BASE_URL}/v1/seller/orders/${orderId}`, data);
    return response.data;
  },

  /**
   * Cancel an order
   * @param orderId - The ID of the order to cancel
   * @param reason - Optional reason for cancellation
   * @returns Promise with updated order data
   */
  cancelOrder: async (orderId: string, reason?: string): Promise<any> => {
    const response = await axios.post(`${API_BASE_URL}/v1/seller/orders/${orderId}/cancel`, { reason });
    return response.data;
  },

  /**
   * Generate shipping label for an order
   * @param orderId - The ID of the order
   * @returns Promise with shipping label data
   */
  generateShippingLabel: async (orderId: string): Promise<any> => {
    const response = await axios.post(`${API_BASE_URL}/v1/seller/orders/${orderId}/shipping-label`);
    return response.data;
  },

  /**
   * Track an order's shipment
   * @param orderId - The ID of the order to track
   * @returns Promise with tracking data
   */
  trackOrder: async (orderId: string): Promise<any> => {
    const response = await axios.get(`${API_BASE_URL}/v1/seller/orders/${orderId}/tracking`);
    return response.data;
  },

  /**
   * Export orders data
   * @param params - Filter parameters for export
   * @returns Promise with export data
   */
  exportOrders: async (params?: {
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<any> => {
    const response = await axios.get(`${API_BASE_URL}/v1/seller/orders/export`, { params });
    return response.data;
  }
}; 