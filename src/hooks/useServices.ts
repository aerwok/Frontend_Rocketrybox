import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { servicesApi, Service, ServiceCategory, ServiceBooking, CreateBookingData } from '@/services/api/services';

interface UseServicesReturn {
    services: Service[];
    categories: ServiceCategory[];
    selectedCategory: ServiceCategory | null;
    isLoading: boolean;
    error: string | null;
    getServices: (categoryId?: string) => Promise<void>;
    getCategories: () => Promise<void>;
    selectCategory: (category: ServiceCategory | null) => void;
}

/**
 * useServices Hook
 * 
 * Manages services data and operations:
 * - Fetch services and categories
 * - Handle category selection
 * - Manage loading and error states
 * 
 * @returns Services state and operations
 */
export const useServices = (): UseServicesReturn => {
    const [services, setServices] = useState<Service[]>([]);
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch services with optional category filter
     */
    const getServices = useCallback(async (categoryId?: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await servicesApi.getServices(categoryId);
            setServices(response.data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch services';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Fetch all service categories
     */
    const getCategories = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await servicesApi.getCategories();
            setCategories(response.data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Select a category and fetch its services
     */
    const selectCategory = useCallback((category: ServiceCategory | null) => {
        setSelectedCategory(category);
        getServices(category?.id);
    }, [getServices]);

    return {
        services,
        categories,
        selectedCategory,
        isLoading,
        error,
        getServices,
        getCategories,
        selectCategory
    };
};

interface UseServiceBookingsReturn {
    bookings: ServiceBooking[];
    totalBookings: number;
    isLoading: boolean;
    error: string | null;
    getBookings: (page?: number, limit?: number) => Promise<void>;
    createBooking: (data: CreateBookingData) => Promise<void>;
    cancelBooking: (id: string) => Promise<void>;
}

/**
 * useServiceBookings Hook
 * 
 * Manages service bookings:
 * - Fetch user's bookings
 * - Create new bookings
 * - Cancel bookings
 * - Handle pagination
 * 
 * @returns Bookings state and operations
 */
export const useServiceBookings = (): UseServiceBookingsReturn => {
    const [bookings, setBookings] = useState<ServiceBooking[]>([]);
    const [totalBookings, setTotalBookings] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch user's bookings with pagination
     */
    const getBookings = useCallback(async (page: number = 1, limit: number = 10) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await servicesApi.getBookings(page, limit);
            setBookings(response.data.items);
            setTotalBookings(response.data.total);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch bookings';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Create a new service booking
     */
    const createBooking = async (data: CreateBookingData) => {
        try {
            setIsLoading(true);
            setError(null);
            await servicesApi.createBooking(data);
            toast.success('Booking created successfully');
            getBookings(); // Refresh bookings list
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create booking';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Cancel a service booking
     */
    const cancelBooking = async (id: string) => {
        try {
            setIsLoading(true);
            setError(null);
            await servicesApi.cancelBooking(id);
            toast.success('Booking cancelled successfully');
            getBookings(); // Refresh bookings list
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to cancel booking';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        bookings,
        totalBookings,
        isLoading,
        error,
        getBookings,
        createBooking,
        cancelBooking
    };
}; 