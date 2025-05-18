import { api } from './index';
import { ApiMode } from '@/hooks/useApiMode';

interface ApiModeConfig {
    mode: ApiMode;
    lastUpdated: string;
    features: {
        name: string;
        enabled: boolean;
    }[];
}

/**
 * API Mode service
 * 
 * This service handles all API mode-related calls:
 * - Fetching mode configuration
 * - Updating mode settings
 * - Managing feature flags
 * 
 * TODO: Replace placeholder endpoints with actual API endpoints when ready
 */
export const apiModeService = {
    /**
     * Get API mode configuration
     * @returns {Promise<ApiModeConfig>} Current mode configuration
     */
    getConfig: (): Promise<ApiModeConfig> => {
        return api.get('/api-mode/config');
    },

    /**
     * Update API mode
     * @param {ApiMode} mode - New mode ('real' or 'mock')
     * @returns {Promise<ApiModeConfig>} Updated configuration
     */
    updateMode: (mode: ApiMode): Promise<ApiModeConfig> => {
        return api.put('/api-mode/config', { mode });
    },

    /**
     * Update feature flag
     * @param {string} featureName - Name of the feature
     * @param {boolean} enabled - Whether the feature is enabled
     * @returns {Promise<ApiModeConfig>} Updated configuration
     */
    updateFeature: (featureName: string, enabled: boolean): Promise<ApiModeConfig> => {
        return api.put(`/api-mode/features/${featureName}`, { enabled });
    },

    /**
     * Get feature flags
     * @returns {Promise<ApiModeConfig['features']>} List of feature flags
     */
    getFeatures: (): Promise<ApiModeConfig['features']> => {
        return api.get('/api-mode/features');
    },
}; 