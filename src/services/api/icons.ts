import { api } from './index';
import { IconData } from '@/hooks/useIcons';

/**
 * Icons API service
 * 
 * This service handles all icon-related API calls:
 * - Fetching icon data
 * - Updating icon data
 * - Managing icon variations
 * 
 * TODO: Replace placeholder endpoints with actual API endpoints when ready
 */
export const iconsApi = {
    /**
     * Get all icons
     * @returns {Promise<Record<string, IconData>>} Icon data for all icons
     */
    getIcons: (): Promise<Record<string, IconData>> => {
        return api.get('/icons');
    },

    /**
     * Get icon by name
     * @param {string} name - Icon name
     * @returns {Promise<IconData>} Icon data
     */
    getIcon: (name: string): Promise<IconData> => {
        return api.get(`/icons/${name}`);
    },

    /**
     * Update icon data
     * @param {string} name - Icon name
     * @param {IconData} data - Updated icon data
     * @returns {Promise<IconData>} Updated icon data
     */
    updateIcon: (name: string, data: IconData): Promise<IconData> => {
        return api.put(`/icons/${name}`, data);
    },

    /**
     * Get icon variations
     * @param {string} name - Icon name
     * @returns {Promise<IconData[]>} List of icon variations
     */
    getIconVariations: (name: string): Promise<IconData[]> => {
        return api.get(`/icons/${name}/variations`);
    },
}; 