import axios from 'axios';
import {
    NDRListResponse,
    NDRResponse,
    NDRFilters,
    NDRCreateRequest,
    NDRUpdateRequest,
    NDRAttemptRequest,
    NDRResolutionRequest
} from '../../types/ndr';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * NDR API Service
 * Handles all NDR-related API calls
 */
export const ndrApi = {
    /**
     * Get list of NDRs with optional filtering
     */
    getNDRs: async (filters?: NDRFilters): Promise<NDRListResponse> => {
        const response = await axios.get(`${API_BASE_URL}/v1/seller/ndr`, {
            params: filters
        });
        return response.data;
    },

    /**
     * Get a single NDR by ID
     */
    getNDR: async (id: string): Promise<NDRResponse> => {
        const response = await axios.get(`${API_BASE_URL}/v1/seller/ndr/${id}`);
        return response.data;
    },

    /**
     * Create a new NDR
     */
    createNDR: async (data: NDRCreateRequest): Promise<NDRResponse> => {
        const response = await axios.post(`${API_BASE_URL}/v1/seller/ndr`, data);
        return response.data;
    },

    /**
     * Update an existing NDR
     */
    updateNDR: async (id: string, data: NDRUpdateRequest): Promise<NDRResponse> => {
        const response = await axios.patch(`${API_BASE_URL}/v1/seller/ndr/${id}`, data);
        return response.data;
    },

    /**
     * Add a delivery attempt to an NDR
     */
    addNDRAttempt: async (id: string, data: NDRAttemptRequest): Promise<NDRResponse> => {
        const response = await axios.post(`${API_BASE_URL}/v1/seller/ndr/${id}/attempt`, data);
        return response.data;
    },

    /**
     * Resolve an NDR
     */
    resolveNDR: async (id: string, data: NDRResolutionRequest): Promise<NDRResponse> => {
        const response = await axios.post(`${API_BASE_URL}/v1/seller/ndr/${id}/resolve`, data);
        return response.data;
    },

    /**
     * Delete an NDR
     */
    deleteNDR: async (id: string): Promise<void> => {
        await axios.delete(`${API_BASE_URL}/v1/seller/ndr/${id}`);
    }
}; 