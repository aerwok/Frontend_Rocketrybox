import { BaseEntity, EntityStatus } from './api';

/**
 * Billing Types
 */
export interface BillingPlan extends BaseEntity {
    name: string;
    description: string;
    price: number;
    billingCycle: BillingCycle;
    features: string[];
    status: EntityStatus;
    metadata?: Record<string, unknown>;
}

export enum BillingCycle {
    MONTHLY = 'monthly',
    QUARTERLY = 'quarterly',
    YEARLY = 'yearly'
}

export interface Subscription extends BaseEntity {
    userId: string;
    planId: string;
    status: SubscriptionStatus;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    plan: BillingPlan;
    metadata?: Record<string, unknown>;
}

export enum SubscriptionStatus {
    ACTIVE = 'active',
    PAST_DUE = 'past_due',
    CANCELED = 'canceled',
    UNPAID = 'unpaid',
    TRIALING = 'trialing'
}

export interface Invoice extends BaseEntity {
    userId: string;
    subscriptionId: string;
    amount: number;
    currency: string;
    status: InvoiceStatus;
    dueDate: string;
    paidAt?: string;
    items: InvoiceItem[];
    metadata?: Record<string, unknown>;
}

export enum InvoiceStatus {
    DRAFT = 'draft',
    OPEN = 'open',
    PAID = 'paid',
    VOID = 'void',
    UNCOLLECTIBLE = 'uncollectible'
}

export interface InvoiceItem {
    id: string;
    description: string;
    amount: number;
    quantity: number;
    unitPrice: number;
    metadata?: Record<string, unknown>;
}

export interface PaymentMethod extends BaseEntity {
    userId: string;
    type: PaymentMethodType;
    isDefault: boolean;
    details: PaymentMethodDetails;
    metadata?: Record<string, unknown>;
}

export enum PaymentMethodType {
    CREDIT_CARD = 'credit_card',
    BANK_ACCOUNT = 'bank_account',
    UPI = 'upi',
    WALLET = 'wallet'
}

export interface PaymentMethodDetails {
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    upiId?: string;
    walletName?: string;
}

/**
 * Billing Request Types
 */
export interface CreateSubscriptionRequest {
    planId: string;
    paymentMethodId: string;
    billingCycle: BillingCycle;
}

export interface UpdateSubscriptionRequest {
    planId?: string;
    paymentMethodId?: string;
    cancelAtPeriodEnd?: boolean;
}

export interface CreatePaymentMethodRequest {
    type: PaymentMethodType;
    details: PaymentMethodDetails;
    isDefault?: boolean;
}

export interface UpdatePaymentMethodRequest {
    isDefault?: boolean;
    details?: Partial<PaymentMethodDetails>;
}

/**
 * Billing Response Types
 */
export interface BillingSummary {
    currentPlan: BillingPlan;
    subscription: Subscription;
    nextBillingDate: string;
    totalAmount: number;
    paymentMethods: PaymentMethod[];
}

export interface BillingHistory {
    invoices: Invoice[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

/**
 * Billing Hook Return Types
 */
export interface UseBillingReturn {
    summary: BillingSummary | null;
    isLoading: boolean;
    error: string | null;
    updateSubscription: (data: UpdateSubscriptionRequest) => Promise<void>;
    cancelSubscription: () => Promise<void>;
    addPaymentMethod: (data: CreatePaymentMethodRequest) => Promise<void>;
    removePaymentMethod: (id: string) => Promise<void>;
    refreshBilling: () => Promise<void>;
}

export interface UseBillingHistoryReturn {
    history: BillingHistory | null;
    isLoading: boolean;
    error: string | null;
    fetchHistory: (page?: number) => Promise<void>;
    downloadInvoice: (id: string) => Promise<void>;
} 