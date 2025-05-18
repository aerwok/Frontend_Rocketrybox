import api from './index';
import { ApiResponse } from '@/types/api';

export interface Feature {
    id: string;
    name: string;
    description: string;
    isEnabled: boolean;
    category: string;
    dependencies: string[];
    createdAt: string;
    updatedAt: string;
    lastModifiedBy: string;
}

export interface FeatureCategory {
    id: string;
    name: string;
    description: string;
    features: Feature[];
}

export interface FeatureToggle {
    featureId: string;
    isEnabled: boolean;
    reason?: string;
    modifiedBy: string;
    modifiedAt: string;
}

/**
 * Features API service for handling feature flag management
 */
export const featuresApi = {
    /**
     * Get all features
     * @returns {Promise<ApiResponse<Feature[]>>} List of features
     */
    getFeatures: (): Promise<ApiResponse<Feature[]>> => {
        return api.get('/features');
    },

    /**
     * Get feature by ID
     * @param {string} id - Feature ID
     * @returns {Promise<ApiResponse<Feature>>} Feature details
     */
    getFeature: (id: string): Promise<ApiResponse<Feature>> => {
        return api.get(`/features/${id}`);
    },

    /**
     * Create new feature
     * @param {Omit<Feature, 'id' | 'createdAt' | 'updatedAt'>} data - Feature data
     * @returns {Promise<ApiResponse<Feature>>} Created feature
     */
    createFeature: (data: Omit<Feature, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Feature>> => {
        return api.post('/features', data);
    },

    /**
     * Update feature
     * @param {string} id - Feature ID
     * @param {Partial<Feature>} data - Updated feature data
     * @returns {Promise<ApiResponse<Feature>>} Updated feature
     */
    updateFeature: (id: string, data: Partial<Feature>): Promise<ApiResponse<Feature>> => {
        return api.put(`/features/${id}`, data);
    },

    /**
     * Delete feature
     * @param {string} id - Feature ID
     * @returns {Promise<ApiResponse<void>>}
     */
    deleteFeature: (id: string): Promise<ApiResponse<void>> => {
        return api.delete(`/features/${id}`);
    },

    /**
     * Get all feature categories
     * @returns {Promise<ApiResponse<FeatureCategory[]>>} List of categories
     */
    getCategories: (): Promise<ApiResponse<FeatureCategory[]>> => {
        return api.get('/features/categories');
    },

    /**
     * Toggle feature state
     * @param {string} id - Feature ID
     * @param {boolean} isEnabled - New feature state
     * @param {string} [reason] - Reason for toggle
     * @returns {Promise<ApiResponse<FeatureToggle>>} Toggle result
     */
    toggleFeature: (
        id: string,
        isEnabled: boolean,
        reason?: string
    ): Promise<ApiResponse<FeatureToggle>> => {
        return api.post(`/features/${id}/toggle`, { isEnabled, reason });
    },

    /**
     * Get feature toggle history
     * @param {string} id - Feature ID
     * @returns {Promise<ApiResponse<FeatureToggle[]>>} Toggle history
     */
    getToggleHistory: (id: string): Promise<ApiResponse<FeatureToggle[]>> => {
        return api.get(`/features/${id}/history`);
    },
}; 