import axios from 'axios';
import { RateCalculationInput, RateCalculationResult, PincodeDetails, ServiceType } from '@/types/rate-calculator';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

/**
 * Rate Calculator API Service
 * Handles all rate calculation related API calls
 */
export const rateCalculatorApi = {
  /**
   * Calculate shipping rate based on input parameters
   * @param data RateCalculationInput
   * @returns Promise<RateCalculationResult>
   */
  calculateRate: async (data: RateCalculationInput): Promise<RateCalculationResult> => {
    const response = await axios.post(`${API_URL}/rate-calculator/calculate`, data);
    return response.data;
  },

  /**
   * Get pincode details
   * @param pincode string
   * @returns Promise<PincodeDetails>
   */
  getPincodeDetails: async (pincode: string): Promise<PincodeDetails> => {
    const response = await axios.get(`${API_URL}/rate-calculator/pincode/${pincode}`);
    return response.data;
  },

  /**
   * Get available service types
   * @returns Promise<ServiceType[]>
   */
  getServiceTypes: async (): Promise<ServiceType[]> => {
    const response = await axios.get(`${API_URL}/rate-calculator/service-types`);
    return response.data;
  },

  /**
   * Validate pincode
   * @param pincode string
   * @returns Promise<boolean>
   */
  validatePincode: async (pincode: string): Promise<boolean> => {
    const response = await axios.get(`${API_URL}/rate-calculator/validate-pincode/${pincode}`);
    return response.data.isValid;
  },
}; 