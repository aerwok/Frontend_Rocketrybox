import { api } from './index';
import { CourierRate } from '@/hooks/useCourierRates';

/**
 * Courier API service
 * 
 * This service handles all courier-related API calls:
 * - Get available courier rates
 * - Get courier details
 * - Get shipping estimates
 * - Track shipments
 * 
 * TODO: Replace placeholder endpoints with actual API endpoints when ready
 */
export const courierApi = {
    /**
     * Get available courier rates
     * @returns {Promise<CourierRate[]>}
     */
    getRates: () => {
        return api.get('/couriers/rates');
    },

    /**
     * Get courier details
     * @param {string} courierId - Courier identifier
     * @returns {Promise<CourierRate>}
     */
    getCourierDetails: (courierId: string) => {
        return api.get(`/couriers/${courierId}`);
    },

    /**
     * Get shipping estimate
     * @param {Object} params - Shipping parameters
     * @param {string} params.from - Source pincode
     * @param {string} params.to - Destination pincode
     * @param {number} params.weight - Package weight in kg
     * @returns {Promise<CourierRate[]>}
     */
    getShippingEstimate: (params: { from: string; to: string; weight: number }) => {
        return api.get('/couriers/estimate', { params });
    },

    /**
     * Track shipment
     * @param {string} trackingId - Shipment tracking ID
     * @returns {Promise<{ status: string; location: string; lastUpdate: string }>}
     */
    trackShipment: (trackingId: string) => {
        return api.get(`/couriers/track/${trackingId}`);
    },
}; 