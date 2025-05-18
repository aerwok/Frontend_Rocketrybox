import { api } from './index';
import { FooterData } from '@/hooks/useFooter';

/**
 * Footer API service
 * 
 * This service handles all footer-related API calls:
 * - Fetching footer content
 * - Updating footer content
 * - Managing footer sections
 * 
 * TODO: Replace placeholder endpoints with actual API endpoints when ready
 */
export const footerApi = {
    /**
     * Get footer data
     * @returns {Promise<FooterData>} Footer content and structure
     */
    getFooterData: (): Promise<FooterData> => {
        return api.get('/footer');
    },

    /**
     * Update footer content
     * @param {FooterData} data - Updated footer data
     * @returns {Promise<FooterData>} Updated footer data
     */
    updateFooterData: (data: FooterData): Promise<FooterData> => {
        return api.put('/footer', data);
    },

    /**
     * Get footer section
     * @param {string} section - Section name (resources, features, partner, support)
     * @returns {Promise<FooterSection>} Section data
     */
    getFooterSection: (section: string): Promise<FooterData['sections'][keyof FooterData['sections']]> => {
        return api.get(`/footer/sections/${section}`);
    },

    /**
     * Update footer section
     * @param {string} section - Section name
     * @param {FooterSection} data - Updated section data
     * @returns {Promise<FooterSection>} Updated section data
     */
    updateFooterSection: (
        section: string,
        data: FooterData['sections'][keyof FooterData['sections']]
    ): Promise<FooterData['sections'][keyof FooterData['sections']]> => {
        return api.put(`/footer/sections/${section}`, data);
    },
}; 