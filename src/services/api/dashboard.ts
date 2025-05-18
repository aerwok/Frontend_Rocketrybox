import axios from 'axios';
import {
    DashboardData,
    DashboardFilterParams
} from '../../types/dashboard';

/**
 * Dashboard API Service
 * Handles all dashboard-related API calls
 */
export const dashboardApi = {
    /**
     * Get dashboard data with optional filtering
     * @param params Filter parameters
     * @returns Promise<DashboardData>
     */
    getDashboardData: async (params: DashboardFilterParams = {}): Promise<DashboardData> => {
        const response = await axios.get('/api/v2/seller/dashboard', { params });
        return response.data.data;
    },

    /**
     * Get dashboard summary statistics
     * @returns Promise<DashboardSummary>
     */
    getDashboardSummary: async (): Promise<DashboardData['summary']> => {
        const response = await axios.get('/api/v2/seller/dashboard/summary');
        return response.data.data;
    },

    /**
     * Get recent orders
     * @param limit Number of orders to fetch
     * @returns Promise<RecentOrder[]>
     */
    getRecentOrders: async (limit: number = 5): Promise<DashboardData['recentOrders']> => {
        const response = await axios.get('/api/v2/seller/dashboard/recent-orders', {
            params: { limit }
        });
        return response.data.data;
    },

    /**
     * Get top products
     * @param limit Number of products to fetch
     * @returns Promise<TopProduct[]>
     */
    getTopProducts: async (limit: number = 5): Promise<DashboardData['topProducts']> => {
        const response = await axios.get('/api/v2/seller/dashboard/top-products', {
            params: { limit }
        });
        return response.data.data;
    },

    /**
     * Get sales data
     * @param params Filter parameters
     * @returns Promise<SalesData[]>
     */
    getSalesData: async (params: DashboardFilterParams): Promise<DashboardData['salesData']> => {
        const response = await axios.get('/api/v2/seller/dashboard/sales', { params });
        return response.data.data;
    },

    /**
     * Get customer activity
     * @param limit Number of customers to fetch
     * @returns Promise<CustomerActivity[]>
     */
    getCustomerActivity: async (limit: number = 5): Promise<DashboardData['customerActivity']> => {
        const response = await axios.get('/api/v2/seller/dashboard/customer-activity', {
            params: { limit }
        });
        return response.data.data;
    }
}; 