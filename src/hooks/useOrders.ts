import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { ordersApi } from '../services/api/orders';

/**
 * Hook for managing a list of orders
 * Handles fetching, filtering, and pagination of orders
 */
export function useOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const fetchOrders = useCallback(async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await ordersApi.getOrders(params);
      setOrders(response.data);
      setTotal(response.total);
      setPage(response.page);
      setLimit(response.limit);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
      toast.error('Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshOrders = useCallback(() => {
    fetchOrders({ page, limit });
  }, [fetchOrders, page, limit]);

  useEffect(() => {
    fetchOrders({ page, limit });
  }, [fetchOrders, page, limit]);

  return {
    orders,
    isLoading,
    error,
    total,
    page,
    limit,
    totalPages,
    setPage,
    setLimit,
    fetchOrders,
    refreshOrders
  };
}

/**
 * Hook for managing a single order
 * Handles fetching, updating, and cancelling an order
 */
export function useOrder(orderId: string | null) {
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await ordersApi.getOrderById(orderId);
      setOrder(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order');
      toast.error('Failed to fetch order details');
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  const updateOrder = useCallback(async (data: any) => {
    if (!orderId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await ordersApi.updateOrder(orderId, data);
      setOrder(response.data);
      toast.success('Order updated successfully');
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to update order');
      toast.error('Failed to update order');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  const cancelOrder = useCallback(async (reason?: string) => {
    if (!orderId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await ordersApi.cancelOrder(orderId, reason);
      setOrder(response.data);
      toast.success('Order cancelled successfully');
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to cancel order');
      toast.error('Failed to cancel order');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  const generateShippingLabel = useCallback(async () => {
    if (!orderId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await ordersApi.generateShippingLabel(orderId);
      toast.success('Shipping label generated successfully');
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to generate shipping label');
      toast.error('Failed to generate shipping label');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  const trackOrder = useCallback(async () => {
    if (!orderId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await ordersApi.trackOrder(orderId);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to track order');
      toast.error('Failed to track order');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId, fetchOrder]);

  return {
    order,
    isLoading,
    error,
    fetchOrder,
    updateOrder,
    cancelOrder,
    generateShippingLabel,
    trackOrder
  };
}

/**
 * Hook for managing order filters
 * Handles filter state and application
 */
export function useOrderFilters() {
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 10
  });

  const applyFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      status: '',
      search: '',
      startDate: '',
      endDate: '',
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
} 