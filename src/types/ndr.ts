import { BaseEntity } from './api';

/**
 * NDR Types
 */
export interface NDR extends BaseEntity {
    ndrId: string;
    orderId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    courier: string;
    trackingNumber: string;
    reason: NDRReason;
    status: NDRStatus;
    attempts: NDRAttempt[];
    resolution?: NDRResolution;
    notes?: string;
}

export interface NDRAttempt {
    id: string;
    status: NDRAttemptStatus;
    timestamp: string;
    notes?: string;
}

export interface NDRResolution {
    type: NDRResolutionType;
    date: string;
    notes?: string;
    updatedBy: string;
}

export enum NDRReason {
    CUSTOMER_NOT_AVAILABLE = 'CUSTOMER_NOT_AVAILABLE',
    WRONG_ADDRESS = 'WRONG_ADDRESS',
    CUSTOMER_REFUSED = 'CUSTOMER_REFUSED',
    DAMAGED_PACKAGE = 'DAMAGED_PACKAGE',
    OTHER = 'OTHER'
}

export enum NDRStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    RESOLVED = 'RESOLVED',
    CANCELLED = 'CANCELLED'
}

export enum NDRAttemptStatus {
    PENDING = 'PENDING',
    SUCCESSFUL = 'SUCCESSFUL',
    FAILED = 'FAILED'
}

export enum NDRResolutionType {
    DELIVERED = 'DELIVERED',
    RETURNED = 'RETURNED',
    CANCELLED = 'CANCELLED'
}

/**
 * NDR Request Types
 */
export interface CreateNDRRequest {
    orderId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    courier: string;
    trackingNumber: string;
    reason: NDRReason;
    notes?: string;
}

export interface UpdateNDRRequest {
    status?: NDRStatus;
    reason?: NDRReason;
    notes?: string;
}

export interface AddNDRAttemptRequest {
    status: NDRAttemptStatus;
    notes?: string;
}

export interface ResolveNDRRequest {
    type: NDRResolutionType;
    notes?: string;
}

export interface NDRFilterParams {
    search?: string;
    status?: NDRStatus;
    reason?: NDRReason;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}

/**
 * NDR Response Types
 */
export interface NDRResponse {
    data: NDR;
    message: string;
}

export interface NDRListResponse {
    data: NDR[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

/**
 * NDR Hook Return Types
 */
export interface UseNDRsReturn {
    ndrs: NDR[];
    isLoading: boolean;
    error: string | null;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    fetchNDRs: (params?: NDRFilterParams) => Promise<void>;
    createNDR: (data: CreateNDRRequest) => Promise<NDR>;
    updateNDR: (id: string, data: UpdateNDRRequest) => Promise<NDR>;
    addNDRAttempt: (id: string, data: AddNDRAttemptRequest) => Promise<NDR>;
    resolveNDR: (id: string, data: ResolveNDRRequest) => Promise<NDR>;
    deleteNDR: (id: string) => Promise<void>;
    refreshNDRs: () => Promise<void>;
}

export interface UseNDRFiltersReturn {
    filters: NDRFilterParams;
    setFilters: (filters: NDRFilterParams) => void;
    applyFilters: () => Promise<void>;
    resetFilters: () => void;
}

/**
 * NDR Filters Interface
 * Represents the filters that can be applied to NDR list
 */
export interface NDRFilters {
    search?: string;
    status?: NDRStatus;
    reason?: NDRReason;
    page?: number;
    limit?: number;
}

/**
 * NDR Create Request Interface
 * Represents the request body for creating an NDR
 */
export interface NDRCreateRequest {
    orderId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    courier: string;
    trackingNumber: string;
    reason: NDRReason;
    shippingAddress: ShippingAddress;
}

/**
 * NDR Update Request Interface
 * Represents the request body for updating an NDR
 */
export interface NDRUpdateRequest {
    status?: NDRStatus;
    reason?: NDRReason;
    notes?: string;
}

/**
 * NDR Attempt Request Interface
 * Represents the request body for adding an NDR attempt
 */
export interface NDRAttemptRequest {
    status: NDRAttemptStatus;
    notes?: string;
}

/**
 * NDR Resolution Request Interface
 * Represents the request body for resolving an NDR
 */
export interface NDRResolutionRequest {
    type: NDRResolutionType;
    notes?: string;
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