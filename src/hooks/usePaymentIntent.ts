import { useState, useCallback } from 'react';
import { paymentFeatureApi, PaymentIntent, CreatePaymentIntentData } from '@/services/api/paymentFeature';

interface UsePaymentIntentReturn {
    // Payment intent state
    paymentIntent: PaymentIntent | null;
    isLoading: boolean;
    error: string | null;

    // Payment intent operations
    createPaymentIntent: (data: CreatePaymentIntentData) => Promise<void>;
    confirmPaymentIntent: (paymentIntentId: string) => Promise<void>;
    getPaymentIntent: (paymentIntentId: string) => Promise<void>;
    getPaymentProcessorConfig: () => Promise<{ publishableKey: string }>;
}

/**
 * usePaymentIntent Hook
 * 
 * Manages payment intent state and operations:
 * - Create payment intent
 * - Confirm payment intent
 * - Get payment intent details
 * - Get payment processor configuration
 * - Loading and error states
 * 
 * @returns {UsePaymentIntentReturn} Payment intent state and operations
 */
export const usePaymentIntent = (): UsePaymentIntentReturn => {
    const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Create payment intent
     * @param {CreatePaymentIntentData} data - Payment intent data
     */
    const createPaymentIntent = useCallback(async (data: CreatePaymentIntentData) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await paymentFeatureApi.createPaymentIntent(data);
            setPaymentIntent(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create payment intent');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Confirm payment intent
     * @param {string} paymentIntentId - ID of payment intent to confirm
     */
    const confirmPaymentIntent = useCallback(async (paymentIntentId: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await paymentFeatureApi.confirmPaymentIntent(paymentIntentId);
            setPaymentIntent(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to confirm payment intent');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Get payment intent details
     * @param {string} paymentIntentId - ID of payment intent
     */
    const getPaymentIntent = useCallback(async (paymentIntentId: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await paymentFeatureApi.getPaymentIntent(paymentIntentId);
            setPaymentIntent(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get payment intent');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Get payment processor configuration
     * @returns {Promise<{ publishableKey: string }>} Payment processor config
     */
    const getPaymentProcessorConfig = useCallback(async (): Promise<{ publishableKey: string }> => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await paymentFeatureApi.getPaymentProcessorConfig();
            return response.data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get payment processor config');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        paymentIntent,
        isLoading,
        error,
        createPaymentIntent,
        confirmPaymentIntent,
        getPaymentIntent,
        getPaymentProcessorConfig,
    };
}; 