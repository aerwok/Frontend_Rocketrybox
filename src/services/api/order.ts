import api from './index';
import { ApiResponse } from '@/types/api';

export interface OrderItem {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    name: string;
    description?: string;
    image?: string;
}

export interface OrderAddress {
    id: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    isDefault: boolean;
}

export interface Order {
    id: string;
    customerId: string;
    items: OrderItem[];
    shippingAddress: OrderAddress;
    billingAddress: OrderAddress;
    subtotal: number;
    tax: number;
    platformFee: number;
    total: number;
    status: OrderStatus;
    paymentMethod: string;
    paymentStatus: PaymentStatus;
    createdAt: string;
    updatedAt: string;
}

export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

export enum PaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed',
    REFUNDED = 'refunded',
}

export interface CreateOrderData {
    items: {
        productId: string;
        quantity: number;
    }[];
    shippingAddressId: string;
    billingAddressId: string;
    paymentMethod: string;
}

/**
 * Order API Service
 * Handles all order-related API calls
 */
export const orderApi = {
    /**
     * Create a new order
     * @param {CreateOrderData} data - Order creation data
     * @returns {Promise<ApiResponse<Order>>} Created order
     */
    createOrder: (data: CreateOrderData): Promise<ApiResponse<Order>> => {
        return api.post('/customer/orders', data);
    },

    /**
     * Get order details
     * @param {string} orderId - Order ID
     * @returns {Promise<ApiResponse<Order>>} Order details
     */
    getOrder: (orderId: string): Promise<ApiResponse<Order>> => {
        return api.get(`/customer/orders/${orderId}`);
    },

    /**
     * Get customer's orders
     * @param {number} page - Page number
     * @param {number} limit - Items per page
     * @returns {Promise<ApiResponse<{ items: Order[]; total: number }>>} List of orders
     */
    getOrders: (
        page: number = 1,
        limit: number = 10
    ): Promise<ApiResponse<{ items: Order[]; total: number }>> => {
        return api.get('/customer/orders', {
            params: { page, limit },
        });
    },

    /**
     * Cancel an order
     * @param {string} orderId - Order ID
     * @returns {Promise<ApiResponse<Order>>} Updated order
     */
    cancelOrder: (orderId: string): Promise<ApiResponse<Order>> => {
        return api.post(`/customer/orders/${orderId}/cancel`);
    },

    /**
     * Get order status
     * @param {string} orderId - Order ID
     * @returns {Promise<ApiResponse<{ status: OrderStatus }>>} Order status
     */
    getOrderStatus: (orderId: string): Promise<ApiResponse<{ status: OrderStatus }>> => {
        return api.get(`/customer/orders/${orderId}/status`);
    },

    /**
     * Get order payment status
     * @param {string} orderId - Order ID
     * @returns {Promise<ApiResponse<{ status: PaymentStatus }>>} Payment status
     */
    getOrderPaymentStatus: (orderId: string): Promise<ApiResponse<{ status: PaymentStatus }>> => {
        return api.get(`/customer/orders/${orderId}/payment-status`);
    },

    /**
     * Calculate order totals
     * @param {CreateOrderData} data - Order data
     * @returns {Promise<ApiResponse<{ subtotal: number; tax: number; platformFee: number; total: number }>>} Order totals
     */
    calculateOrderTotals: (
        data: CreateOrderData
    ): Promise<ApiResponse<{ subtotal: number; tax: number; platformFee: number; total: number }>> => {
        return api.post('/customer/orders/calculate-totals', data);
    },
}; 