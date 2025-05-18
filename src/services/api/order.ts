import axios from 'axios';
import { Order, OrderFilters, OrderResponse } from '@/types/order';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

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
     * Get all orders with optional filters
     * @param filters OrderFilters
     * @returns Promise<OrderResponse>
     */
    getOrders: async (filters?: OrderFilters): Promise<OrderResponse> => {
        const response = await axios.get(`${API_URL}/orders`, { params: filters });
        return response.data;
    },

    /**
     * Get a single order by ID
     * @param orderId string
     * @returns Promise<Order>
     */
    getOrder: async (orderId: string): Promise<Order> => {
        const response = await axios.get(`${API_URL}/orders/${orderId}`);
        return response.data;
    },

    /**
     * Update order status
     * @param orderId string
     * @param status OrderStatus
     * @returns Promise<Order>
     */
    updateOrderStatus: async (orderId: string, status: Order['status']): Promise<Order> => {
        const response = await axios.patch(`${API_URL}/orders/${orderId}/status`, { status });
        return response.data;
    },

    /**
     * Get order statistics
     * @returns Promise<{ total: number; pending: number; processing: number; shipped: number; delivered: number; cancelled: number }>
     */
    getOrderStats: async () => {
        const response = await axios.get(`${API_URL}/orders/stats`);
        return response.data;
    },

    /**
     * Create a new order
     * @param {CreateOrderData} data - Order creation data
     * @returns {Promise<ApiResponse<Order>>} Created order
     */
    createOrder: (data: CreateOrderData): Promise<ApiResponse<Order>> => {
        return axios.post(`${API_URL}/customer/orders`, data);
    },

    /**
     * Cancel an order
     * @param {string} orderId - Order ID
     * @returns {Promise<ApiResponse<Order>>} Updated order
     */
    cancelOrder: (orderId: string): Promise<ApiResponse<Order>> => {
        return axios.post(`${API_URL}/customer/orders/${orderId}/cancel`);
    },

    /**
     * Get order status
     * @param {string} orderId - Order ID
     * @returns {Promise<ApiResponse<{ status: OrderStatus }>>} Order status
     */
    getOrderStatus: (orderId: string): Promise<ApiResponse<{ status: OrderStatus }>> => {
        return axios.get(`${API_URL}/customer/orders/${orderId}/status`);
    },

    /**
     * Get order payment status
     * @param {string} orderId - Order ID
     * @returns {Promise<ApiResponse<{ status: PaymentStatus }>>} Payment status
     */
    getOrderPaymentStatus: (orderId: string): Promise<ApiResponse<{ status: PaymentStatus }>> => {
        return axios.get(`${API_URL}/customer/orders/${orderId}/payment-status`);
    },

    /**
     * Calculate order totals
     * @param {CreateOrderData} data - Order data
     * @returns {Promise<ApiResponse<{ subtotal: number; tax: number; platformFee: number; total: number }>>} Order totals
     */
    calculateOrderTotals: (
        data: CreateOrderData
    ): Promise<ApiResponse<{ subtotal: number; tax: number; platformFee: number; total: number }>> => {
        return axios.post(`${API_URL}/customer/orders/calculate-totals`, data);
    },
}; 