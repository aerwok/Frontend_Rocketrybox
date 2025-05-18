import api from './index';
import { ApiResponse } from '@/types/api';

export interface FeaturedProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    rating: number;
    reviewCount: number;
}

export interface Category {
    id: string;
    name: string;
    description: string;
    image: string;
    productCount: number;
}

export interface Promotion {
    id: string;
    title: string;
    description: string;
    image: string;
    startDate: string;
    endDate: string;
    discountPercentage?: number;
    discountAmount?: number;
}

export interface HomeData {
    featuredProducts: FeaturedProduct[];
    categories: Category[];
    promotions: Promotion[];
    stats: {
        totalOrders: number;
        totalProducts: number;
        totalCategories: number;
    };
}

/**
 * Home API Service
 * Handles all home page-related API calls
 */
export const homeApi = {
    /**
     * Get home page data
     * @returns {Promise<ApiResponse<HomeData>>} Home page data
     */
    getHomeData: (): Promise<ApiResponse<HomeData>> => {
        return api.get('/customer/home');
    },

    /**
     * Get featured products
     * @param {number} limit - Number of products to fetch
     * @returns {Promise<ApiResponse<FeaturedProduct[]>>} Featured products
     */
    getFeaturedProducts: (limit: number = 6): Promise<ApiResponse<FeaturedProduct[]>> => {
        return api.get('/customer/home/featured-products', {
            params: { limit },
        });
    },

    /**
     * Get categories
     * @returns {Promise<ApiResponse<Category[]>>} Categories
     */
    getCategories: (): Promise<ApiResponse<Category[]>> => {
        return api.get('/customer/home/categories');
    },

    /**
     * Get active promotions
     * @returns {Promise<ApiResponse<Promotion[]>>} Active promotions
     */
    getPromotions: (): Promise<ApiResponse<Promotion[]>> => {
        return api.get('/customer/home/promotions');
    },

    /**
     * Get home page stats
     * @returns {Promise<ApiResponse<{ totalOrders: number; totalProducts: number; totalCategories: number }>>} Home page stats
     */
    getStats: (): Promise<ApiResponse<{ totalOrders: number; totalProducts: number; totalCategories: number }>> => {
        return api.get('/customer/home/stats');
    },
}; 