import { useState } from 'react';
import { addressApi } from '../services/api/address';
import { z } from 'zod';

export const addressSchema = z.object({
    address1: z.string().min(1, "Address line 1 is required"),
    address2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    pincode: z.string().min(6, "Pincode must be 6 digits").max(6, "Pincode must be 6 digits"),
    phone: z.string().min(10, "Phone number must be 10 digits").max(10, "Phone number must be 10 digits"),
});

export type AddressFormValues = z.infer<typeof addressSchema>;

interface UseAddressReturn {
    loading: boolean;
    error: string | null;
    success: boolean;
    addAddress: (data: AddressFormValues) => Promise<void>;
    resetState: () => void;
}

/**
 * Custom hook for managing address operations
 * 
 * This hook handles:
 * - Address form validation
 * - API integration for address operations
 * - Loading, error, and success states
 * - State management for address operations
 * 
 * @returns {UseAddressReturn} Object containing address operations and states
 */
export const useAddress = (): UseAddressReturn => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    /**
     * Add a new address
     * TODO: Replace with actual API endpoint when ready
     * 
     * @param {AddressFormValues} data - Address form data
     * @returns {Promise<void>}
     */
    const addAddress = async (data: AddressFormValues) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            // TODO: Replace with actual API call
            // await addressApi.addAddress(data);
            
            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add address');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Reset all states to their initial values
     */
    const resetState = () => {
        setLoading(false);
        setError(null);
        setSuccess(false);
    };

    return {
        loading,
        error,
        success,
        addAddress,
        resetState,
    };
}; 