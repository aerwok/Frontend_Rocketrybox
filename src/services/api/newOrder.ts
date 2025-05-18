import axios from 'axios';

/**
 * New Order API Service
 * Handles all API calls related to creating and managing new orders.
 * Replace endpoint URLs with actual backend endpoints when available.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const newOrderApi = {
  /**
   * Fetch available shipping rates for a new order.
   * @param params - The parameters for rate calculation (addresses, package, etc.)
   * @returns Promise with rates data
   */
  fetchRates: async (params: any): Promise<any> => {
    // TODO: Replace with actual endpoint
    const response = await axios.post(`${API_BASE_URL}/v1/seller/orders/rates`, params);
    return response.data;
  },

  /**
   * Create a new order.
   * @param data - The order creation payload
   * @returns Promise with created order data
   */
  createOrder: async (data: any): Promise<any> => {
    // TODO: Replace with actual endpoint
    const response = await axios.post(`${API_BASE_URL}/v1/seller/orders`, data);
    return response.data;
  },

  /**
   * Fetch available couriers/services for a new order.
   * @returns Promise with couriers/services data
   */
  fetchCouriers: async (): Promise<any> => {
    // TODO: Replace with actual endpoint
    const response = await axios.get(`${API_BASE_URL}/v1/seller/couriers`);
    return response.data;
  },

  /**
   * Fetch a single order by ID (for editing/viewing after creation).
   * @param orderId - The ID of the order
   * @returns Promise with order data
   */
  fetchOrderById: async (orderId: string): Promise<any> => {
    // TODO: Replace with actual endpoint
    const response = await axios.get(`${API_BASE_URL}/v1/seller/orders/${orderId}`);
    return response.data;
  },
}; 