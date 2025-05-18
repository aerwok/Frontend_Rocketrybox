import api from './index';
import { ApiResponse } from '@/types/api';
import axios from 'axios';
import { OrderData, PaymentResponse, RazorpayResponse } from '@/types/payment';

export interface PaymentMethod {
    id: string;
    type: PaymentMethodType;
    card?: {
        brand: CardBrand;
        last4: string;
        expMonth: number;
        expYear: number;
    };
    isDefault: boolean;
    createdAt: string;
}

export interface PaymentIntent {
    id: string;
    amount: number;
    currency: string;
    status: PaymentIntentStatus;
    paymentMethodId: string;
    createdAt: string;
    updatedAt: string;
}

export interface PaymentHistory {
    id: string;
    amount: number;
    currency: string;
    status: PaymentHistoryStatus;
    paymentMethodId: string;
    orderId?: string;
    createdAt: string;
}

export enum PaymentMethodType {
    CARD = 'card',
    BANK_ACCOUNT = 'bank_account',
}

export enum CardBrand {
    VISA = 'visa',
    MASTERCARD = 'mastercard',
    AMEX = 'amex',
    DISCOVER = 'discover',
}

export enum PaymentIntentStatus {
    REQUIRES_PAYMENT_METHOD = 'requires_payment_method',
    REQUIRES_CONFIRMATION = 'requires_confirmation',
    REQUIRES_ACTION = 'requires_action',
    PROCESSING = 'processing',
    SUCCEEDED = 'succeeded',
    CANCELED = 'canceled',
}

export enum PaymentHistoryStatus {
    PENDING = 'pending',
    SUCCEEDED = 'succeeded',
    FAILED = 'failed',
    REFUNDED = 'refunded',
}

/**
 * Payment API Service
 * 
 * Handles all payment-related API calls:
 * - Create payment order
 * - Verify payment
 * - Get payment status
 * - Handle payment errors
 */
class PaymentService {
    private readonly baseUrl = '/api/payments';

    /**
     * Create a new payment order
     * @param amount - Payment amount in INR
     * @param awbNumber - AWB number of the order
     * @returns Payment order details including orderId and keyId
     */
    async createPaymentOrder(amount: number, awbNumber: string): Promise<PaymentResponse> {
        try {
            const response = await axios.post<PaymentResponse>(`${this.baseUrl}/create-order`, {
                amount,
                currency: 'INR',
                awbNumber
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Verify payment after successful Razorpay transaction
     * @param paymentDetails - Payment verification details from Razorpay
     * @returns Verification result
     */
    async verifyPayment(paymentDetails: RazorpayResponse & { awbNumber: string }): Promise<void> {
        try {
            await axios.post(`${this.baseUrl}/verify`, paymentDetails);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Get payment status for an order
     * @param awbNumber - AWB number of the order
     * @returns Payment status details
     */
    async getPaymentStatus(awbNumber: string): Promise<{ status: string; amount: number }> {
        try {
            const response = await axios.get(`${this.baseUrl}/status/${awbNumber}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Handle API errors consistently
     * @param error - Error from API call
     * @returns Formatted error message
     */
    private handleError(error: unknown): Error {
        if (axios.isAxiosError(error)) {
            return new Error(error.response?.data?.message || 'Payment service error');
        }
        return error instanceof Error ? error : new Error('Unknown payment error');
    }
}

export const paymentService = new PaymentService();

/**
 * Payment API Service
 * Handles all payment-related API calls
 */
export const paymentApi = {
    /**
     * Get payment methods
     * @returns {Promise<ApiResponse<PaymentMethod[]>>} List of payment methods
     */
    getPaymentMethods: (): Promise<ApiResponse<PaymentMethod[]>> => {
        return api.get('/customer/payment-methods');
    },

    /**
     * Add payment method
     * @param {string} token - Payment method token
     * @returns {Promise<ApiResponse<PaymentMethod>>} Added payment method
     */
    addPaymentMethod: (token: string): Promise<ApiResponse<PaymentMethod>> => {
        return api.post('/customer/payment-methods', { token });
    },

    /**
     * Remove payment method
     * @param {string} paymentMethodId - Payment method ID
     * @returns {Promise<ApiResponse<void>>} Empty response
     */
    removePaymentMethod: (paymentMethodId: string): Promise<ApiResponse<void>> => {
        return api.delete(`/customer/payment-methods/${paymentMethodId}`);
    },

    /**
     * Set default payment method
     * @param {string} paymentMethodId - Payment method ID
     * @returns {Promise<ApiResponse<PaymentMethod>>} Updated payment method
     */
    setDefaultPaymentMethod: (paymentMethodId: string): Promise<ApiResponse<PaymentMethod>> => {
        return api.post(`/customer/payment-methods/${paymentMethodId}/default`);
    },

    /**
     * Create payment intent
     * @param {number} amount - Amount in smallest currency unit
     * @param {string} currency - Currency code
     * @param {string} paymentMethodId - Payment method ID
     * @returns {Promise<ApiResponse<PaymentIntent>>} Created payment intent
     */
    createPaymentIntent: (
        amount: number,
        currency: string,
        paymentMethodId: string
    ): Promise<ApiResponse<PaymentIntent>> => {
        return api.post('/customer/payment-intents', {
            amount,
            currency,
            paymentMethodId,
        });
    },

    /**
     * Confirm payment intent
     * @param {string} paymentIntentId - Payment intent ID
     * @returns {Promise<ApiResponse<PaymentIntent>>} Confirmed payment intent
     */
    confirmPaymentIntent: (paymentIntentId: string): Promise<ApiResponse<PaymentIntent>> => {
        return api.post(`/customer/payment-intents/${paymentIntentId}/confirm`);
    },

    /**
     * Get payment intent
     * @param {string} paymentIntentId - Payment intent ID
     * @returns {Promise<ApiResponse<PaymentIntent>>} Payment intent details
     */
    getPaymentIntent: (paymentIntentId: string): Promise<ApiResponse<PaymentIntent>> => {
        return api.get(`/customer/payment-intents/${paymentIntentId}`);
    },

    /**
     * Get payment history
     * @param {number} page - Page number
     * @param {number} limit - Items per page
     * @returns {Promise<ApiResponse<{ items: PaymentHistory[]; total: number }>>} Payment history
     */
    getPaymentHistory: (
        page: number = 1,
        limit: number = 10
    ): Promise<ApiResponse<{ items: PaymentHistory[]; total: number }>> => {
        return api.get('/customer/payment-history', {
            params: { page, limit },
        });
    },
}; 