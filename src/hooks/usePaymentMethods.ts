import { useState, useCallback, useEffect } from 'react';
import { paymentApi, PaymentMethod } from '@/services/api/payment';

interface UsePaymentMethodsReturn {
    // Payment methods state
    paymentMethods: PaymentMethod[];
    isLoading: boolean;
    error: string | null;

    // Payment method operations
    fetchPaymentMethods: () => Promise<void>;
    addPaymentMethod: (paymentMethodToken: string) => Promise<void>;
    removePaymentMethod: (paymentMethodId: string) => Promise<void>;
    setDefaultPaymentMethod: (paymentMethodId: string) => Promise<void>;
}

/**
 * usePaymentMethods Hook
 * 
 * Manages payment methods state and operations:
 * - Fetch payment methods
 * - Add new payment method
 * - Remove payment method
 * - Set default payment method
 * - Loading and error states
 * 
 * @returns {UsePaymentMethodsReturn} Payment methods state and operations
 */
export const usePaymentMethods = (): UsePaymentMethodsReturn => {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch payment methods
     */
    const fetchPaymentMethods = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await paymentApi.getPaymentMethods();
            setPaymentMethods(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch payment methods');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Add new payment method
     * @param {string} paymentMethodToken - Payment method token from payment processor
     */
    const addPaymentMethod = useCallback(async (paymentMethodToken: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await paymentApi.addPaymentMethod(paymentMethodToken);
            setPaymentMethods(prev => [...prev, response.data]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add payment method');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Remove payment method
     * @param {string} paymentMethodId - ID of payment method to remove
     */
    const removePaymentMethod = useCallback(async (paymentMethodId: string) => {
        try {
            setIsLoading(true);
            setError(null);
            await paymentApi.removePaymentMethod(paymentMethodId);
            setPaymentMethods(prev => prev.filter(method => method.id !== paymentMethodId));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to remove payment method');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Set default payment method
     * @param {string} paymentMethodId - ID of payment method to set as default
     */
    const setDefaultPaymentMethod = useCallback(async (paymentMethodId: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await paymentApi.setDefaultPaymentMethod(paymentMethodId);
            setPaymentMethods(prev =>
                prev.map(method => ({
                    ...method,
                    isDefault: method.id === paymentMethodId,
                }))
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to set default payment method');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial fetch of payment methods
    useEffect(() => {
        fetchPaymentMethods();
    }, [fetchPaymentMethods]);

    return {
        paymentMethods,
        isLoading,
        error,
        fetchPaymentMethods,
        addPaymentMethod,
        removePaymentMethod,
        setDefaultPaymentMethod,
    };
}; 