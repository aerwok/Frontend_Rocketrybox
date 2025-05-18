import { useState, useEffect } from 'react';
import { supportApi } from '@/services/api/support';

export interface Ticket {
    id: string;
    subject: string;
    category: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high';
    createdAt: string;
    updatedAt: string;
    assignedTo?: string;
}

interface UseTicketsReturn {
    tickets: Ticket[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    updateTicketStatus: (ticketId: string, status: Ticket['status']) => Promise<void>;
}

/**
 * Custom hook for managing ticket data
 * 
 * This hook handles:
 * - Fetching tickets from the API
 * - Managing loading and error states
 * - Updating ticket status
 * - Refreshing ticket data
 * 
 * @returns {UseTicketsReturn} Object containing tickets data and methods
 */
export const useTickets = (): UseTicketsReturn => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch tickets from the API
     */
    const fetchTickets = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await supportApi.getTickets();
            setTickets(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch tickets');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Update ticket status
     * @param {string} ticketId - ID of the ticket to update
     * @param {Ticket['status']} status - New status for the ticket
     */
    const updateTicketStatus = async (ticketId: string, status: Ticket['status']) => {
        try {
            setIsLoading(true);
            setError(null);
            await supportApi.updateTicketStatus(ticketId, status);
            await fetchTickets(); // Refresh the ticket list
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update ticket status');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch tickets on mount
    useEffect(() => {
        fetchTickets();
    }, []);

    return {
        tickets,
        isLoading,
        error,
        refetch: fetchTickets,
        updateTicketStatus,
    };
}; 