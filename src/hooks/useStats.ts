import { useState, useEffect } from 'react';
import { statsApi } from '@/services/api/stats';

export interface StatData {
    title: string;
    subtitle?: string;
    value: string | number;
    todayValue?: string | number;
    additionalValue?: {
        label: string;
        value: string | number;
    };
}

interface UseStatsProps {
    statType: 'orders' | 'revenue' | 'returns' | 'customers';
    timeRange?: 'today' | 'week' | 'month' | 'year';
}

interface UseStatsReturn {
    data: StatData | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching and managing statistics data
 * 
 * This hook handles:
 * - Fetching stats data from API
 * - Managing loading and error states
 * - Refreshing data on demand
 * 
 * @param {UseStatsProps} props - Hook configuration
 * @returns {UseStatsReturn} Stats data and state management
 */
export const useStats = ({ statType, timeRange = 'today' }: UseStatsProps): UseStatsReturn => {
    const [data, setData] = useState<StatData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch stats data from API
     */
    const fetchStats = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await statsApi.getStats(statType, timeRange);
            setData(response);
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Failed to fetch stats data');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Refetch stats data
     */
    const refetch = async () => {
        await fetchStats();
    };

    // Fetch data when dependencies change
    useEffect(() => {
        fetchStats();
    }, [statType, timeRange]);

    return {
        data,
        isLoading,
        error,
        refetch,
    };
}; 