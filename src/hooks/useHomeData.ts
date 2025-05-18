import { useState, useCallback, useEffect } from 'react';
import { homeApi, HomeData, FeaturedProduct, Category, Promotion } from '@/services/api/home';

interface UseHomeDataReturn {
    // Home data state
    homeData: HomeData | null;
    featuredProducts: FeaturedProduct[];
    categories: Category[];
    promotions: Promotion[];
    stats: {
        totalOrders: number;
        totalProducts: number;
        totalCategories: number;
    } | null;
    isLoading: boolean;
    error: string | null;

    // Home data operations
    fetchHomeData: () => Promise<void>;
    fetchFeaturedProducts: (limit?: number) => Promise<void>;
    fetchCategories: () => Promise<void>;
    fetchPromotions: () => Promise<void>;
    fetchStats: () => Promise<void>;
}

/**
 * useHomeData Hook
 * 
 * Manages home page data state and operations:
 * - Fetch complete home page data
 * - Fetch featured products
 * - Fetch categories
 * - Fetch promotions
 * - Fetch stats
 * - Loading and error states
 * 
 * @returns {UseHomeDataReturn} Home page data state and operations
 */
export const useHomeData = (): UseHomeDataReturn => {
    const [homeData, setHomeData] = useState<HomeData | null>(null);
    const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [stats, setStats] = useState<{
        totalOrders: number;
        totalProducts: number;
        totalCategories: number;
    } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch complete home page data
     */
    const fetchHomeData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await homeApi.getHomeData();
            setHomeData(response.data);
            setFeaturedProducts(response.data.featuredProducts);
            setCategories(response.data.categories);
            setPromotions(response.data.promotions);
            setStats(response.data.stats);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch home data');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Fetch featured products
     * @param {number} limit - Number of products to fetch
     */
    const fetchFeaturedProducts = useCallback(async (limit?: number) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await homeApi.getFeaturedProducts(limit);
            setFeaturedProducts(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch featured products');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Fetch categories
     */
    const fetchCategories = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await homeApi.getCategories();
            setCategories(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch categories');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Fetch promotions
     */
    const fetchPromotions = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await homeApi.getPromotions();
            setPromotions(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch promotions');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Fetch stats
     */
    const fetchStats = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await homeApi.getStats();
            setStats(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch stats');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial fetch of home data
    useEffect(() => {
        fetchHomeData();
    }, [fetchHomeData]);

    return {
        homeData,
        featuredProducts,
        categories,
        promotions,
        stats,
        isLoading,
        error,
        fetchHomeData,
        fetchFeaturedProducts,
        fetchCategories,
        fetchPromotions,
        fetchStats,
    };
}; 