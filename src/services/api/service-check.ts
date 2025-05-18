import axios from 'axios';
import { ServiceCheck, ServiceCheckFilters, ServiceCheckResponse, ServiceCheckStats } from '@/types/service-check';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

/**
 * Service Check API Service
 * Handles all service check-related API calls
 */
export const serviceCheckApi = {
  /**
   * Get all service checks with optional filters
   * @param filters ServiceCheckFilters
   * @returns Promise<ServiceCheckResponse>
   */
  getServiceChecks: async (filters?: ServiceCheckFilters): Promise<ServiceCheckResponse> => {
    const response = await axios.get(`${API_URL}/service-checks`, { params: filters });
    return response.data;
  },

  /**
   * Get a single service check by ID
   * @param checkId string
   * @returns Promise<ServiceCheck>
   */
  getServiceCheck: async (checkId: string): Promise<ServiceCheck> => {
    const response = await axios.get(`${API_URL}/service-checks/${checkId}`);
    return response.data;
  },

  /**
   * Create a new service check
   * @param type ServiceCheckType
   * @param sourcePincode string
   * @param destinationPincode string
   * @returns Promise<ServiceCheck>
   */
  createServiceCheck: async (
    type: ServiceCheck['type'],
    sourcePincode: string,
    destinationPincode: string
  ): Promise<ServiceCheck> => {
    const response = await axios.post(`${API_URL}/service-checks`, {
      type,
      sourcePincode,
      destinationPincode,
    });
    return response.data;
  },

  /**
   * Get service check statistics
   * @returns Promise<ServiceCheckStats>
   */
  getServiceCheckStats: async (): Promise<ServiceCheckStats> => {
    const response = await axios.get(`${API_URL}/service-checks/stats`);
    return response.data;
  },

  /**
   * Cancel a service check
   * @param checkId string
   * @returns Promise<void>
   */
  cancelServiceCheck: async (checkId: string): Promise<void> => {
    await axios.post(`${API_URL}/service-checks/${checkId}/cancel`);
  },
}; 