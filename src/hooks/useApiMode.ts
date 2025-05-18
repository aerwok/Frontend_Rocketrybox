import { useState, useEffect } from 'react';
import { apiModeService } from '@/services/api/mode';

export type ApiMode = 'real' | 'mock';

interface ApiModeConfig {
    mode: ApiMode;
    lastUpdated: string;
    features: {
        name: string;
        enabled: boolean;
    }[];
}

interface UseApiModeReturn {
    mode: ApiMode;
    config: ApiModeConfig | null;
    isLoading: boolean;
    error: string | null;
    toggleMode: () => Promise<void>;
    updateFeature: (featureName: string, enabled: boolean) => Promise<void>;
}

/**
 * Custom hook for managing API mode
 * 
 * This hook handles:
 * - Fetching API mode configuration
 * - Managing loading and error states
 * - Toggling between real and mock modes
 * - Updating feature flags
 * 
 * @returns {UseApiModeReturn} API mode data and state management
 */
export const useApiMode = (): UseApiModeReturn => {
    const [mode, setMode] = useState<ApiMode>('real');
    const [config, setConfig] = useState<ApiModeConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch API mode configuration
     */
    const fetchApiModeConfig = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await apiModeService.getConfig();
            setMode(response.mode);
            setConfig(response);
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Failed to fetch API mode configuration');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Toggle between real and mock modes
     */
    const toggleMode = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const newMode = mode === 'real' ? 'mock' : 'real';
            const response = await apiModeService.updateMode(newMode);
            setMode(response.mode);
            setConfig(response);
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Failed to toggle API mode');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Update feature flag
     * @param {string} featureName - Name of the feature
     * @param {boolean} enabled - Whether the feature is enabled
     */
    const updateFeature = async (featureName: string, enabled: boolean) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await apiModeService.updateFeature(featureName, enabled);
            setConfig(response);
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Failed to update feature flag');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch configuration on mount
    useEffect(() => {
        fetchApiModeConfig();
    }, []);

    return {
        mode,
        config,
        isLoading,
        error,
        toggleMode,
        updateFeature,
    };
}; 