import { useState } from 'react';
import { useWarehouses, useWarehouseStats } from '@/hooks/useWarehouses';
import { WarehouseStatus } from '@/types/warehouse';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { formatDate } from '@/lib/utils';

/**
 * Warehouse Page Component
 * Displays a list of warehouses with filtering and search capabilities
 */
export default function WarehousePage() {
  const { warehouses, loading, error, filters, updateFilters } = useWarehouses();
  const { stats, loading: statsLoading } = useWarehouseStats();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchQuery });
  };

  const handleStatusChange = (status: WarehouseStatus | '') => {
    updateFilters({ status: status || undefined });
  };

  const handleCountryChange = (country: string) => {
    updateFilters({ country: country || undefined });
  };

  const handleStateChange = (state: string) => {
    updateFilters({ state: state || undefined });
  };

  if (loading || statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Warehouses</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Warehouses</h3>
          <p className="text-2xl font-bold">{stats?.total || 0}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Active Warehouses</h3>
          <p className="text-2xl font-bold">{stats?.byStatus?.active || 0}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Capacity</h3>
          <p className="text-2xl font-bold">{stats?.totalCapacity || 0}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Used Capacity</h3>
          <p className="text-2xl font-bold">{stats?.usedCapacity || 0}</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <Input
            type="text"
            placeholder="Search warehouses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Select
            value={filters.status || ''}
            onChange={(e) => handleStatusChange(e.target.value as WarehouseStatus)}
            className="w-full md:w-40"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
          </Select>
          <Select
            value={filters.country || ''}
            onChange={(e) => handleCountryChange(e.target.value)}
            className="w-full md:w-40"
          >
            <option value="">All Countries</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="UK">United Kingdom</option>
          </Select>
          <Select
            value={filters.state || ''}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full md:w-40"
          >
            <option value="">All States</option>
            <option value="CA">California</option>
            <option value="NY">New York</option>
            <option value="TX">Texas</option>
          </Select>
          <Button type="submit">Search</Button>
        </form>
      </div>

      {/* Warehouses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {warehouses.map((warehouse) => (
          <Card key={warehouse.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold">{warehouse.name}</h3>
                <p className="text-sm text-gray-500">
                  {warehouse.address.city}, {warehouse.address.state}
                </p>
              </div>
              <Badge
                className={
                  warehouse.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : warehouse.status === 'maintenance'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }
              >
                {warehouse.status}
              </Badge>
            </div>
            <div className="space-y-2 mb-4">
              <p className="text-sm">
                <span className="font-medium">Capacity:</span>{' '}
                {warehouse.capacity.used} / {warehouse.capacity.total}
              </p>
              <p className="text-sm">
                <span className="font-medium">Contact:</span>{' '}
                {warehouse.contact.name}
              </p>
              <p className="text-sm">
                <span className="font-medium">Hours:</span>{' '}
                {warehouse.operatingHours.open} - {warehouse.operatingHours.close}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Added {formatDate(warehouse.createdAt)}
              </span>
              <Button
                variant="outline"
                onClick={() => window.location.href = `/seller/dashboard/warehouse/${warehouse.id}`}
              >
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 