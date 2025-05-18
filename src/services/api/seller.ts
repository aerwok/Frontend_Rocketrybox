import { api } from './index';

/**
 * Seller API service
 * 
 * This service handles all seller-related API calls:
 * - Profile management
 * - Settings
 * - Status updates
 * 
 * TODO: Replace placeholder endpoints with actual API endpoints when ready
 */
export const sellerApi = {
    /**
     * Get seller profile information
     * @returns {Promise<{ data: SellerProfile }>} Seller profile data
     */
    getProfile: () => {
        return api.get('/seller/profile');
    },

    /**
     * Update seller profile
     * @param {Partial<SellerProfile>} data - Profile data to update
     * @returns {Promise<{ data: SellerProfile }>} Updated profile data
     */
    updateProfile: (data: Partial<SellerProfile>) => {
        return api.put('/seller/profile', data);
    },

    /**
     * Upload seller logo
     * @param {FormData} formData - Logo image data
     * @returns {Promise<{ data: { logoUrl: string } }>} Uploaded logo URL
     */
    uploadLogo: (formData: FormData) => {
        return api.post('/seller/logo', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    /**
     * Get seller settings
     * @returns {Promise<{ data: SellerSettings }>} Seller settings
     */
    getSettings: () => {
        return api.get('/seller/settings');
    },

    /**
     * Update seller settings
     * @param {Partial<SellerSettings>} settings - Settings to update
     * @returns {Promise<{ data: SellerSettings }>} Updated settings
     */
    updateSettings: (settings: Partial<SellerSettings>) => {
        return api.put('/seller/settings', settings);
    },
}; 