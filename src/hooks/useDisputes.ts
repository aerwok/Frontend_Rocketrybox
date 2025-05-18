import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { disputeApi } from '../services/api/dispute';
import {
    Dispute,
    DisputeSummary,
    CreateDisputeRequest,
    UpdateDisputeRequest,
    DisputeFilterParams,
    UseDisputesReturn,
    UseDisputeFiltersReturn
} from '../types/dispute';

/**
 * Custom hook for managing disputes
 * Handles dispute creation, updates, and status changes
 */
export const useDisputes = (): UseDisputesReturn => {
    const [disputes, setDisputes] = useState<Dispute[]>([]);
    const [summary, setSummary] = useState<DisputeSummary | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch dispute summary
     */
    const fetchSummary = useCallback(async () => {
        try {
            const data = await disputeApi.getDisputeSummary();
            setSummary(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch dispute summary');
            toast.error('Failed to fetch dispute summary');
        }
    }, []);

    /**
     * Fetch disputes
     */
    const fetchDisputes = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { disputes: data } = await disputeApi.getDisputes({});
            setDisputes(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch disputes');
            toast.error('Failed to fetch disputes');
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Create new dispute
     * @param data Dispute creation data
     */
    const createDispute = useCallback(async (data: CreateDisputeRequest) => {
        setIsLoading(true);
        setError(null);
        try {
            const newDispute = await disputeApi.createDispute(data);
            setDisputes(prev => [newDispute, ...prev]);
            toast.success('Dispute created successfully');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create dispute');
            toast.error('Failed to create dispute');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Update dispute
     * @param id Dispute ID
     * @param data Update data
     */
    const updateDispute = useCallback(async (id: string, data: UpdateDisputeRequest) => {
        setIsLoading(true);
        setError(null);
        try {
            const updatedDispute = await disputeApi.updateDispute(id, data);
            setDisputes(prev => prev.map(dispute => dispute.id === id ? updatedDispute : dispute));
            toast.success('Dispute updated successfully');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update dispute');
            toast.error('Failed to update dispute');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Resolve dispute
     * @param id Dispute ID
     * @param resolution Resolution text
     */
    const resolveDispute = useCallback(async (id: string, resolution: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const updatedDispute = await disputeApi.resolveDispute(id, resolution);
            setDisputes(prev => prev.map(dispute => dispute.id === id ? updatedDispute : dispute));
            toast.success('Dispute resolved successfully');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to resolve dispute');
            toast.error('Failed to resolve dispute');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Close dispute
     * @param id Dispute ID
     */
    const closeDispute = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const updatedDispute = await disputeApi.closeDispute(id);
            setDisputes(prev => prev.map(dispute => dispute.id === id ? updatedDispute : dispute));
            toast.success('Dispute closed successfully');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to close dispute');
            toast.error('Failed to close dispute');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Reopen dispute
     * @param id Dispute ID
     */
    const reopenDispute = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const updatedDispute = await disputeApi.reopenDispute(id);
            setDisputes(prev => prev.map(dispute => dispute.id === id ? updatedDispute : dispute));
            toast.success('Dispute reopened successfully');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to reopen dispute');
            toast.error('Failed to reopen dispute');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Refresh disputes
     */
    const refreshDisputes = useCallback(async () => {
        await Promise.all([fetchDisputes(), fetchSummary()]);
    }, [fetchDisputes, fetchSummary]);

    // Initial fetch
    useEffect(() => {
        refreshDisputes();
    }, [refreshDisputes]);

    return {
        disputes,
        summary,
        isLoading,
        error,
        createDispute,
        updateDispute,
        resolveDispute,
        closeDispute,
        reopenDispute,
        refreshDisputes
    };
};

/**
 * Custom hook for managing dispute filters
 * Handles filter state and application
 */
export const useDisputeFilters = (): UseDisputeFiltersReturn => {
    const [filters, setFilters] = useState<DisputeFilterParams>({
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