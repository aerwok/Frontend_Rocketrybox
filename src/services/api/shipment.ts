import axios from 'axios';
import { Shipment, ShipmentFilters, ShipmentResponse, ShipmentStats, ShipmentUpdate } from '@/types/shipment';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

/**
 * Shipment API Service
 * Handles all shipment-related API calls
 */
export const shipmentApi = {
  /**
   * Get all shipments with optional filters
   * @param filters ShipmentFilters
   * @returns Promise<ShipmentResponse>
   */
  getShipments: async (filters?: ShipmentFilters): Promise<ShipmentResponse> => {
    const response = await axios.get(`${API_URL}/shipments`, { params: filters });
    return response.data;
  },

  /**
   * Get a single shipment by ID
   * @param shipmentId string
   * @returns Promise<Shipment>
   */
  getShipment: async (shipmentId: string): Promise<Shipment> => {
    const response = await axios.get(`${API_URL}/shipments/${shipmentId}`);
    return response.data;
  },

  /**
   * Create a new shipment
   * @param shipment Partial<Shipment>
   * @returns Promise<Shipment>
   */
  createShipment: async (shipment: Partial<Shipment>): Promise<Shipment> => {
    const response = await axios.post(`${API_URL}/shipments`, shipment);
    return response.data;
  },

  /**
   * Update a shipment
   * @param shipmentId string
   * @param update ShipmentUpdate
   * @returns Promise<Shipment>
   */
  updateShipment: async (shipmentId: string, update: ShipmentUpdate): Promise<Shipment> => {
    const response = await axios.patch(`${API_URL}/shipments/${shipmentId}`, update);
    return response.data;
  },

  /**
   * Cancel a shipment
   * @param shipmentId string
   * @returns Promise<void>
   */
  cancelShipment: async (shipmentId: string): Promise<void> => {
    await axios.post(`${API_URL}/shipments/${shipmentId}/cancel`);
  },

  /**
   * Get shipment statistics
   * @returns Promise<ShipmentStats>
   */
  getShipmentStats: async (): Promise<ShipmentStats> => {
    const response = await axios.get(`${API_URL}/shipments/stats`);
    return response.data;
  },

  /**
   * Generate shipping label
   * @param shipmentId string
   * @returns Promise<Blob>
   */
  generateLabel: async (shipmentId: string): Promise<Blob> => {
    const response = await axios.get(`${API_URL}/shipments/${shipmentId}/label`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Track a shipment
   * @param trackingNumber string
   * @returns Promise<Shipment>
   */
  trackShipment: async (trackingNumber: string): Promise<Shipment> => {
    const response = await axios.get(`${API_URL}/shipments/track/${trackingNumber}`);
    return response.data;
  },
}; 