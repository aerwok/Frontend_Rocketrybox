import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { warehouseApi } from '@/services/api/warehouse';
import { Warehouse, WarehouseFilters, WarehouseStats, WarehouseUpdate } from '@/types/warehouse';

/**
 * Hook for managing warehouses list with filters
 */
export const useWarehouses = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<WarehouseFilters>({
    status: undefined,
    search: undefined,
    country: undefined,
    state: undefined,
  });

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await warehouseApi.getWarehouses(filters);
      setWarehouses(response.warehouses);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch warehouses');
      toast.error('Failed to fetch warehouses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, [filters]);

  const updateFilters = (newFilters: Partial<WarehouseFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return {
    warehouses,
    loading,
    error,
    filters,
    updateFilters,
    refetch: fetchWarehouses,
  };
};

/**
 * Hook for managing a single warehouse
 */
export const useWarehouse = (warehouseId: string) => {
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWarehouse = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await warehouseApi.getWarehouse(warehouseId);
      setWarehouse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch warehouse');
      toast.error('Failed to fetch warehouse');
    } finally {
      setLoading(false);
    }
  };

  const updateWarehouse = async (update: WarehouseUpdate) => {
    try {
      setLoading(true);
      const updated = await warehouseApi.updateWarehouse(warehouseId, update);
      setWarehouse(updated);
      toast.success('Warehouse updated successfully');
    } catch (err) {
      toast.error('Failed to update warehouse');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: Warehouse['status']) => {
    try {
      setLoading(true);
      const updated = await warehouseApi.updateWarehouseStatus(warehouseId, status);
      setWarehouse(updated);
      toast.success('Warehouse status updated successfully');
    } catch (err) {
      toast.error('Failed to update warehouse status');
    } finally {
      setLoading(false);
    }
  };

  const deleteWarehouse = async () => {
    try {
      setLoading(true);
      await warehouseApi.deleteWarehouse(warehouseId);
      toast.success('Warehouse deleted successfully');
    } catch (err) {
      toast.error('Failed to delete warehouse');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (warehouseId) {
      fetchWarehouse();
    }
  }, [warehouseId]);

  return {
    warehouse,
    loading,
    error,
    updateWarehouse,
    updateStatus,
    deleteWarehouse,
    refetch: fetchWarehouse,
  };
};

/**
 * Hook for managing warehouse creation
 */
export const useWarehouseCreation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createWarehouse = async (warehouse: Partial<Warehouse>) => {
    try {
      setLoading(true);
      setError(null);
      const created = await warehouseApi.createWarehouse(warehouse);
      toast.success('Warehouse created successfully');
      return created;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create warehouse');
      toast.error('Failed to create warehouse');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createWarehouse,
  };
};

/**
 * Hook for managing warehouse statistics
 */
export const useWarehouseStats = () => {
  const [stats, setStats] = useState<WarehouseStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await warehouseApi.getWarehouseStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch warehouse statistics');
      toast.error('Failed to fetch warehouse statistics');
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