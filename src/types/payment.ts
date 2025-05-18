/**
 * Payment Types
 * 
 * Contains all type definitions related to payment functionality:
 * - Payment responses
 * - Order data
 * - Payment methods
 * - Price details
 */

export interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

export interface PaymentResponse {
    orderId: string;
    keyId: string;
}

export interface OrderResponse {
    awbNumber: string;
    receiverName: string;
    receiverAddress1: string;
    receiverAddress2?: string;
    receiverCity: string;
    receiverState: string;
    receiverPincode: string;
    receiverMobile: string;
    weight: number;
    length: number;
    width: number;
    height: number;
    packageType: string;
    pickupDate: string; // ISO date string from backend
    shippingPartner: {
        name: string;
        rate: number;
    };
}

export interface OrderData extends Omit<OrderResponse, 'pickupDate'> {
    pickupDate: Date;
}

export interface PriceDetail {
    label: string;
    value: number;
}

export const PAYMENT_METHODS = {
    UPI: 'upi',
    CARD: 'card',
    NETBANKING: 'netbanking'
} as const;

export type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS]; 