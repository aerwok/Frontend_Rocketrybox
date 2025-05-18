import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { bulkOrderApi } from '../services/api/bulk-order';
import {
    BulkOrder,
    BulkOrderTemplate,
    CreateBulkOrderRequest,
    UpdateBulkOrderRequest,
    CreateBulkOrderTemplateRequest,
    UpdateBulkOrderTemplateRequest,
    UseBulkOrdersReturn,
    UseBulkOrderTemplatesReturn,
    UseBulkOrderProgressReturn
} from '../types/bulk-order';

/**
 * Custom hook for managing bulk orders
 * Handles bulk order creation, updates, and cancellation
 */
export const useBulkOrders = (): UseBulkOrdersReturn => {
    const [orders, setOrders] = useState<BulkOrder[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch all bulk orders
     */
    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await bulkOrderApi.getBulkOrders();
            setOrders(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch bulk orders');
            toast.error('Failed to fetch bulk orders');
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Create new bulk order
     * @param data Bulk order creation data
     */
    const createBulkOrder = useCallback(async (data: CreateBulkOrderRequest) => {
        setIsLoading(true);
        setError(null);
        try {
            const newOrder = await bulkOrderApi.createBulkOrder(data);
            setOrders(prev => [newOrder, ...prev]);
            toast.success('Bulk order created successfully');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create bulk order');
            toast.error('Failed to create bulk order');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Update bulk order
     * @param id Bulk order ID
     * @param data Update data
     */
    const updateBulkOrder = useCallback(async (id: string, data: UpdateBulkOrderRequest) => {
        setIsLoading(true);
        setError(null);
        try {
            const updatedOrder = await bulkOrderApi.updateBulkOrder(id, data);
            setOrders(prev => prev.map(order => order.id === id ? updatedOrder : order));
            toast.success('Bulk order updated successfully');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update bulk order');
            toast.error('Failed to update bulk order');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Cancel bulk order
     * @param id Bulk order ID
     */
    const cancelBulkOrder = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const updatedOrder = await bulkOrderApi.cancelBulkOrder(id);
            setOrders(prev => prev.map(order => order.id === id ? updatedOrder : order));
            toast.success('Bulk order cancelled successfully');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to cancel bulk order');
            toast.error('Failed to cancel bulk order');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Refresh bulk orders
     */
    const refreshOrders = useCallback(async () => {
        await fetchOrders();
    }, [fetchOrders]);

    // Initial fetch
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return {
        orders,
        isLoading,
        error,
        createBulkOrder,
        updateBulkOrder,
        cancelBulkOrder,
        refreshOrders
    };
};

/**
 * Custom hook for managing bulk order templates
 * Handles template creation, updates, and deletion
 */
export const useBulkOrderTemplates = (): UseBulkOrderTemplatesReturn => {
    const [templates, setTemplates] = useState<BulkOrderTemplate[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch all templates
     */
    const fetchTemplates = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { templates: data } = await bulkOrderApi.getBulkOrderTemplates();
            setTemplates(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch templates');
            toast.error('Failed to fetch templates');
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Create new template
     * @param data Template creation data
     */
    const createTemplate = useCallback(async (data: CreateBulkOrderTemplateRequest) => {
        setIsLoading(true);
        setError(null);
        try {
            const newTemplate = await bulkOrderApi.createBulkOrderTemplate(data);
            setTemplates(prev => [...prev, newTemplate]);
            toast.success('Template created successfully');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create template');
            toast.error('Failed to create template');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Update template
     * @param id Template ID
     * @param data Update data
     */
    const updateTemplate = useCallback(async (id: string, data: UpdateBulkOrderTemplateRequest) => {
        setIsLoading(true);
        setError(null);
        try {
            const updatedTemplate = await bulkOrderApi.updateBulkOrderTemplate(id, data);
            setTemplates(prev => prev.map(template => template.id === id ? updatedTemplate : template));
            toast.success('Template updated successfully');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update template');
            toast.error('Failed to update template');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Delete template
     * @param id Template ID
     */
    const deleteTemplate = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await bulkOrderApi.deleteBulkOrderTemplate(id);
            setTemplates(prev => prev.filter(template => template.id !== id));
            toast.success('Template deleted successfully');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete template');
            toast.error('Failed to delete template');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Refresh templates
     */
    const refreshTemplates = useCallback(async () => {
        await fetchTemplates();
    }, [fetchTemplates]);

    // Initial fetch
    useEffect(() => {
        fetchTemplates();
    }, [fetchTemplates]);

    return {
        templates,
        isLoading,
        error,
        createTemplate,
        updateTemplate,
        deleteTemplate,
        refreshTemplates
    };
};

/**
 * Custom hook for managing bulk order progress
 * Handles progress tracking and updates
 */
export const useBulkOrderProgress = (orderId: string): UseBulkOrderProgressReturn => {
    const [progress, setProgress] = useState<BulkOrderProgress | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch progress
     */
    const fetchProgress = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await bulkOrderApi.getBulkOrderProgress(orderId);
            setProgress(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch progress');
            toast.error('Failed to fetch progress');
        } finally {
            setIsLoading(false);
        }
    }, [orderId]);

    /**
     * Refresh progress
     */
    const refreshProgress = useCallback(async () => {
        await fetchProgress();
    }, [fetchProgress]);

    // Initial fetch and periodic updates
    useEffect(() => {
        fetchProgress();
        const interval = setInterval(fetchProgress, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, [fetchProgress]);

    return {
        progress,
        isLoading,
        error,
        refreshProgress
    };
}; 