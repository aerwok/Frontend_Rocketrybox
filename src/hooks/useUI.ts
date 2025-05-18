import { useState, useEffect } from 'react';
import { uiApi, ThemeConfig, ComponentConfig, UIData } from '@/services/api/ui';

interface UseUIReturn {
    theme: ThemeConfig | null;
    components: ComponentConfig[];
    animations: UIData['animations'];
    isLoading: boolean;
    error: string | null;
    updateTheme: (theme: Partial<ThemeConfig>) => Promise<void>;
    updateComponent: (componentId: string, config: Partial<ComponentConfig>) => Promise<void>;
    refetch: () => Promise<void>;
}

/**
 * Custom hook for managing UI state and configurations
 * 
 * This hook handles:
 * - Theme configuration
 * - Component settings
 * - Animation presets
 * - Loading and error states
 * - Data refetching
 * 
 * @returns {UseUIReturn} UI data and state management functions
 */
export const useUI = (): UseUIReturn => {
    const [theme, setTheme] = useState<ThemeConfig | null>(null);
    const [components, setComponents] = useState<ComponentConfig[]>([]);
    const [animations, setAnimations] = useState<UIData['animations']>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch all UI data
     */
    const fetchUIData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const data = await uiApi.getAllUIData();
            setTheme(data.theme);
            setComponents(data.components);
            setAnimations(data.animations);
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Failed to fetch UI data');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Update theme configuration
     * @param {Partial<ThemeConfig>} newTheme - New theme configuration
     */
    const updateTheme = async (newTheme: Partial<ThemeConfig>) => {
        try {
            setIsLoading(true);
            setError(null);

            const updatedTheme = await uiApi.updateTheme(newTheme);
            setTheme(updatedTheme);
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Failed to update theme');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Update component configuration
     * @param {string} componentId - ID of the component
     * @param {Partial<ComponentConfig>} config - New component configuration
     */
    const updateComponent = async (componentId: string, config: Partial<ComponentConfig>) => {
        try {
            setIsLoading(true);
            setError(null);

            const updatedComponent = await uiApi.updateComponentConfig(componentId, config);
            setComponents(prev =>
                prev.map(component =>
                    component.id === componentId ? updatedComponent : component
                )
            );
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Failed to update component');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch data on mount
    useEffect(() => {
        fetchUIData();
    }, []);

    return {
        theme,
        components,
        animations,
        isLoading,
        error,
        updateTheme,
        updateComponent,
        refetch: fetchUIData,
    };
}; 