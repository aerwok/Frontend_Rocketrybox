import { useState, useEffect } from 'react';
import { uiApi, ComponentConfig } from '@/services/api/ui';

interface UseComponentReturn {
    config: ComponentConfig | null;
    isLoading: boolean;
    error: string | null;
    updateConfig: (config: Partial<ComponentConfig>) => Promise<void>;
    refetch: () => Promise<void>;
}

/**
 * Custom hook for managing individual component state and configuration
 * 
 * This hook handles:
 * - Component configuration
 * - Loading and error states
 * - Configuration updates
 * - Data refetching
 * 
 * @param {string} componentId - ID of the component
 * @returns {UseComponentReturn} Component data and state management functions
 */
export const useComponent = (componentId: string): UseComponentReturn => {
    const [config, setConfig] = useState<ComponentConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch component configuration
     */
    const fetchComponentConfig = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const data = await uiApi.getComponentConfig(componentId);
            setConfig(data);
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Failed to fetch component configuration');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Update component configuration
     * @param {Partial<ComponentConfig>} newConfig - New component configuration
     */
    const updateConfig = async (newConfig: Partial<ComponentConfig>) => {
        try {
            setIsLoading(true);
            setError(null);

            const updatedConfig = await uiApi.updateComponentConfig(componentId, newConfig);
            setConfig(updatedConfig);
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Failed to update component configuration');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch data on mount and when componentId changes
    useEffect(() => {
        fetchComponentConfig();
    }, [componentId]);

    return {
        config,
        isLoading,
        error,
        updateConfig,
        refetch: fetchComponentConfig,
    };
}; 