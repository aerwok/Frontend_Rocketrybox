import { useState, useCallback } from 'react';
import { featuresApi, Feature, FeatureToggle } from '@/services/api/features';

interface UseFeatureToggleReturn {
    feature: Feature | null;
    isLoading: boolean;
    error: string | null;
    toggleHistory: FeatureToggle[];
    isLoadingHistory: boolean;
    historyError: string | null;
    fetchFeature: (id: string) => Promise<void>;
    toggleFeature: (isEnabled: boolean, reason?: string) => Promise<void>;
    fetchToggleHistory: () => Promise<void>;
}

/**
 * useFeatureToggle Hook
 * 
 * Manages individual feature toggle state and operations:
 * - Feature details
 * - Toggle state
 * - Toggle history
 * - Loading and error states
 * 
 * @param {string} featureId - ID of the feature to manage
 * @returns {UseFeatureToggleReturn} Feature toggle state and operations
 */
export const useFeatureToggle = (featureId: string): UseFeatureToggleReturn => {
    const [feature, setFeature] = useState<Feature | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toggleHistory, setToggleHistory] = useState<FeatureToggle[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [historyError, setHistoryError] = useState<string | null>(null);

    /**
     * Fetch feature details
     */
    const fetchFeature = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await featuresApi.getFeature(featureId);
            setFeature(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch feature');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [featureId]);

    /**
     * Toggle feature state
     * @param {boolean} isEnabled - New feature state
     * @param {string} [reason] - Reason for toggle
     */
    const toggleFeature = useCallback(async (isEnabled: boolean, reason?: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await featuresApi.toggleFeature(featureId, isEnabled, reason);
            setFeature(prev => prev ? { ...prev, isEnabled } : null);
            // Refresh toggle history
            await fetchToggleHistory();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to toggle feature');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [featureId]);

    /**
     * Fetch feature toggle history
     */
    const fetchToggleHistory = useCallback(async () => {
        try {
            setIsLoadingHistory(true);
            setHistoryError(null);
            const response = await featuresApi.getToggleHistory(featureId);
            setToggleHistory(response.data);
        } catch (err) {
            setHistoryError(err instanceof Error ? err.message : 'Failed to fetch toggle history');
            throw err;
        } finally {
            setIsLoadingHistory(false);
        }
    }, [featureId]);

    return {
        feature,
        isLoading,
        error,
        toggleHistory,
        isLoadingHistory,
        historyError,
        fetchFeature,
        toggleFeature,
        fetchToggleHistory,
    };
}; 