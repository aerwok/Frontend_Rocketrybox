import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { dashboardApi } from '../services/api/dashboard';
import {
    DashboardData,
    DashboardFilterParams,
    UseDashboardReturn,
    UseDashboardFiltersReturn
} from '../types/dashboard';

/**
 * Custom hook for managing dashboard data
 * Handles fetching and refreshing dashboard data
 */
export const useDashboard = (): UseDashboardReturn => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch dashboard data
     */
    const fetchDashboardData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const dashboardData = await dashboardApi.getDashboardData();
            setData(dashboardData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
            toast.error('Failed to fetch dashboard data');
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Refresh dashboard data
     */
    const refreshDashboard = useCallback(async () => {
        await fetchDashboardData();
    }, [fetchDashboardData]);

    // Initial fetch
    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    return {
        data,
        isLoading,
        error,
        refreshDashboard
    };
};

/**
 * Custom hook for managing dashboard filters
 * Handles filter state and application
 */
export const useDashboardFilters = (): UseDashboardFiltersReturn => {
    const [filters, setFilters] = useState<DashboardFilterParams>({
        period: 'daily'
    });

    /**
     * Apply filters
     */
    const applyFilters = useCallback(async () => {
        // This will be implemented when the backend is ready
        // For now, it's just a placeholder
        console.log('Applying filters:', filters);
    }, [filters]);

    /**
     * Reset filters to default values
     */
    const resetFilters = useCallback(() => {
        setFilters({
            period: 'daily'
        });
    }, []);

    return {
        filters,
        setFilters,
        applyFilters,
        resetFilters
    };
}; 