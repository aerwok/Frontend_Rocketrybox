import { useState, useCallback, useEffect } from 'react';
import { featuresApi, Feature, FeatureCategory, FeatureToggle } from '@/services/api/features';

interface UseFeaturesReturn {
    // Features
    features: Feature[];
    feature: Feature | null;
    isLoadingFeatures: boolean;
    featuresError: string | null;
    fetchFeatures: () => Promise<void>;
    fetchFeature: (id: string) => Promise<void>;
    createFeature: (data: Omit<Feature, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateFeature: (id: string, data: Partial<Feature>) => Promise<void>;
    deleteFeature: (id: string) => Promise<void>;

    // Categories
    categories: FeatureCategory[];
    isLoadingCategories: boolean;
    categoriesError: string | null;
    fetchCategories: () => Promise<void>;

    // Toggle history
    toggleHistory: FeatureToggle[];
    isLoadingHistory: boolean;
    historyError: string | null;
    fetchToggleHistory: (id: string) => Promise<void>;
    toggleFeature: (id: string, isEnabled: boolean, reason?: string) => Promise<void>;
}

/**
 * useFeatures Hook
 * 
 * Manages feature flag state and operations:
 * - Feature CRUD operations
 * - Category management
 * - Feature toggle history
 * - Loading and error states
 * 
 * @returns {UseFeaturesReturn} Feature state and operations
 */
export const useFeatures = (): UseFeaturesReturn => {
    // Features state
    const [features, setFeatures] = useState<Feature[]>([]);
    const [feature, setFeature] = useState<Feature | null>(null);
    const [isLoadingFeatures, setIsLoadingFeatures] = useState(false);
    const [featuresError, setFeaturesError] = useState<string | null>(null);

    // Categories state
    const [categories, setCategories] = useState<FeatureCategory[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [categoriesError, setCategoriesError] = useState<string | null>(null);

    // Toggle history state
    const [toggleHistory, setToggleHistory] = useState<FeatureToggle[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [historyError, setHistoryError] = useState<string | null>(null);

    /**
     * Fetch all features
     */
    const fetchFeatures = useCallback(async () => {
        try {
            setIsLoadingFeatures(true);
            setFeaturesError(null);
            const response = await featuresApi.getFeatures();
            setFeatures(response.data);
        } catch (err) {
            setFeaturesError(err instanceof Error ? err.message : 'Failed to fetch features');
            throw err;
        } finally {
            setIsLoadingFeatures(false);
        }
    }, []);

    /**
     * Fetch feature by ID
     * @param {string} id - Feature ID
     */
    const fetchFeature = useCallback(async (id: string) => {
        try {
            setIsLoadingFeatures(true);
            setFeaturesError(null);
            const response = await featuresApi.getFeature(id);
            setFeature(response.data);
        } catch (err) {
            setFeaturesError(err instanceof Error ? err.message : 'Failed to fetch feature');
            throw err;
        } finally {
            setIsLoadingFeatures(false);
        }
    }, []);

    /**
     * Create new feature
     * @param {Omit<Feature, 'id' | 'createdAt' | 'updatedAt'>} data - Feature data
     */
    const createFeature = useCallback(async (data: Omit<Feature, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            setIsLoadingFeatures(true);
            setFeaturesError(null);
            const response = await featuresApi.createFeature(data);
            setFeatures(prev => [...prev, response.data]);
        } catch (err) {
            setFeaturesError(err instanceof Error ? err.message : 'Failed to create feature');
            throw err;
        } finally {
            setIsLoadingFeatures(false);
        }
    }, []);

    /**
     * Update feature
     * @param {string} id - Feature ID
     * @param {Partial<Feature>} data - Updated feature data
     */
    const updateFeature = useCallback(async (id: string, data: Partial<Feature>) => {
        try {
            setIsLoadingFeatures(true);
            setFeaturesError(null);
            const response = await featuresApi.updateFeature(id, data);
            setFeatures(prev => prev.map(f => f.id === id ? response.data : f));
            if (feature?.id === id) {
                setFeature(response.data);
            }
        } catch (err) {
            setFeaturesError(err instanceof Error ? err.message : 'Failed to update feature');
            throw err;
        } finally {
            setIsLoadingFeatures(false);
        }
    }, [feature]);

    /**
     * Delete feature
     * @param {string} id - Feature ID
     */
    const deleteFeature = useCallback(async (id: string) => {
        try {
            setIsLoadingFeatures(true);
            setFeaturesError(null);
            await featuresApi.deleteFeature(id);
            setFeatures(prev => prev.filter(f => f.id !== id));
            if (feature?.id === id) {
                setFeature(null);
            }
        } catch (err) {
            setFeaturesError(err instanceof Error ? err.message : 'Failed to delete feature');
            throw err;
        } finally {
            setIsLoadingFeatures(false);
        }
    }, [feature]);

    /**
     * Fetch all categories
     */
    const fetchCategories = useCallback(async () => {
        try {
            setIsLoadingCategories(true);
            setCategoriesError(null);
            const response = await featuresApi.getCategories();
            setCategories(response.data);
        } catch (err) {
            setCategoriesError(err instanceof Error ? err.message : 'Failed to fetch categories');
            throw err;
        } finally {
            setIsLoadingCategories(false);
        }
    }, []);

    /**
     * Fetch feature toggle history
     * @param {string} id - Feature ID
     */
    const fetchToggleHistory = useCallback(async (id: string) => {
        try {
            setIsLoadingHistory(true);
            setHistoryError(null);
            const response = await featuresApi.getToggleHistory(id);
            setToggleHistory(response.data);
        } catch (err) {
            setHistoryError(err instanceof Error ? err.message : 'Failed to fetch toggle history');
            throw err;
        } finally {
            setIsLoadingHistory(false);
        }
    }, []);

    /**
     * Toggle feature state
     * @param {string} id - Feature ID
     * @param {boolean} isEnabled - New feature state
     * @param {string} [reason] - Reason for toggle
     */
    const toggleFeature = useCallback(async (id: string, isEnabled: boolean, reason?: string) => {
        try {
            setIsLoadingFeatures(true);
            setFeaturesError(null);
            const response = await featuresApi.toggleFeature(id, isEnabled, reason);
            setFeatures(prev => prev.map(f => f.id === id ? { ...f, isEnabled } : f));
            if (feature?.id === id) {
                setFeature(prev => prev ? { ...prev, isEnabled } : null);
            }
            // Refresh toggle history
            await fetchToggleHistory(id);
        } catch (err) {
            setFeaturesError(err instanceof Error ? err.message : 'Failed to toggle feature');
            throw err;
        } finally {
            setIsLoadingFeatures(false);
        }
    }, [feature, fetchToggleHistory]);

    // Initial data fetch
    useEffect(() => {
        fetchFeatures();
        fetchCategories();
    }, [fetchFeatures, fetchCategories]);

    return {
        // Features
        features,
        feature,
        isLoadingFeatures,
        featuresError,
        fetchFeatures,
        fetchFeature,
        createFeature,
        updateFeature,
        deleteFeature,

        // Categories
        categories,
        isLoadingCategories,
        categoriesError,
        fetchCategories,

        // Toggle History
        toggleHistory,
        isLoadingHistory,
        historyError,
        fetchToggleHistory,
        toggleFeature,
    };
}; 