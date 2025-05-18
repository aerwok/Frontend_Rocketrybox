import { api } from './index';
import { CTAData } from '@/hooks/useCTA';

/**
 * CTA API service
 * 
 * This service handles all CTA-related API calls:
 * - Fetching CTA content
 * - Updating CTA content
 * - Managing CTA variations
 * 
 * TODO: Replace placeholder endpoints with actual API endpoints when ready
 */
export const ctaApi = {
    /**
     * Get CTA data
     * @returns {Promise<CTAData>} CTA content and styling
     */
    getCTAData: (): Promise<CTAData> => {
        return api.get('/cta');
    },

    /**
     * Update CTA content
     * @param {CTAData} data - Updated CTA data
     * @returns {Promise<CTAData>} Updated CTA data
     */
    updateCTAData: (data: CTAData): Promise<CTAData> => {
        return api.put('/cta', data);
    },

    /**
     * Get CTA variations
     * @returns {Promise<CTAData[]>} List of CTA variations
     */
    getCTAVariations: (): Promise<CTAData[]> => {
        return api.get('/cta/variations');
    },

    /**
     * Track CTA interaction
     * @param {string} action - User action (e.g., 'click', 'view')
     * @returns {Promise<void>} Tracking result
     */
    trackInteraction: (action: string): Promise<void> => {
        return api.post('/cta/track', { action });
    },
}; 