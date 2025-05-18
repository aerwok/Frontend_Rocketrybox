import axios from 'axios';
import { 
  SupportTicket, 
  TicketFilters, 
  TicketResponse, 
  TicketStats, 
  TicketUpdate,
  NewTicketMessage 
} from '@/types/support';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

/**
 * Support Ticket API Service
 * Handles all support ticket-related API calls
 */
export const supportApi = {
  /**
   * Get all support tickets with optional filters
   * @param filters TicketFilters
   * @returns Promise<TicketResponse>
   */
  getTickets: async (filters?: TicketFilters): Promise<TicketResponse> => {
    const response = await axios.get(`${API_URL}/support/tickets`, { params: filters });
    return response.data;
  },

  /**
   * Get a single ticket by ID
   * @param ticketId string
   * @returns Promise<SupportTicket>
   */
  getTicket: async (ticketId: string): Promise<SupportTicket> => {
    const response = await axios.get(`${API_URL}/support/tickets/${ticketId}`);
    return response.data;
  },

  /**
   * Create a new support ticket
   * @param ticket Partial<SupportTicket>
   * @returns Promise<SupportTicket>
   */
  createTicket: async (ticket: Partial<SupportTicket>): Promise<SupportTicket> => {
    const response = await axios.post(`${API_URL}/support/tickets`, ticket);
    return response.data;
  },

  /**
   * Update a support ticket
   * @param ticketId string
   * @param update TicketUpdate
   * @returns Promise<SupportTicket>
   */
  updateTicket: async (ticketId: string, update: TicketUpdate): Promise<SupportTicket> => {
    const response = await axios.patch(`${API_URL}/support/tickets/${ticketId}`, update);
    return response.data;
  },

  /**
   * Add a message to a ticket
   * @param ticketId string
   * @param message NewTicketMessage
   * @returns Promise<SupportTicket>
   */
  addMessage: async (ticketId: string, message: NewTicketMessage): Promise<SupportTicket> => {
    const formData = new FormData();
    formData.append('message', message.message);
    if (message.attachments) {
      message.attachments.forEach(file => {
        formData.append('attachments', file);
      });
    }
    const response = await axios.post(`${API_URL}/support/tickets/${ticketId}/messages`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Get ticket statistics
   * @returns Promise<TicketStats>
   */
  getTicketStats: async (): Promise<TicketStats> => {
    const response = await axios.get(`${API_URL}/support/tickets/stats`);
    return response.data;
  },

  /**
   * Close a support ticket
   * @param ticketId string
   * @returns Promise<void>
   */
  closeTicket: async (ticketId: string): Promise<void> => {
    await axios.post(`${API_URL}/support/tickets/${ticketId}/close`);
  },

  /**
   * Reopen a closed support ticket
   * @param ticketId string
   * @returns Promise<SupportTicket>
   */
  reopenTicket: async (ticketId: string): Promise<SupportTicket> => {
    const response = await axios.post(`${API_URL}/support/tickets/${ticketId}/reopen`);
    return response.data;
  },
}; 