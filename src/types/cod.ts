import { BaseEntity, EntityStatus } from './api';

/**
 * COD Order Types
 */
export interface CODOrder extends BaseEntity {
    orderId: string;
    amount: number;
    status: CODOrderStatus;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    deliveryDate?: string;
    collectedAmount?: number;
    collectedBy?: string;
    collectionDate?: string;
    notes?: string;
}

export enum CODOrderStatus {
    PENDING = 'pending',
    OUT_FOR_DELIVERY = 'out_for_delivery',
    DELIVERED = 'delivered',
    FAILED = 'failed',
    CANCELLED = 'cancelled'
}

/**
 * COD Request Types
 */
export interface CreateCODOrderRequest {
    orderId: string;
    amount: number;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    deliveryDate?: string;
    notes?: string;
}

export interface UpdateCODOrderRequest {
    status?: CODOrderStatus;
    collectedAmount?: number;
    collectedBy?: string;
    collectionDate?: string;
    notes?: string;
}

export interface CODOrderFilterParams {
    status?: CODOrderStatus;
    startDate?: string;
    endDate?: string;
    search?: string;
    page?: number;
    limit?: number;
}

/**
 * COD Response Types
 */
export interface CODOrderSummary {
    total: number;
    pending: number;
    outForDelivery: number;
    delivered: number;
    failed: number;
    cancelled: number;
    totalAmount: number;
    collectedAmount: number;
}

export interface CODOrderList {
    orders: CODOrder[];
    total: number;
    page: number;
    limit: number;
}

/**
 * COD Hook Return Types
 */
export interface UseCODOrdersReturn {
    orders: CODOrder[];
    summary: CODOrderSummary | null;
    isLoading: boolean;
    error: string | null;
    createCODOrder: (data: CreateCODOrderRequest) => Promise<void>;
    updateCODOrder: (id: string, data: UpdateCODOrderRequest) => Promise<void>;
    cancelCODOrder: (id: string) => Promise<void>;
    refreshOrders: () => Promise<void>;
}

export interface UseCODOrderFiltersReturn {
    filters: CODOrderFilterParams;
    setFilters: (filters: CODOrderFilterParams) => void;
    applyFilters: () => Promise<void>;
    resetFilters: () => void;
} 