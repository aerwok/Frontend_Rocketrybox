import axios from 'axios';
import {
    Dispute,
    DisputeList,
    DisputeSummary,
    CreateDisputeRequest,
    UpdateDisputeRequest,
    DisputeFilterParams
} from '../../types/dispute';

/**
 * Dispute API Service
 * Handles all dispute-related API calls
 */
export const disputeApi = {
    /**
     * Get dispute summary statistics
     * @returns Promise<DisputeSummary>
     */
    getDisputeSummary: async (): Promise<DisputeSummary> => {
        const response = await axios.get('/api/v2/seller/disputes/summary');
        return response.data.data;
    },

    /**
     * Get list of disputes with optional filtering
     * @param params Filter parameters
     * @returns Promise<DisputeList>
     */
    getDisputes: async (params: DisputeFilterParams = {}): Promise<DisputeList> => {
        const response = await axios.get('/api/v2/seller/disputes', { params });
        return response.data.data;
    },

    /**
     * Get a single dispute by ID
     * @param id Dispute ID
     * @returns Promise<Dispute>
     */
    getDispute: async (id: string): Promise<Dispute> => {
        const response = await axios.get(`/api/v2/seller/disputes/${id}`);
        return response.data.data;
    },

    /**
     * Create a new dispute
     * @param data Dispute creation data
     * @returns Promise<Dispute>
     */
    createDispute: async (data: CreateDisputeRequest): Promise<Dispute> => {
        const response = await axios.post('/api/v2/seller/disputes', data);
        return response.data.data;
    },

    /**
     * Update an existing dispute
     * @param id Dispute ID
     * @param data Update data
     * @returns Promise<Dispute>
     */
    updateDispute: async (id: string, data: UpdateDisputeRequest): Promise<Dispute> => {
        const response = await axios.patch(`/api/v2/seller/disputes/${id}`, data);
        return response.data.data;
    },

    /**
     * Resolve a dispute
     * @param id Dispute ID
     * @param resolution Resolution text
     * @returns Promise<Dispute>
     */
    resolveDispute: async (id: string, resolution: string): Promise<Dispute> => {
        const response = await axios.post(`/api/v2/seller/disputes/${id}/resolve`, { resolution });
        return response.data.data;
    },

    /**
     * Close a dispute
     * @param id Dispute ID
     * @returns Promise<Dispute>
     */
    closeDispute: async (id: string): Promise<Dispute> => {
        const response = await axios.post(`/api/v2/seller/disputes/${id}/close`);
        return response.data.data;
    },

    /**
     * Reopen a closed dispute
     * @param id Dispute ID
     * @returns Promise<Dispute>
     */
    reopenDispute: async (id: string): Promise<Dispute> => {
        const response = await axios.post(`/api/v2/seller/disputes/${id}/reopen`);
        return response.data.data;
    },

    /**
     * Upload dispute attachments
     * @param id Dispute ID
     * @param files Array of files to upload
     * @returns Promise<string[]> Array of uploaded file URLs
     */
    uploadAttachments: async (id: string, files: File[]): Promise<string[]> => {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));

        const response = await axios.post(`/api/v2/seller/disputes/${id}/attachments`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data.data;
    },

    /**
     * Delete dispute attachments
     * @param id Dispute ID
     * @param attachmentUrls Array of attachment URLs to delete
     * @returns Promise<void>
     */
    deleteAttachments: async (id: string, attachmentUrls: string[]): Promise<void> => {
        await axios.delete(`/api/v2/seller/disputes/${id}/attachments`, {
            data: { urls: attachmentUrls }
        });
    }
}; 