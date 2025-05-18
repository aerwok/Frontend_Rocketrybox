import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ndrApi } from '../services/api/ndr';
import { NDR, NDRFilters, NDRCreateRequest, NDRUpdateRequest, NDRAttemptRequest, NDRResolutionRequest } from '../types/ndr';

/**
 * Hook for managing NDR data
 * Handles fetching, creating, updating, and deleting NDRs
 */
export const useNDRs = () => {
    const [ndrs, setNdrs] = useState<NDR[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    const fetchNDRs = async (filters?: NDRFilters) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await ndrApi.getNDRs(filters);
            setNdrs(response.data);
            setTotal(response.total);
            setPage(response.page);
            setLimit(response.limit);
            setTotalPages(response.totalPages);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch NDRs');
            toast.error('Failed to fetch NDRs');
        } finally {
            setIsLoading(false);
        }
    };

    const createNDR = async (data: NDRCreateRequest) => {
        try {
            const response = await ndrApi.createNDR(data);
            setNdrs(prev => [response.data, ...prev]);
            toast.success('NDR created successfully');
            return response.data;
        } catch (err) {
            toast.error('Failed to create NDR');
            throw err;
        }
    };

    const updateNDR = async (id: string, data: NDRUpdateRequest) => {
        try {
            const response = await ndrApi.updateNDR(id, data);
            setNdrs(prev => prev.map(ndr => ndr.id === id ? response.data : ndr));
            toast.success('NDR updated successfully');
            return response.data;
        } catch (err) {
            toast.error('Failed to update NDR');
            throw err;
        }
    };

    const addNDRAttempt = async (id: string, data: NDRAttemptRequest) => {
        try {
            const response = await ndrApi.addNDRAttempt(id, data);
            setNdrs(prev => prev.map(ndr => ndr.id === id ? response.data : ndr));
            toast.success('Delivery attempt added successfully');
            return response.data;
        } catch (err) {
            toast.error('Failed to add delivery attempt');
            throw err;
        }
    };

    const resolveNDR = async (id: string, data: NDRResolutionRequest) => {
        try {
            const response = await ndrApi.resolveNDR(id, data);
            setNdrs(prev => prev.map(ndr => ndr.id === id ? response.data : ndr));
            toast.success('NDR resolved successfully');
            return response.data;
        } catch (err) {
            toast.error('Failed to resolve NDR');
            throw err;
        }
    };

    const deleteNDR = async (id: string) => {
        try {
            await ndrApi.deleteNDR(id);
            setNdrs(prev => prev.filter(ndr => ndr.id !== id));
            toast.success('NDR deleted successfully');
        } catch (err) {
            toast.error('Failed to delete NDR');
            throw err;
        }
    };

    const refreshNDRs = () => {
        fetchNDRs();
    };

    useEffect(() => {
        fetchNDRs();
    }, []);

    return {
        ndrs,
        isLoading,
        error,
        total,
        page,
        limit,
        totalPages,
        fetchNDRs,
        createNDR,
        updateNDR,
        addNDRAttempt,
        resolveNDR,
        deleteNDR,
        refreshNDRs
    };
};

/**
 * Hook for managing NDR filters
 * Handles filter state and application
 */
export const useNDRFilters = () => {
    const [filters, setFilters] = useState<NDRFilters>({
        page: 1,
        limit: 10
    });

    const applyFilters = async () => {
        // This will be implemented when the backend is ready
        // For now, it's a placeholder
        console.log('Applying filters:', filters);
    };

    const resetFilters = () => {
        setFilters({
            page: 1,
            limit: 10
        });
    };

    return {
        filters,
        setFilters,
        applyFilters,
        resetFilters
    };
}; 