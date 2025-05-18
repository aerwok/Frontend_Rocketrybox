import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { adminApi } from '../services/api/admin';

interface RouteHeader {
    title: string;
    description: string;
}

interface UseEscalationHeaderReturn {
    headerInfo: RouteHeader | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**
 * Custom hook for managing escalation headers
 * 
 * This hook handles:
 * - Fetching header information based on current route
 * - Loading and error states
 * - API integration for header data
 * - Automatic header updates on route changes
 * 
 * @returns {UseEscalationHeaderReturn} Object containing header info and states
 */
export const useEscalationHeader = (): UseEscalationHeaderReturn => {
    const { pathname } = useLocation();
    const [headerInfo, setHeaderInfo] = useState<RouteHeader | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const currentRoute = pathname.split("/").pop() || "search";

    const fetchHeaderInfo = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // TODO: Replace with actual API call when endpoint is ready
            // const response = await adminApi.getEscalationHeader(currentRoute);
            // setHeaderInfo(response.data);
            
            // For now, return null until API is ready
            setHeaderInfo(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load header information');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHeaderInfo();
    }, [currentRoute]);

    return {
        headerInfo,
        loading,
        error,
        refetch: fetchHeaderInfo,
    };
}; 