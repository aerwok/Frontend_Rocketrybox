import { useState, useCallback } from 'react';
import { OrderFilters, OrderStatus } from '@/services/api/orderData';

interface UseOrderFiltersReturn {
    // Filter state
    filters: OrderFilters;
    selectedStatus: OrderStatus | null;
    searchQuery: string;
    dateRange: {
        startDate: string | null;
        endDate: string | null;
    };

    // Filter operations
    updateStatus: (status: OrderStatus | null) => void;
    updateSearchQuery: (query: string) => void;
    updateDateRange: (startDate: string | null, endDate: string | null) => void;
    clearFilters: () => void;
    getFilters: () => OrderFilters;
}

/**
 * useOrderFilters Hook
 * 
 * Manages order filters state and operations:
 * - Status filter
 * - Search query
 * - Date range filter
 * - Filter clearing
 * - Filter retrieval
 * 
 * @returns {UseOrderFiltersReturn} Order filters state and operations
 */
export const useOrderFilters = (): UseOrderFiltersReturn => {
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);
    const [searchQuery, setSearchQueryState] = useState('');
    const [dateRange, setDateRangeState] = useState<{
        startDate: string | null;
        endDate: string | null;
    }>({
        startDate: null,
        endDate: null,
    });

    /**
     * Update status filter
     * @param {OrderStatus | null} status - Order status to filter by
     */
    const updateStatus = useCallback((status: OrderStatus | null) => {
        setSelectedStatus(status);
    }, []);

    /**
     * Update search query
     * @param {string} query - Search query
     */
    const updateSearchQuery = useCallback((query: string) => {
        setSearchQueryState(query);
    }, []);

    /**
     * Update date range filter
     * @param {string | null} startDate - Start date
     * @param {string | null} endDate - End date
     */
    const updateDateRange = useCallback((startDate: string | null, endDate: string | null) => {
        setDateRangeState({ startDate, endDate });
    }, []);

    /**
     * Clear all filters
     */
    const clearFilters = useCallback(() => {
        setSelectedStatus(null);
        setSearchQueryState('');
        setDateRangeState({ startDate: null, endDate: null });
    }, []);

    /**
     * Get current filters
     * @returns {OrderFilters} Current filters
     */
    const getFilters = useCallback((): OrderFilters => {
        const filters: OrderFilters = {};

        if (selectedStatus) {
            filters.status = selectedStatus;
        }

        if (searchQuery) {
            filters.search = searchQuery;
        }

        if (dateRange.startDate) {
            filters.startDate = dateRange.startDate;
        }

        if (dateRange.endDate) {
            filters.endDate = dateRange.endDate;
        }

        return filters;
    }, [selectedStatus, searchQuery, dateRange]);

    return {
        filters: getFilters(),
        selectedStatus,
        searchQuery,
        dateRange,
        updateStatus,
        updateSearchQuery,
        updateDateRange,
        clearFilters,
        getFilters,
    };
}; 