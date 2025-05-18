import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderApi, Order, CreateOrderData, OrderStatus, PaymentStatus } from '@/services/api/order';

interface OrderTotals {
    subtotal: number;
    tax: number;
    platformFee: number;
    total: number;
}

interface UseCreateOrderReturn {
    // Order state
    order: Order | null;
    totals: OrderTotals | null;
    isLoading: boolean;
    error: string | null;

    // Order operations
    createOrder: (data: CreateOrderData) => Promise<void>;
    calculateTotals: (data: CreateOrderData) => Promise<void>;
    getOrderStatus: (orderId: string) => Promise<OrderStatus>;
    getPaymentStatus: (orderId: string) => Promise<PaymentStatus>;
}

/**
 * useCreateOrder Hook
 * 
 * Manages order creation state and operations:
 * - Create new order
 * - Calculate order totals
 * - Check order status
 * - Check payment status
 * - Loading and error states
 * 
 * @returns {UseCreateOrderReturn} Order creation state and operations
 */
export const useCreateOrder = (): UseCreateOrderReturn => {
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [totals, setTotals] = useState<OrderTotals | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Create new order
     * @param {CreateOrderData} data - Order creation data
     */
    const createOrder = useCallback(async (data: CreateOrderData) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await orderApi.createOrder(data);
            setOrder(response.data);
            navigate(`/customer/orders/${response.data.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create order');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    /**
     * Calculate order totals
     * @param {CreateOrderData} data - Order data
     */
    const calculateTotals = useCallback(async (data: CreateOrderData) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await orderApi.calculateOrderTotals(data);
            setTotals(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to calculate order totals');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Get order status
     * @param {string} orderId - Order ID
     * @returns {Promise<OrderStatus>} Order status
     */
    const getOrderStatus = useCallback(async (orderId: string): Promise<OrderStatus> => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await orderApi.getOrderStatus(orderId);
            return response.data.status;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get order status');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Get payment status
     * @param {string} orderId - Order ID
     * @returns {Promise<PaymentStatus>} Payment status
     */
    const getPaymentStatus = useCallback(async (orderId: string): Promise<PaymentStatus> => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await orderApi.getOrderPaymentStatus(orderId);
            return response.data.status;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get payment status');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        order,
        totals,
        isLoading,
        error,
        createOrder,
        calculateTotals,
        getOrderStatus,
        getPaymentStatus,
    };
}; 