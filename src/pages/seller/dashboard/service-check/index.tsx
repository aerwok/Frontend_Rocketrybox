import { useState } from 'react';
import { Card, Button, Select, DatePicker, Table, Badge, Spinner, Input } from '@/components/ui';
import { useServiceChecks, useServiceCheckCreation, useServiceCheckStats } from '@/hooks/useServiceCheck';
import { ServiceCheckType, ServiceCheckStatus } from '@/types/service-check';
import { format } from 'date-fns';
import { toast } from "sonner";

const ServiceCheckTypeOptions = [
  { value: 'pincode', label: 'Pincode Check' },
  { value: 'service', label: 'Service Check' },
  { value: 'rate', label: 'Rate Check' },
  { value: 'tracking', label: 'Tracking Check' },
];

const ServiceCheckStatusBadge = ({ status }: { status: ServiceCheckStatus }) => {
  const getStatusColor = (status: ServiceCheckStatus) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'processing':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  return <Badge color={getStatusColor(status)}>{status}</Badge>;
};

export default function ServiceCheckPage() {
  const [selectedType, setSelectedType] = useState<ServiceCheckType>('pincode');
  const [sourcePincode, setSourcePincode] = useState('');
  const [destinationPincode, setDestinationPincode] = useState('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

  const { checks, loading, error, filters, updateFilters } = useServiceChecks();
  const { loading: creating, createCheck } = useServiceCheckCreation();
  const { stats, loading: statsLoading } = useServiceCheckStats();

  const handleCreateCheck = async () => {
    if (!sourcePincode || !destinationPincode) {
      toast.error('Please enter both source and destination pincodes');
      return;
    }

    const check = await createCheck(selectedType, sourcePincode, destinationPincode);
    if (check) {
      setSourcePincode('');
      setDestinationPincode('');
      updateFilters({});
    }
  };

  const handleDateRangeChange = (dates: [Date | null, Date | null]) => {
    setDateRange(dates);
    updateFilters({
      startDate: dates[0]?.toISOString(),
      endDate: dates[1]?.toISOString(),
    });
  };

  if (loading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => updateFilters({})}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Total Checks</h3>
            <p className="text-3xl font-bold">{stats?.total || 0}</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Pending</h3>
            <p className="text-3xl font-bold">{stats?.pending || 0}</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Processing</h3>
            <p className="text-3xl font-bold">{stats?.processing || 0}</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Failed</h3>
            <p className="text-3xl font-bold">{stats?.failed || 0}</p>
          </div>
        </Card>
      </div>

      {/* Create Check Section */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Create New Check</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              label="Check Type"
              value={selectedType}
              onChange={(value) => setSelectedType(value as ServiceCheckType)}
              options={ServiceCheckTypeOptions}
            />
            <Input
              label="Source Pincode"
              value={sourcePincode}
              onChange={(e) => setSourcePincode(e.target.value)}
              placeholder="Enter source pincode"
            />
            <Input
              label="Destination Pincode"
              value={destinationPincode}
              onChange={(e) => setDestinationPincode(e.target.value)}
              placeholder="Enter destination pincode"
            />
            <div className="flex items-end">
              <Button
                onClick={handleCreateCheck}
                loading={creating}
                className="w-full"
              >
                Create Check
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Checks Table */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Service Checks</h2>
          <div className="mb-4">
            <DatePicker
              label="Filter by Date Range"
              value={dateRange}
              onChange={handleDateRangeChange}
              type="range"
            />
          </div>
          <Table
            data={checks}
            columns={[
              {
                header: 'Type',
                accessor: 'type',
                cell: (value) => ServiceCheckTypeOptions.find(opt => opt.value === value)?.label,
              },
              {
                header: 'Source',
                accessor: 'sourcePincode',
              },
              {
                header: 'Destination',
                accessor: 'destinationPincode',
              },
              {
                header: 'Status',
                accessor: 'status',
                cell: (value) => <ServiceCheckStatusBadge status={value} />,
              },
              {
                header: 'Result',
                accessor: 'result',
                cell: (value) => value?.isAvailable ? 'Available' : 'Not Available',
              },
              {
                header: 'Created At',
                accessor: 'createdAt',
                cell: (value) => format(new Date(value), 'MMM dd, yyyy HH:mm'),
              },
              {
                header: 'Completed At',
                accessor: 'completedAt',
                cell: (value) => value ? format(new Date(value), 'MMM dd, yyyy HH:mm') : '-',
              },
            ]}
          />
        </div>
      </Card>
    </div>
  );
} 