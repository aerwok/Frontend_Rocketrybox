import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { codApi } from '../services/api/cod';
import {
    CODOrder,
    CODOrderSummary,
    CreateCODOrderRequest,
    UpdateCODOrderRequest,
    CODOrderFilterParams,
    UseCODOrdersReturn,
    UseCODOrderFiltersReturn
} from '../types/cod';

/**
 * Custom hook for managing COD orders
 * Handles COD order creation, updates, and cancellation
 */
export const useCODOrders = (): UseCODOrdersReturn => {
    const [orders, setOrders] = useState<CODOrder[]>([]);
    const [summary, setSummary] = useState<CODOrderSummary | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch COD order summary
     */
    const fetchSummary = useCallback(async () => {
        try {
            const data = await codApi.getCODOrderSummary();
            setSummary(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch COD summary');
            toast.error('Failed to fetch COD summary');
        }
    }, []);

    /**
     * Fetch COD orders
     */
    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { orders: data } = await codApi.getCODOrders({});
            setOrders(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch COD orders');
            toast.error('Failed to fetch COD orders');
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Create new COD order
     * @param data COD order creation data
     */
    const createCODOrder = useCallback(async (data: CreateCODOrderRequest) => {
        setIsLoading(true);
        setError(null);
        try {
            const newOrder = await codApi.createCODOrder(data);
            setOrders(prev => [newOrder, ...prev]);
            toast.success('COD order created successfully');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create COD order');
            toast.error('Failed to create COD order');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Update COD order
     * @param id COD order ID
     * @param data Update data
     */
    const updateCODOrder = useCallback(async (id: string, data: UpdateCODOrderRequest) => {
        setIsLoading(true);
        setError(null);
        try {
            const updatedOrder = await codApi.updateCODOrder(id, data);
            setOrders(prev => prev.map(order => order.id === id ? updatedOrder : order));
            toast.success('COD order updated successfully');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update COD order');
            toast.error('Failed to update COD order');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Cancel COD order
     * @param id COD order ID
     */
    const cancelCODOrder = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const updatedOrder = await codApi.cancelCODOrder(id);
            setOrders(prev => prev.map(order => order.id === id ? updatedOrder : order));
            toast.success('COD order cancelled successfully');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to cancel COD order');
            toast.error('Failed to cancel COD order');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Refresh COD orders
     */
    const refreshOrders = useCallback(async () => {
        await Promise.all([fetchOrders(), fetchSummary()]);
    }, [fetchOrders, fetchSummary]);

    // Initial fetch
    useEffect(() => {
        refreshOrders();
    }, [refreshOrders]);

    return {
        orders,
        summary,
        isLoading,
        error,
        createCODOrder,
        updateCODOrder,
        cancelCODOrder,
        refreshOrders
    };
};

/**
 * Custom hook for managing COD order filters
 * Handles filter state and application
 */
export const useCODOrderFilters = (): UseCODOrderFiltersReturn => {
    const [filters, setFilters] = useState<CODOrderFilterParams>({
        page: 1,
        limit: 10
    });

    /**
     * Apply filters
     */
    const applyFilters = useCallback(async () => {
        // This will be implemented when the backend is ready
        // For now, it's just a placeholder
        console.log('Applying filters:', filters);
    }, [filters]);

    /**
     * Reset filters to default values
     */
    const resetFilters = useCallback(() => {
        setFilters({
            page: 1,
            limit: 10
        });
    }, []);

    return {
        filters,
        setFilters,
        applyFilters,
        resetFilters
    };
}; 