import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { manifestApi } from '../services/api/manifest';
import {
    Manifest,
    ManifestFilterParams,
    CreateManifestRequest,
    UpdateManifestRequest,
    UseManifestsReturn,
    UseManifestFiltersReturn
} from '../types/manifest';

/**
 * Custom hook for managing manifests
 * Handles fetching, creating, updating, and deleting manifests
 */
export const useManifests = (): UseManifestsReturn => {
    const [manifests, setManifests] = useState<Manifest[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(0);

    /**
     * Fetch manifests with optional filtering
     */
    const fetchManifests = useCallback(async (params?: ManifestFilterParams) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await manifestApi.getManifests({
                page,
                limit,
                ...params
            });
            setManifests(response.data);
            setTotal(response.total);
            setPage(response.page);
            setLimit(response.limit);
            setTotalPages(response.totalPages);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch manifests');
            toast.error('Failed to fetch manifests');
        } finally {
            setIsLoading(false);
        }
    }, [page, limit]);

    /**
     * Create a new manifest
     */
    const createManifest = useCallback(async (data: CreateManifestRequest): Promise<Manifest> => {
        try {
            const response = await manifestApi.createManifest(data);
            await fetchManifests();
            toast.success('Manifest created successfully');
            return response.data;
        } catch (err) {
            toast.error('Failed to create manifest');
            throw err;
        }
    }, [fetchManifests]);

    /**
     * Update an existing manifest
     */
    const updateManifest = useCallback(async (id: string, data: UpdateManifestRequest): Promise<Manifest> => {
        try {
            const response = await manifestApi.updateManifest(id, data);
            await fetchManifests();
            toast.success('Manifest updated successfully');
            return response.data;
        } catch (err) {
            toast.error('Failed to update manifest');
            throw err;
        }
    }, [fetchManifests]);

    /**
     * Delete a manifest
     */
    const deleteManifest = useCallback(async (id: string): Promise<void> => {
        try {
            await manifestApi.deleteManifest(id);
            await fetchManifests();
            toast.success('Manifest deleted successfully');
        } catch (err) {
            toast.error('Failed to delete manifest');
            throw err;
        }
    }, [fetchManifests]);

    /**
     * Refresh manifests list
     */
    const refreshManifests = useCallback(async () => {
        await fetchManifests();
    }, [fetchManifests]);

    // Initial fetch
    useEffect(() => {
        fetchManifests();
    }, [fetchManifests]);

    return {
        manifests,
        isLoading,
        error,
        total,
        page,
        limit,
        totalPages,
        fetchManifests,
        createManifest,
        updateManifest,
        deleteManifest,
        refreshManifests
    };
};

/**
 * Custom hook for managing manifest filters
 * Handles filter state and application
 */
export const useManifestFilters = (): UseManifestFiltersReturn => {
    const [filters, setFilters] = useState<ManifestFilterParams>({
        page: 1,
        limit: 10
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
            page: 1,
            limit: 10
        });
    }, []);

    return {
        filters,
        setFilters,
        applyFilters,
        resetFilters
    };
}; 