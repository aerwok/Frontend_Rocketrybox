import api from './index';
import { ApiResponse } from '@/types/api';

/**
 * Tracking Types
 */
export interface TrackingEvent {
    id: string;
    status: TrackingStatus;
    location: string;
    description: string;
    timestamp: string;
}

export interface TrackingInfo {
    id: string;
    awbNumber: string;
    status: TrackingStatus;
    currentLocation: string;
    estimatedDelivery?: string;
    events: TrackingEvent[];
    createdAt: string;
    updatedAt: string;
}

export enum TrackingStatus {
    PICKUP_SCHEDULED = 'pickup_scheduled',
    PICKED_UP = 'picked_up',
    IN_TRANSIT = 'in_transit',
    OUT_FOR_DELIVERY = 'out_for_delivery',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
    EXCEPTION = 'exception'
}

/**
 * Tracking API Service
 * Handles all tracking-related API calls
 */
export const trackingApi = {
    /**
     * Get tracking information by AWB number
     * @param {string} awbNumber - AWB number to track
     * @returns {Promise<ApiResponse<TrackingInfo>>} Tracking information
     */
    getTrackingInfo: (awbNumber: string): Promise<ApiResponse<TrackingInfo>> => {
        return api.get(`/customer/tracking/${awbNumber}`);
    },

    /**
     * Get tracking information by order ID
     * @param {string} orderId - Order ID to track
     * @returns {Promise<ApiResponse<TrackingInfo>>} Tracking information
     */
    getTrackingByOrderId: (orderId: string): Promise<ApiResponse<TrackingInfo>> => {
        return api.get(`/customer/orders/${orderId}/tracking`);
    },

    /**
     * Subscribe to tracking updates
     * @param {string} awbNumber - AWB number to subscribe to
     * @param {string} email - Email for notifications
     * @returns {Promise<ApiResponse<void>>} Empty response
     */
    subscribeToUpdates: (awbNumber: string, email: string): Promise<ApiResponse<void>> => {
        return api.post(`/customer/tracking/${awbNumber}/subscribe`, { email });
    },

    /**
     * Unsubscribe from tracking updates
     * @param {string} awbNumber - AWB number to unsubscribe from
     * @returns {Promise<ApiResponse<void>>} Empty response
     */
    unsubscribeFromUpdates: (awbNumber: string): Promise<ApiResponse<void>> => {
        return api.post(`/customer/tracking/${awbNumber}/unsubscribe`);
    }
}; 