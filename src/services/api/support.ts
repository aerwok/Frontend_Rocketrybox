import { api } from './index';
import { Ticket } from '@/hooks/useTickets';

/**
 * Support API service
 * 
 * This service handles all support-related API calls:
 * - Ticket creation and management
 * - Ticket status updates
 * - File attachments
 * - Ticket categories
 * 
 * TODO: Replace placeholder endpoints with actual API endpoints when ready
 */
export const supportApi = {
    /**
     * Get all tickets
     * @returns {Promise<{ data: Ticket[] }>}
     */
    getTickets: () => {
        return api.get('/support/tickets');
    },

    /**
     * Create a new support ticket
     * @param {FormData} formData - Form data containing ticket details and attachments
     * @returns {Promise<{ ticketId: string; message: string }>}
     */
    createTicket: (formData: FormData) => {
        return api.post('/support/tickets', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    /**
     * Get ticket categories
     * @returns {Promise<Array<string>>}
     */
    getCategories: () => {
        return api.get('/support/categories');
    },

    /**
     * Get ticket status
     * @param {string} ticketId - Ticket identifier
     * @returns {Promise<{ status: string; lastUpdated: string }>}
     */
    getTicketStatus: (ticketId: string) => {
        return api.get(`/support/tickets/${ticketId}/status`);
    },

    /**
     * Update ticket status
     * @param {string} ticketId - Ticket identifier
     * @param {string} status - New status
     * @returns {Promise<{ success: boolean; message: string }>}
     */
    updateTicketStatus: (ticketId: string, status: string) => {
        return api.patch(`/support/tickets/${ticketId}/status`, { status });
    },

    /**
     * Upload ticket attachments
     * @param {string} ticketId - Ticket identifier
     * @param {FormData} formData - Form data containing files
     * @returns {Promise<{ success: boolean; message: string }>}
     */
    uploadAttachments: (ticketId: string, formData: FormData) => {
        return api.post(`/support/tickets/${ticketId}/attachments`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
}; 