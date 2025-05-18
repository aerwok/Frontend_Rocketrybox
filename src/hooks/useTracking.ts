import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { trackingApi, TrackingInfo, TrackingStatus } from '@/services/api/tracking';

interface UseTrackingReturn {
    trackingInfo: TrackingInfo | null;
    isLoading: boolean;
    error: string | null;
    getTrackingInfo: (awbNumber: string) => Promise<void>;
    getTrackingByOrderId: (orderId: string) => Promise<void>;
    subscribeToUpdates: (awbNumber: string, email: string) => Promise<void>;
    unsubscribeFromUpdates: (awbNumber: string) => Promise<void>;
}

/**
 * useTracking Hook
 * 
 * Manages tracking data and operations:
 * - Fetch tracking information by AWB or order ID
 * - Subscribe/unsubscribe to tracking updates
 * - Handle loading and error states
 * 
 * @returns Tracking state and operations
 */
export const useTracking = (): UseTrackingReturn => {
    const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch tracking information by AWB number
     */
    const getTrackingInfo = useCallback(async (awbNumber: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await trackingApi.getTrackingInfo(awbNumber);
            setTrackingInfo(response.data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tracking information';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Fetch tracking information by order ID
     */
    const getTrackingByOrderId = useCallback(async (orderId: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await trackingApi.getTrackingByOrderId(orderId);
            setTrackingInfo(response.data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tracking information';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Subscribe to tracking updates
     */
    const subscribeToUpdates = async (awbNumber: string, email: string) => {
        try {
            setIsLoading(true);
            setError(null);
            await trackingApi.subscribeToUpdates(awbNumber, email);
            toast.success('Successfully subscribed to tracking updates');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to subscribe to updates';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Unsubscribe from tracking updates
     */
    const unsubscribeFromUpdates = async (awbNumber: string) => {
        try {
            setIsLoading(true);
            setError(null);
            await trackingApi.unsubscribeFromUpdates(awbNumber);
            toast.success('Successfully unsubscribed from tracking updates');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to unsubscribe from updates';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        trackingInfo,
        isLoading,
        error,
        getTrackingInfo,
        getTrackingByOrderId,
        subscribeToUpdates,
        unsubscribeFromUpdates
    };
};

/**
 * Get the color for a tracking status
 * @param status - Tracking status
 * @returns Tailwind color class
 */
export const getStatusColor = (status: TrackingStatus): string => {
    switch (status) {
        case TrackingStatus.DELIVERED:
            return 'bg-green-100 text-green-800';
        case TrackingStatus.IN_TRANSIT:
        case TrackingStatus.OUT_FOR_DELIVERY:
            return 'bg-blue-100 text-blue-800';
        case TrackingStatus.PICKED_UP:
        case TrackingStatus.PICKUP_SCHEDULED:
            return 'bg-yellow-100 text-yellow-800';
        case TrackingStatus.CANCELLED:
            return 'bg-red-100 text-red-800';
        case TrackingStatus.EXCEPTION:
            return 'bg-orange-100 text-orange-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}; 