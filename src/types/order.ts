import { BaseEntity, Address, ContactInfo, EntityStatus } from './api';

/**
 * Order Status Enum
 * Represents the possible states of an order
 */
export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
    RETURNED = 'RETURNED'
}

/**
 * Payment Status Enum
 * Represents the payment state of an order
 */
export enum PaymentStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED'
}

export enum PaymentMethod {
    CASH = 'cash',
    CARD = 'card',
    UPI = 'upi',
    NETBANKING = 'netbanking',
    WALLET = 'wallet'
}

/**
 * Shipping Address Interface
 * Represents a shipping address
 */
export interface ShippingAddress {
    fullName: string;
    contactNumber: string;
    addressLine1: string;
    addressLine2?: string;
    landmark?: string;
    pincode: string;
    city: string;
    state: string;
}

/**
 * Order Item Interface
 * Represents an item in an order
 */
export interface OrderItem {
    id: string;
    productId: string;
    name: string;
    quantity: number;
    price: number;
    total: number;
    sku?: string;
    variant?: string;
}

/**
 * Order Interface
 * Represents a complete order
 */
export interface Order extends BaseEntity {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    status: OrderStatus;
    totalAmount: number;
    items: OrderItem[];
    shippingAddress: Address;
    paymentMethod: PaymentMethod;
    createdAt: string;
    updatedAt: string;
}

/**
 * Order List Response Interface
 * Represents the response from the orders list endpoint
 */
export interface OrderListResponse {
    data: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

/**
 * Order Response Interface
 * Represents the response from a single order endpoint
 */
export interface OrderResponse {
    orders: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

/**
 * Order Filters Interface
 * Represents the filters that can be applied to order list
 */
export interface OrderFilters {
    status?: OrderStatus;
    startDate?: string;
    endDate?: string;
    search?: string;
    page?: number;
    limit?: number;
}

/**
 * Order Update Request Interface
 * Represents the request body for updating an order
 */
export interface OrderUpdateRequest {
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    courier?: string;
    trackingNumber?: string;
    notes?: string;
}

/**
 * Order Cancel Request Interface
 * Represents the request body for cancelling an order
 */
export interface OrderCancelRequest {
    reason: string;
}

/**
 * Shipping Label Response Interface
 * Represents the response from the shipping label generation endpoint
 */
export interface ShippingLabelResponse {
    labelUrl: string;
    trackingNumber: string;
}

/**
 * Tracking Info Interface
 * Represents the tracking information for an order
 */
export interface TrackingInfo {
    status: string;
    lastUpdate: string;
    location?: string;
    estimatedDelivery?: string;
    history: {
        status: string;
        timestamp: string;
        location?: string;
    }[];
}

/**
 * Order Filter Types
 */
export interface OrderFilterParams {
    status?: OrderStatus[];
    paymentStatus?: PaymentStatus[];
    dateRange?: {
        startDate: string;
        endDate: string;
    };
    minAmount?: number;
    maxAmount?: number;
    search?: string;
}

/**
 * Order Create/Update Types
 */
export interface CreateOrderItem {
    productId: string;
    quantity: number;
    attributes?: Record<string, string>;
}

export interface CreateOrderData {
    items: CreateOrderItem[];
    shippingAddress: Address;
    paymentMethod: PaymentMethod;
    customerInfo: ContactInfo;
    notes?: string;
}

export interface UpdateOrderData {
    status?: OrderStatus;
    shipping?: Partial<ShippingAddress>;
    notes?: string;
    metadata?: Record<string, unknown>;
}

/**
 * Order Response Types
 */
export interface OrderSummary {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    total: number;
    createdAt: string;
    customerName: string;
}

export interface OrderDetails extends Order {
    history: OrderHistory[];
    relatedOrders?: OrderSummary[];
}

export interface OrderHistory {
    id: string;
    status: OrderStatus;
    comment?: string;
    createdAt: string;
    updatedBy: string;
}

/**
 * Order Statistics Types
 */
export interface OrderStats {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    refunded: number;
    revenue: {
        total: number;
        pending: number;
        completed: number;
    };
}

export interface Address {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
}

export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 
  | 'credit_card'
  | 'debit_card'
  | 'upi'
  | 'net_banking'
  | 'cod';

export interface OrderFilters {
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface OrderResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 