import api from './index';
import { ApiResponse } from '@/types/api';

export interface OrderData {
    id: string;
    customerId: string;
    items: OrderItem[];
    status: OrderStatus;
    total: number;
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem {
    id: string;
    productId: string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
}

export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

export interface OrderFilters {
    status?: OrderStatus;
    startDate?: string;
    endDate?: string;
    search?: string;
}

/**
 * Order Data API Service
 * Handles all order data-related API calls
 */
export const orderDataApi = {
    /**
     * Get customer's orders
     * @param {number} page - Page number
     * @param {number} limit - Items per page
     * @param {OrderFilters} filters - Order filters
     * @returns {Promise<ApiResponse<{ items: OrderData[]; total: number }>>} List of orders
     */
    getOrders: (
        page: number = 1,
        limit: number = 10,
        filters?: OrderFilters
    ): Promise<ApiResponse<{ items: OrderData[]; total: number }>> => {
        return api.get('/customer/orders', {
            params: { page, limit, ...filters },
        });
    },

    /**
     * Get order details
     * @param {string} orderId - Order ID
     * @returns {Promise<ApiResponse<OrderData>>} Order details
     */
    getOrder: (orderId: string): Promise<ApiResponse<OrderData>> => {
        return api.get(`/customer/orders/${orderId}`);
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
     * Get order items
     * @param {string} orderId - Order ID
     * @returns {Promise<ApiResponse<OrderItem[]>>} Order items
     */
    getOrderItems: (orderId: string): Promise<ApiResponse<OrderItem[]>> => {
        return api.get(`/customer/orders/${orderId}/items`);
    },

    /**
     * Get order statistics
     * @returns {Promise<ApiResponse<{ total: number; byStatus: Record<OrderStatus, number> }>>} Order statistics
     */
    getOrderStats: (): Promise<ApiResponse<{ total: number; byStatus: Record<OrderStatus, number> }>> => {
        return api.get('/customer/orders/stats');
    },
}; 