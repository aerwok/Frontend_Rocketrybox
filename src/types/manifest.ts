import { BaseEntity } from './api';

/**
 * Manifest Types
 */
export interface Manifest extends BaseEntity {
    manifestId: string;
    orderId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    items: ManifestItem[];
    status: ManifestStatus;
    totalAmount: number;
    shippingMethod: string;
    trackingNumber?: string;
    notes?: string;
}

export interface ManifestItem {
    id: string;
    productId: string;
    name: string;
    quantity: number;
    price: number;
    total: number;
}

export enum ManifestStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

/**
 * Manifest Request Types
 */
export interface CreateManifestRequest {
    orderId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    items: Omit<ManifestItem, 'id'>[];
    shippingMethod: string;
    notes?: string;
}

export interface UpdateManifestRequest {
    status?: ManifestStatus;
    trackingNumber?: string;
    notes?: string;
}

export interface ManifestFilterParams {
    search?: string;
    status?: ManifestStatus;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}

/**
 * Manifest Response Types
 */
export interface ManifestResponse {
    data: Manifest;
    message: string;
}

export interface ManifestListResponse {
    data: Manifest[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

/**
 * Manifest Hook Return Types
 */
export interface UseManifestsReturn {
    manifests: Manifest[];
    isLoading: boolean;
    error: string | null;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    fetchManifests: (params?: ManifestFilterParams) => Promise<void>;
    createManifest: (data: CreateManifestRequest) => Promise<Manifest>;
    updateManifest: (id: string, data: UpdateManifestRequest) => Promise<Manifest>;
    deleteManifest: (id: string) => Promise<void>;
    refreshManifests: () => Promise<void>;
}

export interface UseManifestFiltersReturn {
    filters: ManifestFilterParams;
    setFilters: (filters: ManifestFilterParams) => void;
    applyFilters: () => Promise<void>;
    resetFilters: () => void;
} 