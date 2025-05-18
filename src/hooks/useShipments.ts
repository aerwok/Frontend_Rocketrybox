import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { shipmentApi } from '@/services/api/shipment';
import { Shipment, ShipmentFilters, ShipmentStats, ShipmentUpdate } from '@/types/shipment';

/**
 * Hook for managing shipments list with pagination and filters
 */
export const useShipments = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ShipmentFilters>({
    page: 1,
    limit: 10,
    status: undefined,
    type: undefined,
    search: undefined,
    startDate: undefined,
    endDate: undefined,
  });

  const fetchShipments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await shipmentApi.getShipments(filters);
      setShipments(response.shipments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch shipments');
      toast.error('Failed to fetch shipments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, [filters]);

  const updateFilters = (newFilters: Partial<ShipmentFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return {
    shipments,
    loading,
    error,
    filters,
    updateFilters,
    refetch: fetchShipments,
  };
};

/**
 * Hook for managing a single shipment
 */
export const useShipment = (shipmentId: string) => {
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchShipment = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await shipmentApi.getShipment(shipmentId);
      setShipment(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch shipment');
      toast.error('Failed to fetch shipment');
    } finally {
      setLoading(false);
    }
  };

  const updateShipment = async (update: ShipmentUpdate) => {
    try {
      setLoading(true);
      const updated = await shipmentApi.updateShipment(shipmentId, update);
      setShipment(updated);
      toast.success('Shipment updated successfully');
    } catch (err) {
      toast.error('Failed to update shipment');
    } finally {
      setLoading(false);
    }
  };

  const cancelShipment = async () => {
    try {
      setLoading(true);
      await shipmentApi.cancelShipment(shipmentId);
      await fetchShipment();
      toast.success('Shipment cancelled successfully');
    } catch (err) {
      toast.error('Failed to cancel shipment');
    } finally {
      setLoading(false);
    }
  };

  const generateLabel = async () => {
    try {
      setLoading(true);
      const blob = await shipmentApi.generateLabel(shipmentId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shipping-label-${shipmentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Shipping label downloaded successfully');
    } catch (err) {
      toast.error('Failed to generate shipping label');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shipmentId) {
      fetchShipment();
    }
  }, [shipmentId]);

  return {
    shipment,
    loading,
    error,
    updateShipment,
    cancelShipment,
    generateLabel,
    refetch: fetchShipment,
  };
};

/**
 * Hook for managing shipment creation
 */
export const useShipmentCreation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createShipment = async (shipment: Partial<Shipment>) => {
    try {
      setLoading(true);
      setError(null);
      const created = await shipmentApi.createShipment(shipment);
      toast.success('Shipment created successfully');
      return created;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create shipment');
      toast.error('Failed to create shipment');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createShipment,
  };
};

/**
 * Hook for managing shipment statistics
 */
export const useShipmentStats = () => {
  const [stats, setStats] = useState<ShipmentStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await shipmentApi.getShipmentStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch shipment statistics');
      toast.error('Failed to fetch shipment statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};

/**
 * Hook for tracking a shipment
 */
export const useShipmentTracking = () => {
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trackShipment = async (trackingNumber: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await shipmentApi.trackShipment(trackingNumber);
      setShipment(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to track shipment');
      toast.error('Failed to track shipment');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    shipment,
    loading,
    error,
    trackShipment,
  };
}; 