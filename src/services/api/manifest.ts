import axios from 'axios';
import {
    Manifest,
    ManifestListResponse,
    ManifestResponse,
    CreateManifestRequest,
    UpdateManifestRequest,
    ManifestFilterParams
} from '../../types/manifest';

/**
 * Manifest API Service
 * Handles all manifest-related API calls
 */
export const manifestApi = {
    /**
     * Get list of manifests with optional filtering
     * @param params Filter parameters
     * @returns Promise<ManifestListResponse>
     */
    getManifests: async (params?: ManifestFilterParams): Promise<ManifestListResponse> => {
        const response = await axios.get('/api/v2/seller/manifests', { params });
        return response.data;
    },

    /**
     * Get a single manifest by ID
     * @param id Manifest ID
     * @returns Promise<ManifestResponse>
     */
    getManifest: async (id: string): Promise<ManifestResponse> => {
        const response = await axios.get(`/api/v2/seller/manifests/${id}`);
        return response.data;
    },

    /**
     * Create a new manifest
     * @param data Manifest creation data
     * @returns Promise<ManifestResponse>
     */
    createManifest: async (data: CreateManifestRequest): Promise<ManifestResponse> => {
        const response = await axios.post('/api/v2/seller/manifests', data);
        return response.data;
    },

    /**
     * Update an existing manifest
     * @param id Manifest ID
     * @param data Manifest update data
     * @returns Promise<ManifestResponse>
     */
    updateManifest: async (id: string, data: UpdateManifestRequest): Promise<ManifestResponse> => {
        const response = await axios.patch(`/api/v2/seller/manifests/${id}`, data);
        return response.data;
    },

    /**
     * Delete a manifest
     * @param id Manifest ID
     * @returns Promise<void>
     */
    deleteManifest: async (id: string): Promise<void> => {
        await axios.delete(`/api/v2/seller/manifests/${id}`);
    }
}; 