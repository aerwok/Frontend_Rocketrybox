import { BaseEntity, EntityStatus } from './api';

/**
 * Bulk Order Types
 */
export interface BulkOrder extends BaseEntity {
    sellerId: string;
    status: BulkOrderStatus;
    totalOrders: number;
    completedOrders: number;
    failedOrders: number;
    progress: number;
    metadata: BulkOrderMetadata;
    error?: string;
}

export enum BulkOrderStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed',
    CANCELLED = 'cancelled'
}

export interface BulkOrderMetadata {
    fileName: string;
    fileSize: number;
    fileType: string;
    totalRows: number;
    processedRows: number;
    startTime: string;
    endTime?: string;
    template: BulkOrderTemplate;
}

export interface BulkOrderTemplate {
    id: string;
    name: string;
    fields: BulkOrderField[];
    createdAt: string;
    updatedAt: string;
}

export interface BulkOrderField {
    name: string;
    type: BulkOrderFieldType;
    required: boolean;
    validation?: BulkOrderFieldValidation;
}

export enum BulkOrderFieldType {
    TEXT = 'text',
    NUMBER = 'number',
    DATE = 'date',
    BOOLEAN = 'boolean',
    SELECT = 'select'
}

export interface BulkOrderFieldValidation {
    min?: number;
    max?: number;
    pattern?: string;
    options?: string[];
}

export interface BulkOrderProgress {
    orderId: string;
    status: BulkOrderStatus;
    progress: number;
    completedOrders: number;
    failedOrders: number;
    error?: string;
}

/**
 * Bulk Order Request Types
 */
export interface CreateBulkOrderRequest {
    file: File;
    templateId: string;
}

export interface UpdateBulkOrderRequest {
    status?: BulkOrderStatus;
    metadata?: Partial<BulkOrderMetadata>;
}

export interface CreateBulkOrderTemplateRequest {
    name: string;
    fields: BulkOrderField[];
}

export interface UpdateBulkOrderTemplateRequest {
    name?: string;
    fields?: BulkOrderField[];
}

/**
 * Bulk Order Response Types
 */
export interface BulkOrderSummary {
    total: number;
    completed: number;
    failed: number;
    inProgress: number;
    recentOrders: BulkOrder[];
}

export interface BulkOrderTemplateSummary {
    templates: BulkOrderTemplate[];
    total: number;
}

/**
 * Bulk Order Hook Return Types
 */
export interface UseBulkOrdersReturn {
    orders: BulkOrder[];
    isLoading: boolean;
    error: string | null;
    createBulkOrder: (data: CreateBulkOrderRequest) => Promise<void>;
    updateBulkOrder: (id: string, data: UpdateBulkOrderRequest) => Promise<void>;
    cancelBulkOrder: (id: string) => Promise<void>;
    refreshOrders: () => Promise<void>;
}

export interface UseBulkOrderTemplatesReturn {
    templates: BulkOrderTemplate[];
    isLoading: boolean;
    error: string | null;
    createTemplate: (data: CreateBulkOrderTemplateRequest) => Promise<void>;
    updateTemplate: (id: string, data: UpdateBulkOrderTemplateRequest) => Promise<void>;
    deleteTemplate: (id: string) => Promise<void>;
    refreshTemplates: () => Promise<void>;
}

export interface UseBulkOrderProgressReturn {
    progress: BulkOrderProgress | null;
    isLoading: boolean;
    error: string | null;
    refreshProgress: () => Promise<void>;
} 