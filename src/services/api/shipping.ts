import { api } from './index';

interface RateCard {
    mode: string;
    baseRate: number;
    additionalWeightRate: number;
    codRate: number;
    gstPercentage: number;
}

interface ShippingRate {
    mode: string;
    courier: string;
    baseCharge: number;
    additionalWeightCharge: number;
    codCharge: number;
    gst: number;
    total: number;
    gstPercentage: number;
}

/**
 * Shipping API service
 * 
 * This service handles all shipping-related API calls:
 * - Rate card management
 * - Shipping rate calculations
 * - Zone determination
 * 
 * TODO: Replace placeholder endpoints with actual API endpoints when ready
 */
export const shippingApi = {
    /**
     * Get available rate cards
     * @returns {Promise<RateCard[]>} List of rate cards
     */
    getRateCards: () => {
        return api.get('/shipping/rate-cards');
    },

    /**
     * Calculate shipping rates
     * @param {Object} params - Rate calculation parameters
     * @returns {Promise<ShippingRate[]>} Calculated shipping rates
     */
    calculateRates: (params: {
        warehousePincode: string;
        destinationPincode: string;
        weight: number;
        isCOD: boolean;
    }) => {
        return api.post('/shipping/calculate-rates', params);
    },

    /**
     * Get zone information
     * @param {string} sourcePincode - Source pincode
     * @param {string} destinationPincode - Destination pincode
     * @returns {Promise<{ zone: string }>} Zone information
     */
    getZone: (sourcePincode: string, destinationPincode: string) => {
        return api.get(`/shipping/zone?source=${sourcePincode}&destination=${destinationPincode}`);
    },

    /**
     * Validate pincode
     * @param {string} pincode - Pincode to validate
     * @returns {Promise<{ isValid: boolean; city?: string; state?: string }>} Validation result
     */
    validatePincode: (pincode: string) => {
        return api.get(`/shipping/validate-pincode/${pincode}`);
    },
}; 