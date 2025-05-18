import { api } from './index';
import { NavLink } from '@/hooks/useCustomerNav';

/**
 * Customer API service
 * 
 * This service handles all customer-related API calls:
 * - Navigation links
 * - Authentication
 * - Profile management
 * 
 * TODO: Replace placeholder endpoints with actual API endpoints when ready
 */
export const customerApi = {
    /**
     * Get navigation links for customer
     * @returns {Promise<NavLink[]>}
     */
    getNavLinks: () => {
        return api.get('/customer/navigation');
    },

    /**
     * Validate customer authentication token
     * @param {string} token - Authentication token
     * @returns {Promise<{ isValid: boolean }>}
     */
    validateToken: (token: string) => {
        return api.post('/customer/validate-token', { token });
    },

    /**
     * Get customer profile
     * @returns {Promise<{ id: string; name: string; email: string }>}
     */
    getProfile: () => {
        return api.get('/customer/profile');
    },

    /**
     * Update customer profile
     * @param {Object} data - Profile update data
     * @returns {Promise<{ success: boolean }>}
     */
    updateProfile: (data: { name?: string; email?: string }) => {
        return api.put('/customer/profile', data);
    },
}; 