import { useState, useEffect } from 'react';
import { adminApi } from '../services/api/admin';

export interface CourierRate {
    courier: string;
    displayName: string;
    deliveryTime: string;
    isExpress: boolean;
    price: number;
    mode?: string;
    cod?: string;
    shipping?: number;
    gst?: number;
    total?: number;
}

interface UseShippingOptionsReturn {
    courierOptions: CourierRate[];
    loading: boolean;
    error: string | null;
    selectedCourier: string;
    selectedMode: string;
    setSelectedCourier: (courier: string) => void;
    setSelectedMode: (mode: string) => void;
    refetch: () => Promise<void>;
}

/**
 * Custom hook for managing shipping options
 * 
 * This hook handles:
 * - Fetching available courier options
 * - Managing selected courier and shipping mode
 * - Loading and error states
 * - API integration for shipping data
 * 
 * @param {boolean} isSellerTab - Whether to fetch seller-specific shipping options
 * @returns {UseShippingOptionsReturn} Object containing shipping options and states
 */
export const useShippingOptions = (isSellerTab: boolean): UseShippingOptionsReturn => {
    const [courierOptions, setCourierOptions] = useState<CourierRate[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCourier, setSelectedCourier] = useState<string>("");
    const [selectedMode, setSelectedMode] = useState<string>("");

    const fetchShippingOptions = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // TODO: Replace with actual API call when endpoint is ready
            // const response = await adminApi.getShippingOptions(isSellerTab);
            // setCourierOptions(response.data);
            
            // For now, set empty array until API is ready
            setCourierOptions([]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load shipping options');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShippingOptions();
    }, [isSellerTab]);

    return {
        courierOptions,
        loading,
        error,
        selectedCourier,
        selectedMode,
        setSelectedCourier,
        setSelectedMode,
        refetch: fetchShippingOptions,
    };
}; 