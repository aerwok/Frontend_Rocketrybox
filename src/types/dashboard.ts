import { BaseEntity } from './api';

/**
 * Dashboard Summary Types
 */
export interface DashboardSummary {
    totalOrders: number;
    totalRevenue: number;
    totalCustomers: number;
    totalProducts: number;
    recentOrders: number;
    pendingOrders: number;
    lowStockProducts: number;
    activeCustomers: number;
}

export interface RecentOrder extends BaseEntity {
    orderId: string;
    customerName: string;
    amount: number;
    status: OrderStatus;
    paymentMethod: string;
}

export interface TopProduct extends BaseEntity {
    productId: string;
    name: string;
    image: string;
    price: number;
    stock: number;
    sales: number;
    revenue: number;
}

export interface SalesData {
    date: string;
    revenue: number;
    orders: number;
}

export interface CustomerActivity {
    customerId: string;
    name: string;
    email: string;
    lastOrderDate: string;
    totalOrders: number;
    totalSpent: number;
}

export enum OrderStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

/**
 * Dashboard Request Types
 */
export interface DashboardFilterParams {
    startDate?: string;
    endDate?: string;
    period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

/**
 * Dashboard Response Types
 */
export interface DashboardData {
    summary: DashboardSummary;
    recentOrders: RecentOrder[];
    topProducts: TopProduct[];
    salesData: SalesData[];
    customerActivity: CustomerActivity[];
}

/**
 * Dashboard Hook Return Types
 */
export interface UseDashboardReturn {
    data: DashboardData | null;
    isLoading: boolean;
    error: string | null;
    refreshDashboard: () => Promise<void>;
}

export interface UseDashboardFiltersReturn {
    filters: DashboardFilterParams;
    setFilters: (filters: DashboardFilterParams) => void;
    applyFilters: () => Promise<void>;
    resetFilters: () => void;
} 