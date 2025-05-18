import { useState, useEffect } from 'react';
import { shippingApi } from '@/services/api/shipping';
import { calculateShippingRate, determineZone } from '@/lib/shipping-calculator';

interface ShippingRate {
    mode: string;
    courier: string;
    baseCharge: number;
    additionalWeightCharge: number;
    codCharge: number;
    gst: number;
    total: number;
    gstPercentage: number;
}

interface UseShippingRatesProps {
    warehousePincode: string;
    destinationPincode: string;
    weight: number;
    isCOD: boolean;
}

interface UseShippingRatesReturn {
    rates: ShippingRate[];
    currentZone: string;
    isLoading: boolean;
    error: string | null;
    refreshRates: () => Promise<void>;
}

/**
 * Custom hook for managing shipping rates
 * 
 * This hook handles:
 * - Fetching shipping rates from API
 * - Calculating zone and charges
 * - Managing loading and error states
 * - Refreshing rate calculations
 * 
 * @param {UseShippingRatesProps} props - Hook configuration
 * @returns {UseShippingRatesReturn} Shipping rates state and methods
 */
export const useShippingRates = ({
    warehousePincode,
    destinationPincode,
    weight,
    isCOD,
}: UseShippingRatesProps): UseShippingRatesReturn => {
    const [rates, setRates] = useState<ShippingRate[]>([]);
    const [currentZone, setCurrentZone] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Calculate shipping rates based on provided parameters
     */
    const calculateRates = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Determine zone
            const zone = determineZone(warehousePincode, destinationPincode);
            setCurrentZone(zone);

            // Fetch rate cards from API
            const rateCards = await shippingApi.getRateCards();

            // Calculate rates for each courier
            const calculatedRates = await Promise.all(
                rateCards.map(async (rateCard) => {
                    try {
                        const rates = await calculateShippingRate(
                            warehousePincode,
                            destinationPincode,
                            weight,
                            rateCard.mode,
                            isCOD,
                            rateCards
                        );

                        return {
                            mode: rateCard.mode,
                            courier: rateCard.mode.split(" ")[0],
                            baseCharge: rates.baseCharge,
                            additionalWeightCharge: rates.additionalWeightCharge,
                            codCharge: isCOD ? rates.codCharge : 0,
                            gst: rates.gst,
                            total: rates.total,
                            gstPercentage: rates.gstPercentage,
                        };
                    } catch (error) {
                        console.error(`Error calculating rates for ${rateCard.mode}:`, error);
                        return null;
                    }
                })
            );

            // Filter out failed calculations
            const validRates = calculatedRates.filter((rate): rate is ShippingRate => rate !== null);
            setRates(validRates);
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Failed to calculate shipping rates');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Refresh shipping rates
     */
    const refreshRates = async () => {
        await calculateRates();
    };

    // Calculate rates when dependencies change
    useEffect(() => {
        calculateRates();
    }, [warehousePincode, destinationPincode, weight, isCOD]);

    return {
        rates,
        currentZone,
        isLoading,
        error,
        refreshRates,
    };
}; 