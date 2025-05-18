import axios from 'axios';
import {
    BillingSummary,
    BillingHistory,
    CreateSubscriptionRequest,
    UpdateSubscriptionRequest,
    CreatePaymentMethodRequest,
    UpdatePaymentMethodRequest,
    PaymentMethod
} from '../../types/billing';

/**
 * Billing API Service
 * Handles all billing-related API calls
 */
export const billingApi = {
    /**
     * Get billing summary including current plan, subscription, and payment methods
     * @returns BillingSummary with current billing details
     */
    getBillingSummary: async (): Promise<BillingSummary> => {
        const response = await axios.get<BillingSummary>('/api/billing/summary');
        return response.data;
    },

    /**
     * Get billing history with pagination
     * @param page Page number
     * @param limit Items per page
     * @returns BillingHistory with invoices and pagination info
     */
    getBillingHistory: async (page = 1, limit = 10): Promise<BillingHistory> => {
        const response = await axios.get<BillingHistory>('/api/billing/history', {
            params: { page, limit }
        });
        return response.data;
    },

    /**
     * Create new subscription
     * @param data Subscription creation data
     * @returns Updated BillingSummary
     */
    createSubscription: async (data: CreateSubscriptionRequest): Promise<BillingSummary> => {
        const response = await axios.post<BillingSummary>('/api/billing/subscription', data);
        return response.data;
    },

    /**
     * Update existing subscription
     * @param data Subscription update data
     * @returns Updated BillingSummary
     */
    updateSubscription: async (data: UpdateSubscriptionRequest): Promise<BillingSummary> => {
        const response = await axios.patch<BillingSummary>('/api/billing/subscription', data);
        return response.data;
    },

    /**
     * Cancel subscription
     * @returns Updated BillingSummary
     */
    cancelSubscription: async (): Promise<BillingSummary> => {
        const response = await axios.post<BillingSummary>('/api/billing/subscription/cancel');
        return response.data;
    },

    /**
     * Get payment methods
     * @returns Array of payment methods
     */
    getPaymentMethods: async (): Promise<PaymentMethod[]> => {
        const response = await axios.get<PaymentMethod[]>('/api/billing/payment-methods');
        return response.data;
    },

    /**
     * Add new payment method
     * @param data Payment method creation data
     * @returns Updated payment methods array
     */
    addPaymentMethod: async (data: CreatePaymentMethodRequest): Promise<PaymentMethod[]> => {
        const response = await axios.post<PaymentMethod[]>('/api/billing/payment-methods', data);
        return response.data;
    },

    /**
     * Update payment method
     * @param id Payment method ID
     * @param data Payment method update data
     * @returns Updated payment method
     */
    updatePaymentMethod: async (id: string, data: UpdatePaymentMethodRequest): Promise<PaymentMethod> => {
        const response = await axios.patch<PaymentMethod>(`/api/billing/payment-methods/${id}`, data);
        return response.data;
    },

    /**
     * Remove payment method
     * @param id Payment method ID
     * @returns Updated payment methods array
     */
    removePaymentMethod: async (id: string): Promise<PaymentMethod[]> => {
        const response = await axios.delete<PaymentMethod[]>(`/api/billing/payment-methods/${id}`);
        return response.data;
    },

    /**
     * Download invoice as PDF
     * @param id Invoice ID
     * @returns Blob containing PDF data
     */
    downloadInvoice: async (id: string): Promise<Blob> => {
        const response = await axios.get(`/api/billing/invoices/${id}/download`, {
            responseType: 'blob'
        });
        return response.data;
    }
}; 