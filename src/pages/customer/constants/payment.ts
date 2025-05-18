/**
 * Payment-related constants and configurations
 */

/**
 * Supported payment method types
 */
export enum PaymentMethodType {
    CARD = 'card',
    BANK_ACCOUNT = 'bank_account',
}

/**
 * Supported payment card brands
 */
export enum CardBrand {
    VISA = 'visa',
    MASTERCARD = 'mastercard',
    AMEX = 'amex',
    DISCOVER = 'discover',
}

/**
 * Payment intent status
 */
export enum PaymentIntentStatus {
    PENDING = 'pending',
    SUCCEEDED = 'succeeded',
    FAILED = 'failed',
}

/**
 * Payment history status
 */
export enum PaymentHistoryStatus {
    SUCCEEDED = 'succeeded',
    FAILED = 'failed',
    REFUNDED = 'refunded',
}

/**
 * Supported currencies
 */
export enum Currency {
    USD = 'USD',
    EUR = 'EUR',
    GBP = 'GBP',
}

/**
 * Payment form validation rules
 */
export const PAYMENT_VALIDATION = {
    CARD_NUMBER: {
        MIN_LENGTH: 13,
        MAX_LENGTH: 19,
    },
    EXPIRY_MONTH: {
        MIN: 1,
        MAX: 12,
    },
    EXPIRY_YEAR: {
        MIN: new Date().getFullYear(),
        MAX: new Date().getFullYear() + 10,
    },
    CVV: {
        MIN_LENGTH: 3,
        MAX_LENGTH: 4,
    },
    BANK_ACCOUNT: {
        MIN_LENGTH: 4,
        MAX_LENGTH: 17,
    },
    ROUTING_NUMBER: {
        LENGTH: 9,
    },
};

/**
 * Payment API endpoints
 */
export const PAYMENT_ENDPOINTS = {
    METHODS: '/customer/payments/methods',
    INTENTS: '/customer/payments/intents',
    HISTORY: '/customer/payments/history',
};

/**
 * Payment error messages
 */
export const PAYMENT_ERRORS = {
    INVALID_CARD: 'Invalid card number',
    INVALID_EXPIRY: 'Invalid expiry date',
    INVALID_CVV: 'Invalid CVV',
    INVALID_BANK_ACCOUNT: 'Invalid bank account number',
    INVALID_ROUTING: 'Invalid routing number',
    PAYMENT_FAILED: 'Payment failed',
    NETWORK_ERROR: 'Network error occurred',
    INVALID_AMOUNT: 'Invalid payment amount',
    INVALID_CURRENCY: 'Invalid currency',
};

/**
 * Payment success messages
 */
export const PAYMENT_SUCCESS = {
    METHOD_ADDED: 'Payment method added successfully',
    METHOD_REMOVED: 'Payment method removed successfully',
    METHOD_UPDATED: 'Payment method updated successfully',
    PAYMENT_COMPLETED: 'Payment completed successfully',
};

/**
 * Payment loading messages
 */
export const PAYMENT_LOADING = {
    PROCESSING: 'Processing payment...',
    ADDING_METHOD: 'Adding payment method...',
    REMOVING_METHOD: 'Removing payment method...',
    UPDATING_METHOD: 'Updating payment method...',
    FETCHING_HISTORY: 'Fetching payment history...',
};

/**
 * Payment form field labels
 */
export const PAYMENT_LABELS = {
    CARD_NUMBER: 'Card Number',
    EXPIRY_DATE: 'Expiry Date',
    CVV: 'CVV',
    CARD_HOLDER: 'Card Holder Name',
    BANK_ACCOUNT: 'Bank Account Number',
    ROUTING_NUMBER: 'Routing Number',
    ACCOUNT_HOLDER: 'Account Holder Name',
    AMOUNT: 'Amount',
    CURRENCY: 'Currency',
};

/**
 * Payment form placeholders
 */
export const PAYMENT_PLACEHOLDERS = {
    CARD_NUMBER: '1234 5678 9012 3456',
    EXPIRY_DATE: 'MM/YY',
    CVV: '123',
    CARD_HOLDER: 'John Doe',
    BANK_ACCOUNT: '1234567890',
    ROUTING_NUMBER: '123456789',
    ACCOUNT_HOLDER: 'John Doe',
    AMOUNT: '0.00',
};

/**
 * Payment pagination configuration
 */
export const PAYMENT_PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    PAGE_SIZES: [10, 20, 50, 100],
};

export const PAYMENT_METHODS = {
    UPI: 'upi',
    CARD: 'card',
    NETBANKING: 'netbanking'
} as const;

export type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];

export const GST_RATE = 0.18;
export const PLATFORM_FEE = 25;

export const RAZORPAY_CONFIG = {
    name: "RocketryBox",
    theme: {
        color: "#0070BA"
    }
} as const; 