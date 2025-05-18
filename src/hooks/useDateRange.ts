import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { adminApi } from '../services/api/admin';

interface UseDateRangeReturn {
    dateRange: DateRange | undefined;
    setDateRange: (date: DateRange | undefined) => void;
    loading: boolean;
    error: string | null;
    saveDateRange: (dateRange: DateRange) => Promise<void>;
}

/**
 * Custom hook for managing date range selection and persistence
 * 
 * This hook handles:
 * - Date range state management
 * - Loading and error states
 * - API integration for saving date ranges
 * - Initial date range loading
 * 
 * @returns {UseDateRangeReturn} Object containing date range state and actions
 */
export const useDateRange = (): UseDateRangeReturn => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Load initial date range from API
     * TODO: Replace with actual API endpoint when ready
     */
    useEffect(() => {
        const loadInitialDateRange = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // TODO: Replace with actual API call
                // const response = await adminApi.getDateRange();
                // setDateRange(response.data);
                
                // For now, set to undefined until API is ready
                setDateRange(undefined);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load date range');
            } finally {
                setLoading(false);
            }
        };

        loadInitialDateRange();
    }, []);

    /**
     * Save date range to API
     * TODO: Replace with actual API endpoint when ready
     */
    const saveDateRange = async (newDateRange: DateRange) => {
        try {
            setLoading(true);
            setError(null);
            
            // TODO: Replace with actual API call
            // await adminApi.saveDateRange(newDateRange);
            
            setDateRange(newDateRange);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save date range');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        dateRange,
        setDateRange,
        loading,
        error,
        saveDateRange,
    };
}; 