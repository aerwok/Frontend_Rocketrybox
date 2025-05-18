import { BaseEntity, EntityStatus } from './api';

/**
 * Dispute Types
 */
export interface Dispute extends BaseEntity {
    orderId: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    reason: string;
    description: string;
    status: DisputeStatus;
    priority: DisputePriority;
    category: DisputeCategory;
    attachments?: string[];
    resolution?: string;
    resolvedBy?: string;
    resolvedAt?: string;
    notes?: string;
}

export enum DisputeStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    RESOLVED = 'RESOLVED',
    CLOSED = 'CLOSED',
    REOPENED = 'REOPENED'
}

export enum DisputePriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT'
}

export enum DisputeCategory {
    ORDER_ISSUE = 'ORDER_ISSUE',
    DELIVERY_ISSUE = 'DELIVERY_ISSUE',
    PAYMENT_ISSUE = 'PAYMENT_ISSUE',
    PRODUCT_ISSUE = 'PRODUCT_ISSUE',
    REFUND_ISSUE = 'REFUND_ISSUE',
    OTHER = 'OTHER'
}

/**
 * Dispute Request Types
 */
export interface CreateDisputeRequest {
    orderId: string;
    reason: string;
    description: string;
    category: DisputeCategory;
    priority: DisputePriority;
    attachments?: string[];
}

export interface UpdateDisputeRequest {
    status?: DisputeStatus;
    priority?: DisputePriority;
    category?: DisputeCategory;
    resolution?: string;
    notes?: string;
}

export interface DisputeFilterParams {
    status?: DisputeStatus;
    priority?: DisputePriority;
    category?: DisputeCategory;
    startDate?: string;
    endDate?: string;
    search?: string;
    page?: number;
    limit?: number;
}

/**
 * Dispute Response Types
 */
export interface DisputeSummary {
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
    reopened: number;
    byPriority: {
        [key in DisputePriority]: number;
    };
    byCategory: {
        [key in DisputeCategory]: number;
    };
}

export interface DisputeList {
    disputes: Dispute[];
    total: number;
    page: number;
    limit: number;
}

/**
 * Dispute Hook Return Types
 */
export interface UseDisputesReturn {
    disputes: Dispute[];
    summary: DisputeSummary | null;
    isLoading: boolean;
    error: string | null;
    createDispute: (data: CreateDisputeRequest) => Promise<void>;
    updateDispute: (id: string, data: UpdateDisputeRequest) => Promise<void>;
    resolveDispute: (id: string, resolution: string) => Promise<void>;
    closeDispute: (id: string) => Promise<void>;
    reopenDispute: (id: string) => Promise<void>;
    refreshDisputes: () => Promise<void>;
}

export interface UseDisputeFiltersReturn {
    filters: DisputeFilterParams;
    setFilters: (filters: DisputeFilterParams) => void;
    applyFilters: () => Promise<void>;
    resetFilters: () => void;
} 