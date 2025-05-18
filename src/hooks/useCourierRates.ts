import { useState, useEffect } from 'react';
import { courierApi } from '../services/api/courier';

export interface CourierRate {
    courier: string;
    image: string;
    mode: string;
    shipping: number;
    gst: number;
    total: number;
}

export type SortField = "courier" | "mode" | "shipping" | "gst" | "total";
export type SortOrder = "asc" | "desc";

interface UseCourierRatesReturn {
    rates: CourierRate[];
    loading: boolean;
    error: string | null;
    sortField: SortField;
    sortOrder: SortOrder;
    setSortField: (field: SortField) => void;
    setSortOrder: (order: SortOrder) => void;
    refetch: () => Promise<void>;
}

/**
 * Custom hook for managing courier rates
 * 
 * This hook handles:
 * - Fetching courier rates from API
 * - Sorting and filtering rates
 * - Loading and error states
 * - State management for sorting
 * 
 * @returns {UseCourierRatesReturn} Object containing courier rates and states
 */
export const useCourierRates = (): UseCourierRatesReturn => {
    const [rates, setRates] = useState<CourierRate[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [sortField, setSortField] = useState<SortField>("total");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

    /**
     * Fetch courier rates from API
     * TODO: Replace with actual API endpoint when ready
     */
    const fetchRates = async () => {
        try {
            setLoading(true);
            setError(null);

            // TODO: Replace with actual API call
            // const response = await courierApi.getRates();
            // setRates(response.data);
            
            // For now, set empty array until API is ready
            setRates([]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch courier rates');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Sort rates based on current sort field and order
     */
    const getSortedRates = () => {
        return [...rates].sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];

            if (typeof aValue === "string" && typeof bValue === "string") {
                return sortOrder === "asc"
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            return sortOrder === "asc"
                ? Number(aValue) - Number(bValue)
                : Number(bValue) - Number(aValue);
        });
    };

    useEffect(() => {
        fetchRates();
    }, []);

    return {
        rates: getSortedRates(),
        loading,
        error,
        sortField,
        sortOrder,
        setSortField,
        setSortOrder,
        refetch: fetchRates,
    };
}; 