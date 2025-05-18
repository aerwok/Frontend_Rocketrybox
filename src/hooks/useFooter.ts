import { useState, useEffect } from 'react';
import { footerApi } from '@/services/api/footer';

export interface FooterLink {
    to: string;
    label: string;
}

export interface FooterSection {
    title: string;
    links: FooterLink[];
}

export interface FooterData {
    company: {
        name: string;
        address: string;
        cin: string;
        emails: string[];
        websites: string[];
    };
    sections: {
        resources: FooterSection;
        features: FooterSection;
        partner: FooterSection;
        support: FooterSection;
    };
}

interface UseFooterReturn {
    data: FooterData | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**
 * Custom hook for managing footer data
 * 
 * This hook handles:
 * - Fetching footer content from API
 * - Managing loading and error states
 * - Refreshing data on demand
 * 
 * @returns {UseFooterReturn} Footer data and state management
 */
export const useFooter = (): UseFooterReturn => {
    const [data, setData] = useState<FooterData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch footer data from API
     */
    const fetchFooterData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await footerApi.getFooterData();
            setData(response);
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Failed to fetch footer data');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Refetch footer data
     */
    const refetch = async () => {
        await fetchFooterData();
    };

    // Fetch data on mount
    useEffect(() => {
        fetchFooterData();
    }, []);

    return {
        data,
        isLoading,
        error,
        refetch,
    };
}; 