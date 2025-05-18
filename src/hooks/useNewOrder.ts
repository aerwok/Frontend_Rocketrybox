import { useState, useEffect, useCallback } from 'react';
import { newOrderApi } from '../services/api/newOrder';

/**
 * Hook to fetch available shipping rates for a new order.
 * Manages loading, error, and rates state.
 * Call fetchRates with the required params to trigger the API call.
 */
export function useFetchRates() {
  const [rates, setRates] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = useCallback(async (params: any) => {
    setIsLoading(true);
    setError(null);
    try {
      // Connect to backend endpoint when available
      const data = await newOrderApi.fetchRates(params);
      setRates(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch rates');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { rates, isLoading, error, fetchRates };
}

/**
 * Hook to create a new order.
 * Manages loading, error, and success state.
 * Call createOrder with the order payload to trigger the API call.
 */
export function useCreateOrder() {
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createOrder = useCallback(async (data: any) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      // Connect to backend endpoint when available
      const result = await newOrderApi.createOrder(data);
      setOrder(result);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to create order');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { order, isLoading, error, success, createOrder };
}

/**
 * Hook to fetch available couriers/services for a new order.
 * Fetches on mount by default.
 */
export function useFetchCouriers() {
  const [couriers, setCouriers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCouriers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Connect to backend endpoint when available
      const data = await newOrderApi.fetchCouriers();
      setCouriers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch couriers');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCouriers();
  }, [fetchCouriers]);

  return { couriers, isLoading, error, refetch: fetchCouriers };
}

/**
 * Hook to fetch a single order by ID (for editing/viewing after creation).
 * Fetches when orderId changes.
 */
export function useFetchOrderById(orderId: string | null) {
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    setIsLoading(true);
    setError(null);
    newOrderApi.fetchOrderById(orderId)
      .then(data => setOrder(data))
      .catch(err => setError(err.message || 'Failed to fetch order'))
      .finally(() => setIsLoading(false));
  }, [orderId]);

  return { order, isLoading, error };
} 