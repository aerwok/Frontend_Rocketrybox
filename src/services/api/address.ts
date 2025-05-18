import { api } from './index';
import { AddressFormValues } from '@/hooks/useAddress';

/**
 * Address API service
 * 
 * This service handles all address-related API calls:
 * - Add new address
 * - Get user addresses
 * - Update address
 * - Delete address
 * 
 * TODO: Replace placeholder endpoints with actual API endpoints when ready
 */
export const addressApi = {
    /**
     * Add a new address
     * @param {AddressFormValues} data - Address form data
     * @returns {Promise<void>}
     */
    addAddress: (data: AddressFormValues) => {
        return api.post('/addresses', data);
    },

    /**
     * Get all addresses for the current user
     * @returns {Promise<AddressFormValues[]>}
     */
    getAddresses: () => {
        return api.get('/addresses');
    },

    /**
     * Update an existing address
     * @param {string} id - Address ID
     * @param {AddressFormValues} data - Updated address data
     * @returns {Promise<void>}
     */
    updateAddress: (id: string, data: AddressFormValues) => {
        return api.put(`/addresses/${id}`, data);
    },

    /**
     * Delete an address
     * @param {string} id - Address ID
     * @returns {Promise<void>}
     */
    deleteAddress: (id: string) => {
        return api.delete(`/addresses/${id}`);
    },
}; 