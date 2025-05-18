import { useState, useCallback } from 'react';
import { adminApi } from '@/services/api/admin';

export interface Activity {
    id: string;
    type: string;
    description: string;
    timestamp: string;
    userId: string;
    metadata?: Record<string, unknown>;
}

interface UseAdminActivityReturn {
    activities: Activity[];
    isLoading: boolean;
    error: string | null;
    fetchActivities: () => Promise<void>;
    logActivity: (type: string, description: string, metadata?: Record<string, unknown>) => Promise<void>;
}

/**
 * useAdminActivity Hook
 * 
 * Manages admin activity tracking:
 * - Fetch activity history
 * - Log new activities
 * - Loading and error states
 * 
 * @returns {UseAdminActivityReturn} Activity state and operations
 */
export const useAdminActivity = (): UseAdminActivityReturn => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch activity history
     */
    const fetchActivities = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await adminApi.getStats();
            // Map API response to match Activity interface
            const mappedActivities: Activity[] = data.recentActivity.map(activity => ({
                id: activity.id,
                type: activity.type,
                description: activity.description,
                timestamp: activity.timestamp,
                userId: 'system', // Default to system for historical activities
            }));
            setActivities(mappedActivities);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch activities');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Log new activity
     * @param {string} type - Activity type
     * @param {string} description - Activity description
     * @param {Record<string, unknown>} [metadata] - Additional activity metadata
     */
    const logActivity = useCallback(async (
        type: string,
        description: string,
        metadata?: Record<string, unknown>
    ) => {
        try {
            setIsLoading(true);
            setError(null);
            // TODO: Replace with actual API endpoint when ready
            // const activity = await adminApi.logActivity({ type, description, metadata });
            // setActivities(prev => [activity, ...prev]);
            
            // Temporary mock implementation
            const activity: Activity = {
                id: Date.now().toString(),
                type,
                description,
                timestamp: new Date().toISOString(),
                userId: 'current-user-id',
                metadata,
            };
            setActivities(prev => [activity, ...prev]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to log activity');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        activities,
        isLoading,
        error,
        fetchActivities,
        logActivity,
    };
}; 