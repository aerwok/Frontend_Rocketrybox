import api from './index';

export interface ThemeConfig {
    id: string;
    name: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
    };
    fonts: {
        heading: string;
        body: string;
    };
    spacing: {
        base: number;
        scale: number;
    };
}

export interface ComponentConfig {
    id: string;
    name: string;
    variant: string;
    props: Record<string, any>;
    styles: Record<string, any>;
}

export interface UIData {
    theme: ThemeConfig;
    components: ComponentConfig[];
    animations: {
        id: string;
        name: string;
        config: Record<string, any>;
    }[];
}

/**
 * UI API service
 * Handles all UI-related API calls including:
 * - Theme configuration
 * - Component settings
 * - Animation presets
 */
export const uiApi = {
    /**
     * Get current theme configuration
     * @returns {Promise<ThemeConfig>} Theme configuration
     */
    getTheme: (): Promise<ThemeConfig> => {
        return api.get('/ui/theme');
    },

    /**
     * Update theme configuration
     * @param {ThemeConfig} theme - New theme configuration
     * @returns {Promise<ThemeConfig>} Updated theme
     */
    updateTheme: (theme: Partial<ThemeConfig>): Promise<ThemeConfig> => {
        return api.put('/ui/theme', theme);
    },

    /**
     * Get component configuration
     * @param {string} componentId - ID of the component
     * @returns {Promise<ComponentConfig>} Component configuration
     */
    getComponentConfig: (componentId: string): Promise<ComponentConfig> => {
        return api.get(`/ui/components/${componentId}`);
    },

    /**
     * Update component configuration
     * @param {string} componentId - ID of the component
     * @param {Partial<ComponentConfig>} config - New component configuration
     * @returns {Promise<ComponentConfig>} Updated component configuration
     */
    updateComponentConfig: (
        componentId: string,
        config: Partial<ComponentConfig>
    ): Promise<ComponentConfig> => {
        return api.put(`/ui/components/${componentId}`, config);
    },

    /**
     * Get animation presets
     * @returns {Promise<UIData['animations']>} Animation presets
     */
    getAnimations: (): Promise<UIData['animations']> => {
        return api.get('/ui/animations');
    },

    /**
     * Get all UI data
     * @returns {Promise<UIData>} Complete UI configuration
     */
    getAllUIData: (): Promise<UIData> => {
        return api.get('/ui');
    },
}; 