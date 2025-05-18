import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supportApi } from '@/services/api/support';
import { 
  SupportTicket, 
  TicketFilters, 
  TicketStats, 
  TicketUpdate,
  NewTicketMessage 
} from '@/types/support';

/**
 * Hook for managing support tickets list with pagination and filters
 */
export const useTickets = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TicketFilters>({
    page: 1,
    limit: 10,
    status: undefined,
    priority: undefined,
    category: undefined,
    search: undefined,
    startDate: undefined,
    endDate: undefined,
  });

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await supportApi.getTickets(filters);
      setTickets(response.tickets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tickets');
      toast.error('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  const updateFilters = (newFilters: Partial<TicketFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return {
    tickets,
    loading,
    error,
    filters,
    updateFilters,
    refetch: fetchTickets,
  };
};

/**
 * Hook for managing a single support ticket
 */
export const useTicket = (ticketId: string) => {
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supportApi.getTicket(ticketId);
      setTicket(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ticket');
      toast.error('Failed to fetch ticket');
    } finally {
      setLoading(false);
    }
  };

  const updateTicket = async (update: TicketUpdate) => {
    try {
      setLoading(true);
      const updated = await supportApi.updateTicket(ticketId, update);
      setTicket(updated);
      toast.success('Ticket updated successfully');
    } catch (err) {
      toast.error('Failed to update ticket');
    } finally {
      setLoading(false);
    }
  };

  const addMessage = async (message: NewTicketMessage) => {
    try {
      setLoading(true);
      const updated = await supportApi.addMessage(ticketId, message);
      setTicket(updated);
      toast.success('Message added successfully');
    } catch (err) {
      toast.error('Failed to add message');
    } finally {
      setLoading(false);
    }
  };

  const closeTicket = async () => {
    try {
      setLoading(true);
      await supportApi.closeTicket(ticketId);
      await fetchTicket();
      toast.success('Ticket closed successfully');
    } catch (err) {
      toast.error('Failed to close ticket');
    } finally {
      setLoading(false);
    }
  };

  const reopenTicket = async () => {
    try {
      setLoading(true);
      const reopened = await supportApi.reopenTicket(ticketId);
      setTicket(reopened);
      toast.success('Ticket reopened successfully');
    } catch (err) {
      toast.error('Failed to reopen ticket');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketId) {
      fetchTicket();
    }
  }, [ticketId]);

  return {
    ticket,
    loading,
    error,
    updateTicket,
    addMessage,
    closeTicket,
    reopenTicket,
    refetch: fetchTicket,
  };
};

/**
 * Hook for managing ticket creation
 */
export const useTicketCreation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTicket = async (ticket: Partial<SupportTicket>) => {
    try {
      setLoading(true);
      setError(null);
      const created = await supportApi.createTicket(ticket);
      toast.success('Ticket created successfully');
      return created;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create ticket');
      toast.error('Failed to create ticket');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createTicket,
  };
};

/**
 * Hook for managing ticket statistics
 */
export const useTicketStats = () => {
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supportApi.getTicketStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ticket statistics');
      toast.error('Failed to fetch ticket statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}; 