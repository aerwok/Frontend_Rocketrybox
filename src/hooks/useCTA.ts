import { useState, useEffect } from 'react';
import { ctaApi } from '@/services/api/cta';

export interface CTAData {
    title: string;
    description: string;
    buttonText: string;
    imageUrl: string;
    gradient: {
        from: string;
        to: string;
    };
}

interface UseCTAReturn {
    data: CTAData | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**
 * Custom hook for managing CTA (Call to Action) data
 * 
 * This hook handles:
 * - Fetching CTA content from API
 * - Managing loading and error states
 * - Refreshing data on demand
 * 
 * @returns {UseCTAReturn} CTA data and state management
 */
export const useCTA = (): UseCTAReturn => {
    const [data, setData] = useState<CTAData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch CTA data from API
     */
    const fetchCTAData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await ctaApi.getCTAData();
            setData(response);
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Failed to fetch CTA data');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Refetch CTA data
     */
    const refetch = async () => {
        await fetchCTAData();
    };

    // Fetch data on mount
    useEffect(() => {
        fetchCTAData();
    }, []);

    return {
        data,
        isLoading,
        error,
        refetch,
    };
}; 