import api from './index';
import { ApiResponse } from '@/types/api';

/**
 * Service Types
 */
export interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number; // in minutes
    category: ServiceCategory;
    image?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ServiceCategory {
    id: string;
    name: string;
    description: string;
    image?: string;
}

export interface ServiceBooking {
    id: string;
    serviceId: string;
    customerId: string;
    status: BookingStatus;
    scheduledDate: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export enum BookingStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

export interface CreateBookingData {
    serviceId: string;
    scheduledDate: string;
    notes?: string;
}

/**
 * Services API Service
 * Handles all service-related API calls
 */
export const servicesApi = {
    /**
     * Get all services
     * @param {string} categoryId - Optional category filter
     * @returns {Promise<ApiResponse<Service[]>>} List of services
     */
    getServices: (categoryId?: string): Promise<ApiResponse<Service[]>> => {
        return api.get('/customer/services', {
            params: { categoryId }
        });
    },

    /**
     * Get service by ID
     * @param {string} id - Service ID
     * @returns {Promise<ApiResponse<Service>>} Service details
     */
    getService: (id: string): Promise<ApiResponse<Service>> => {
        return api.get(`/customer/services/${id}`);
    },

    /**
     * Get all service categories
     * @returns {Promise<ApiResponse<ServiceCategory[]>>} List of categories
     */
    getCategories: (): Promise<ApiResponse<ServiceCategory[]>> => {
        return api.get('/customer/service-categories');
    },

    /**
     * Get category by ID
     * @param {string} id - Category ID
     * @returns {Promise<ApiResponse<ServiceCategory>>} Category details
     */
    getCategory: (id: string): Promise<ApiResponse<ServiceCategory>> => {
        return api.get(`/customer/service-categories/${id}`);
    },

    /**
     * Create a service booking
     * @param {CreateBookingData} data - Booking data
     * @returns {Promise<ApiResponse<ServiceBooking>>} Created booking
     */
    createBooking: (data: CreateBookingData): Promise<ApiResponse<ServiceBooking>> => {
        return api.post('/customer/service-bookings', data);
    },

    /**
     * Get user's service bookings
     * @param {number} page - Page number
     * @param {number} limit - Items per page
     * @returns {Promise<ApiResponse<{ items: ServiceBooking[]; total: number }>>} Bookings with pagination
     */
    getBookings: (
        page: number = 1,
        limit: number = 10
    ): Promise<ApiResponse<{ items: ServiceBooking[]; total: number }>> => {
        return api.get('/customer/service-bookings', {
            params: { page, limit }
        });
    },

    /**
     * Cancel a service booking
     * @param {string} id - Booking ID
     * @returns {Promise<ApiResponse<void>>} Empty response
     */
    cancelBooking: (id: string): Promise<ApiResponse<void>> => {
        return api.post(`/customer/service-bookings/${id}/cancel`);
    }
}; 