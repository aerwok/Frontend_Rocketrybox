import { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { orderDataApi, OrderData, OrderItem, OrderStatus } from '@/services/api/orderData';

interface UseOrderDetailsReturn {
    // Order details state
    order: OrderData | null;
    items: OrderItem[];
    status: OrderStatus | null;
    isLoading: boolean;
    error: string | null;

    // Order details operations
    fetchOrderDetails: () => Promise<void>;
    fetchOrderItems: () => Promise<void>;
    fetchOrderStatus: () => Promise<void>;
    refreshOrder: () => Promise<void>;
}

/**
 * useOrderDetails Hook
 * 
 * Manages order details state and operations:
 * - Fetch order details
 * - Fetch order items
 * - Fetch order status
 * - Refresh order data
 * - Loading and error states
 * 
 * @returns {UseOrderDetailsReturn} Order details state and operations
 */
export const useOrderDetails = (): UseOrderDetailsReturn => {
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<OrderData | null>(null);
    const [items, setItems] = useState<OrderItem[]>([]);
    const [status, setStatus] = useState<OrderStatus | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch order details
     */
    const fetchOrderDetails = useCallback(async () => {
        if (!id) return;

        try {
            setIsLoading(true);
            setError(null);
            const response = await orderDataApi.getOrder(id);
            setOrder(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch order details');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    /**
     * Fetch order items
     */
    const fetchOrderItems = useCallback(async () => {
        if (!id) return;

        try {
            setIsLoading(true);
            setError(null);
            const response = await orderDataApi.getOrderItems(id);
            setItems(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch order items');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    /**
     * Fetch order status
     */
    const fetchOrderStatus = useCallback(async () => {
        if (!id) return;

        try {
            setIsLoading(true);
            setError(null);
            const response = await orderDataApi.getOrderStatus(id);
            setStatus(response.data.status);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch order status');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    /**
     * Refresh order data
     */
    const refreshOrder = useCallback(async () => {
        await Promise.all([
            fetchOrderDetails(),
            fetchOrderItems(),
            fetchOrderStatus(),
        ]);
    }, [fetchOrderDetails, fetchOrderItems, fetchOrderStatus]);

    // Initial fetch of order data
    useEffect(() => {
        refreshOrder();
    }, [refreshOrder]);

    return {
        order,
        items,
        status,
        isLoading,
        error,
        fetchOrderDetails,
        fetchOrderItems,
        fetchOrderStatus,
        refreshOrder,
    };
}; 