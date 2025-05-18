import axios from 'axios';
import { 
  WeightDispute, 
  WeightDisputeFilters, 
  WeightDisputeResponse, 
  WeightDisputeUpdate,
  WeightDisputeComment 
} from '@/types/weight-dispute';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

/**
 * Weight Dispute API Service
 * Handles all weight dispute-related API calls
 */
export const weightDisputeApi = {
  /**
   * Get all weight disputes with optional filters
   * @param filters WeightDisputeFilters
   * @returns Promise<WeightDisputeResponse>
   */
  getDisputes: async (filters?: WeightDisputeFilters): Promise<WeightDisputeResponse> => {
    const response = await axios.get(`${API_URL}/weight-disputes`, { params: filters });
    return response.data;
  },

  /**
   * Get a single weight dispute by ID
   * @param disputeId string
   * @returns Promise<WeightDispute>
   */
  getDispute: async (disputeId: string): Promise<WeightDispute> => {
    const response = await axios.get(`${API_URL}/weight-disputes/${disputeId}`);
    return response.data;
  },

  /**
   * Create a new weight dispute
   * @param dispute Partial<WeightDispute>
   * @returns Promise<WeightDispute>
   */
  createDispute: async (dispute: Partial<WeightDispute>): Promise<WeightDispute> => {
    const response = await axios.post(`${API_URL}/weight-disputes`, dispute);
    return response.data;
  },

  /**
   * Update a weight dispute
   * @param disputeId string
   * @param update WeightDisputeUpdate
   * @returns Promise<WeightDispute>
   */
  updateDispute: async (disputeId: string, update: WeightDisputeUpdate): Promise<WeightDispute> => {
    const response = await axios.patch(`${API_URL}/weight-disputes/${disputeId}`, update);
    return response.data;
  },

  /**
   * Delete a weight dispute
   * @param disputeId string
   * @returns Promise<void>
   */
  deleteDispute: async (disputeId: string): Promise<void> => {
    await axios.delete(`${API_URL}/weight-disputes/${disputeId}`);
  },

  /**
   * Get dispute comments
   * @param disputeId string
   * @returns Promise<WeightDisputeComment[]>
   */
  getComments: async (disputeId: string): Promise<WeightDisputeComment[]> => {
    const response = await axios.get(`${API_URL}/weight-disputes/${disputeId}/comments`);
    return response.data;
  },

  /**
   * Add a comment to a dispute
   * @param disputeId string
   * @param comment Partial<WeightDisputeComment>
   * @returns Promise<WeightDisputeComment>
   */
  addComment: async (disputeId: string, comment: Partial<WeightDisputeComment>): Promise<WeightDisputeComment> => {
    const response = await axios.post(`${API_URL}/weight-disputes/${disputeId}/comments`, comment);
    return response.data;
  },

  /**
   * Upload evidence files
   * @param disputeId string
   * @param files File[]
   * @returns Promise<string[]>
   */
  uploadEvidence: async (disputeId: string, files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    const response = await axios.post(`${API_URL}/weight-disputes/${disputeId}/evidence`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Update dispute status
   * @param disputeId string
   * @param status WeightDispute['status']
   * @returns Promise<WeightDispute>
   */
  updateStatus: async (disputeId: string, status: WeightDispute['status']): Promise<WeightDispute> => {
    const response = await axios.patch(`${API_URL}/weight-disputes/${disputeId}/status`, { status });
    return response.data;
  },

  /**
   * Update dispute priority
   * @param disputeId string
   * @param priority WeightDispute['priority']
   * @returns Promise<WeightDispute>
   */
  updatePriority: async (disputeId: string, priority: WeightDispute['priority']): Promise<WeightDispute> => {
    const response = await axios.patch(`${API_URL}/weight-disputes/${disputeId}/priority`, { priority });
    return response.data;
  },
}; 