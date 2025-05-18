import { useState, useCallback } from 'react';
import { paymentApi, PaymentHistory } from '@/services/api/payment';

interface UsePaymentHistoryReturn {
    // Payment history state
    paymentHistory: PaymentHistory[];
    totalItems: number;
    currentPage: number;
    isLoading: boolean;
    error: string | null;

    // Payment history operations
    fetchPaymentHistory: (page?: number, limit?: number) => Promise<void>;
}

/**
 * usePaymentHistory Hook
 * 
 * Manages payment history state and operations:
 * - Fetch payment history with pagination
 * - Loading and error states
 * 
 * @returns {UsePaymentHistoryReturn} Payment history state and operations
 */
export const usePaymentHistory = (): UsePaymentHistoryReturn => {
    const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch payment history
     * @param {number} page - Page number
     * @param {number} limit - Items per page
     */
    const fetchPaymentHistory = useCallback(async (page: number = 1, limit: number = 10) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await paymentApi.getPaymentHistory(page, limit);
            setPaymentHistory(response.data.items);
            setTotalItems(response.data.total);
            setCurrentPage(page);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch payment history');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        paymentHistory,
        totalItems,
        currentPage,
        isLoading,
        error,
        fetchPaymentHistory,
    };
}; 