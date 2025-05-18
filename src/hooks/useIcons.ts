import { useState, useEffect } from 'react';
import { iconsApi } from '@/services/api/icons';

export interface IconData {
    name: string;
    viewBox: string;
    paths: string[];
    width?: number;
    height?: number;
}

interface UseIconsReturn {
    icons: Record<string, IconData>;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**
 * Custom hook for managing icons
 * 
 * This hook handles:
 * - Fetching icon data from API
 * - Managing loading and error states
 * - Refreshing data on demand
 * - Caching icons for better performance
 * 
 * @returns {UseIconsReturn} Icons data and state management
 */
export const useIcons = (): UseIconsReturn => {
    const [icons, setIcons] = useState<Record<string, IconData>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch icons data from API
     */
    const fetchIconsData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await iconsApi.getIcons();
            setIcons(response);
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Failed to fetch icons data');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Refetch icons data
     */
    const refetch = async () => {
        await fetchIconsData();
    };

    // Fetch data on mount
    useEffect(() => {
        fetchIconsData();
    }, []);

    return {
        icons,
        isLoading,
        error,
        refetch,
    };
}; 