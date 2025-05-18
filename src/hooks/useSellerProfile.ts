import { useState, useEffect } from 'react';
import { sellerApi } from '@/services/api/seller';

interface SellerProfile {
    id: string;
    name: string;
    logo?: string;
    status: 'active' | 'inactive' | 'suspended';
}

interface UseSellerProfileReturn {
    profile: SellerProfile | null;
    isLoading: boolean;
    error: string | null;
    refreshProfile: () => Promise<void>;
}

/**
 * Custom hook for managing seller profile data
 * 
 * This hook handles:
 * - Fetching seller profile information
 * - Managing loading and error states
 * - Refreshing profile data
 * 
 * @returns {UseSellerProfileReturn} Seller profile state and methods
 */
export const useSellerProfile = (): UseSellerProfileReturn => {
    const [profile, setProfile] = useState<SellerProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch seller profile data
     */
    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await sellerApi.getProfile();
            setProfile(response.data);
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Failed to fetch seller profile');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Refresh profile data
     */
    const refreshProfile = async () => {
        await fetchProfile();
    };

    // Fetch profile on mount
    useEffect(() => {
        fetchProfile();
    }, []);

    return {
        profile,
        isLoading,
        error,
        refreshProfile,
    };
}; 