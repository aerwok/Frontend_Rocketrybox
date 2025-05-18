import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { billingApi } from '../services/api/billing';
import {
    BillingSummary,
    BillingHistory,
    CreateSubscriptionRequest,
    UpdateSubscriptionRequest,
    CreatePaymentMethodRequest,
    UpdatePaymentMethodRequest,
    UseBillingReturn,
    UseBillingHistoryReturn
} from '../types/billing';

/**
 * Custom hook for managing billing data and operations
 * Handles subscription management, payment methods, and billing summary
 */
export const useBilling = (): UseBillingReturn => {
    const [summary, setSummary] = useState<BillingSummary | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch billing summary
     */
    const fetchSummary = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await billingApi.getBillingSummary();
            setSummary(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch billing summary');
            toast.error('Failed to fetch billing summary');
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Update subscription
     * @param data Subscription update data
     */
    const updateSubscription = useCallback(async (data: UpdateSubscriptionRequest) => {
        setIsLoading(true);
        setError(null);
        try {
            const updatedSummary = await billingApi.updateSubscription(data);
            setSummary(updatedSummary);
            toast.success('Subscription updated successfully');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update subscription');
            toast.error('Failed to update subscription');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Cancel subscription
     */
    const cancelSubscription = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const updatedSummary = await billingApi.cancelSubscription();
            setSummary(updatedSummary);
            toast.success('Subscription cancelled successfully');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to cancel subscription');
            toast.error('Failed to cancel subscription');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Add payment method
     * @param data Payment method creation data
     */
    const addPaymentMethod = useCallback(async (data: CreatePaymentMethodRequest) => {
        setIsLoading(true);
        setError(null);
        try {
            const paymentMethods = await billingApi.addPaymentMethod(data);
            setSummary(prev => prev ? { ...prev, paymentMethods } : null);
            toast.success('Payment method added successfully');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add payment method');
            toast.error('Failed to add payment method');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Remove payment method
     * @param id Payment method ID
     */
    const removePaymentMethod = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const paymentMethods = await billingApi.removePaymentMethod(id);
            setSummary(prev => prev ? { ...prev, paymentMethods } : null);
            toast.success('Payment method removed successfully');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to remove payment method');
            toast.error('Failed to remove payment method');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Refresh billing data
     */
    const refreshBilling = useCallback(async () => {
        await fetchSummary();
    }, [fetchSummary]);

    return {
        summary,
        isLoading,
        error,
        updateSubscription,
        cancelSubscription,
        addPaymentMethod,
        removePaymentMethod,
        refreshBilling
    };
};

/**
 * Custom hook for managing billing history
 * Handles invoice history and downloads
 */
export const useBillingHistory = (): UseBillingHistoryReturn => {
    const [history, setHistory] = useState<BillingHistory | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch billing history
     * @param page Page number
     */
    const fetchHistory = useCallback(async (page = 1) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await billingApi.getBillingHistory(page);
            setHistory(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch billing history');
            toast.error('Failed to fetch billing history');
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Download invoice
     * @param id Invoice ID
     */
    const downloadInvoice = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const blob = await billingApi.downloadInvoice(id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice-${id}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success('Invoice downloaded successfully');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to download invoice');
            toast.error('Failed to download invoice');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        history,
        isLoading,
        error,
        fetchHistory,
        downloadInvoice
    };
}; 