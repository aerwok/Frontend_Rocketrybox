import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { orderApi } from '@/services/api/order';
import { Order, OrderFilters, OrderResponse } from '@/types/order';

/**
 * Hook for managing orders list with pagination and filters
 */
export const useOrders = (initialFilters?: OrderFilters) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<OrderFilters>({
    page: 1,
    limit: 10,
    ...initialFilters,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderApi.getOrders(filters);
      setOrders(response.orders);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const updateFilters = (newFilters: Partial<OrderFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  return {
    orders,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    refetch: fetchOrders,
  };
};

/**
 * Hook for managing a single order
 */
export const useOrder = (orderId: string) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderApi.getOrder(orderId);
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch order');
      toast.error('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: Order['status']) => {
    try {
      setLoading(true);
      setError(null);
      const updatedOrder = await orderApi.updateOrderStatus(orderId, status);
      setOrder(updatedOrder);
      toast.success('Order status updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order status');
      toast.error('Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  return {
    order,
    loading,
    error,
    updateStatus,
    refetch: fetchOrder,
  };
};

/**
 * Hook for managing order statistics
 */
export const useOrderStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderApi.getOrderStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch order statistics');
      toast.error('Failed to fetch order statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}; 