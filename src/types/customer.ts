import { BaseEntity, Address, ContactInfo, EntityStatus } from './api';

/**
 * Customer Types
 */
export interface Customer extends BaseEntity {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: EntityStatus;
    addresses: CustomerAddress[];
    preferences: CustomerPreferences;
    metadata?: Record<string, unknown>;
}

export interface CustomerAddress extends Address {
    id: string;
    isDefault: boolean;
    label: string;
    type: AddressType;
}

export enum AddressType {
    HOME = 'home',
    WORK = 'work',
    OTHER = 'other'
}

export interface CustomerPreferences {
    notifications: {
        email: boolean;
        sms: boolean;
        push: boolean;
    };
    marketing: {
        email: boolean;
        sms: boolean;
    };
    language: string;
    currency: string;
    timezone: string;
}

/**
 * Customer Filter Types
 */
export interface CustomerFilterParams {
    status?: EntityStatus[];
    dateRange?: {
        startDate: string;
        endDate: string;
    };
    search?: string;
    hasOrders?: boolean;
    hasActiveOrders?: boolean;
}

/**
 * Customer Create/Update Types
 */
export interface CreateCustomerData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: Address;
    preferences?: Partial<CustomerPreferences>;
}

export interface UpdateCustomerData {
    firstName?: string;
    lastName?: string;
    phone?: string;
    status?: EntityStatus;
    preferences?: Partial<CustomerPreferences>;
    metadata?: Record<string, unknown>;
}

/**
 * Customer Response Types
 */
export interface CustomerSummary {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: EntityStatus;
    lastOrderDate?: string;
    totalOrders: number;
    totalSpent: number;
}

export interface CustomerDetails extends Customer {
    statistics: CustomerStatistics;
    recentOrders: CustomerOrderSummary[];
}

export interface CustomerOrderSummary {
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    createdAt: string;
}

export interface CustomerStatistics {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate?: string;
    orderStatusCounts: Record<string, number>;
}

/**
 * Customer Authentication Types
 */
export interface CustomerAuth {
    id: string;
    customerId: string;
    email: string;
    role: CustomerRole;
    permissions: string[];
    lastLogin?: string;
}

export enum CustomerRole {
    REGULAR = 'regular',
    VIP = 'vip',
    WHOLESALE = 'wholesale'
}

export interface CustomerLoginData {
    email: string;
    password: string;
}

export interface CustomerRegisterData extends CreateCustomerData {
    password: string;
    confirmPassword: string;
}

export interface CustomerPasswordReset {
    email: string;
}

export interface CustomerPasswordUpdate {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
} 