import axios from 'axios';
import {
    BulkOrder,
    BulkOrderSummary,
    BulkOrderTemplate,
    BulkOrderTemplateSummary,
    BulkOrderProgress,
    CreateBulkOrderRequest,
    UpdateBulkOrderRequest,
    CreateBulkOrderTemplateRequest,
    UpdateBulkOrderTemplateRequest
} from '../../types/bulk-order';

/**
 * Bulk Order API Service
 * Handles all bulk order-related API calls
 */
export const bulkOrderApi = {
    /**
     * Get bulk order summary
     * @returns BulkOrderSummary with statistics and recent orders
     */
    getBulkOrderSummary: async (): Promise<BulkOrderSummary> => {
        const response = await axios.get<BulkOrderSummary>('/api/bulk-orders/summary');
        return response.data;
    },

    /**
     * Get all bulk orders
     * @returns Array of bulk orders
     */
    getBulkOrders: async (): Promise<BulkOrder[]> => {
        const response = await axios.get<BulkOrder[]>('/api/bulk-orders');
        return response.data;
    },

    /**
     * Get bulk order by ID
     * @param id Bulk order ID
     * @returns Bulk order details
     */
    getBulkOrder: async (id: string): Promise<BulkOrder> => {
        const response = await axios.get<BulkOrder>(`/api/bulk-orders/${id}`);
        return response.data;
    },

    /**
     * Create new bulk order
     * @param data Bulk order creation data
     * @returns Created bulk order
     */
    createBulkOrder: async (data: CreateBulkOrderRequest): Promise<BulkOrder> => {
        const formData = new FormData();
        formData.append('file', data.file);
        formData.append('templateId', data.templateId);

        const response = await axios.post<BulkOrder>('/api/bulk-orders', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    /**
     * Update bulk order
     * @param id Bulk order ID
     * @param data Update data
     * @returns Updated bulk order
     */
    updateBulkOrder: async (id: string, data: UpdateBulkOrderRequest): Promise<BulkOrder> => {
        const response = await axios.patch<BulkOrder>(`/api/bulk-orders/${id}`, data);
        return response.data;
    },

    /**
     * Cancel bulk order
     * @param id Bulk order ID
     * @returns Updated bulk order
     */
    cancelBulkOrder: async (id: string): Promise<BulkOrder> => {
        const response = await axios.post<BulkOrder>(`/api/bulk-orders/${id}/cancel`);
        return response.data;
    },

    /**
     * Get bulk order progress
     * @param id Bulk order ID
     * @returns Progress information
     */
    getBulkOrderProgress: async (id: string): Promise<BulkOrderProgress> => {
        const response = await axios.get<BulkOrderProgress>(`/api/bulk-orders/${id}/progress`);
        return response.data;
    },

    /**
     * Get bulk order templates
     * @returns Template summary with list of templates
     */
    getBulkOrderTemplates: async (): Promise<BulkOrderTemplateSummary> => {
        const response = await axios.get<BulkOrderTemplateSummary>('/api/bulk-orders/templates');
        return response.data;
    },

    /**
     * Create bulk order template
     * @param data Template creation data
     * @returns Created template
     */
    createBulkOrderTemplate: async (data: CreateBulkOrderTemplateRequest): Promise<BulkOrderTemplate> => {
        const response = await axios.post<BulkOrderTemplate>('/api/bulk-orders/templates', data);
        return response.data;
    },

    /**
     * Update bulk order template
     * @param id Template ID
     * @param data Update data
     * @returns Updated template
     */
    updateBulkOrderTemplate: async (id: string, data: UpdateBulkOrderTemplateRequest): Promise<BulkOrderTemplate> => {
        const response = await axios.patch<BulkOrderTemplate>(`/api/bulk-orders/templates/${id}`, data);
        return response.data;
    },

    /**
     * Delete bulk order template
     * @param id Template ID
     */
    deleteBulkOrderTemplate: async (id: string): Promise<void> => {
        await axios.delete(`/api/bulk-orders/templates/${id}`);
    },

    /**
     * Download bulk order results
     * @param id Bulk order ID
     * @returns Blob containing results file
     */
    downloadBulkOrderResults: async (id: string): Promise<Blob> => {
        const response = await axios.get(`/api/bulk-orders/${id}/download`, {
            responseType: 'blob'
        });
        return response.data;
    }
}; 