import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useReports, useReportGeneration, useReportStats } from '@/hooks/useReports';
import { format } from 'date-fns';

// Define runtime arrays for select options
const REPORT_TYPES = [
  { value: 'sales', label: 'Sales Report' },
  { value: 'inventory', label: 'Inventory Report' },
  { value: 'shipping', label: 'Shipping Report' },
  { value: 'returns', label: 'Returns Report' },
  { value: 'customer', label: 'Customer Report' },
  { value: 'financial', label: 'Financial Report' },
];
const REPORT_FORMATS = [
  { value: 'pdf', label: 'PDF' },
  { value: 'excel', label: 'Excel' },
  { value: 'csv', label: 'CSV' },
];
const REPORT_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
];

const ReportStatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
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

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState<string>('sales');
  const [selectedFormat, setSelectedFormat] = useState<string>('pdf');

  const { reports, loading, error, filters, updateFilters } = useReports();
  const { loading: generating, generateReport } = useReportGeneration();
  const { stats, loading: statsLoading } = useReportStats();

  const handleGenerateReport = async () => {
    const report = await generateReport(selectedType, selectedFormat);
    if (report) {
      updateFilters({ page: 1 });
    }
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
        <Button onClick={() => updateFilters({ page: 1 })}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Total Reports</h3>
            <p className="text-3xl font-bold">{stats?.totalReports || 0}</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Completed Reports</h3>
            <p className="text-3xl font-bold">{stats?.completedReports || 0}</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Failed Reports</h3>
            <p className="text-3xl font-bold">{stats?.failedReports || 0}</p>
          </div>
        </Card>
      </div>

      {/* Generate Report Section */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Generate New Report</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              label="Report Type"
              value={selectedType}
              onChange={setSelectedType}
              options={REPORT_TYPES}
            />
            <Select
              label="Format"
              value={selectedFormat}
              onChange={setSelectedFormat}
              options={REPORT_FORMATS}
            />
            <div className="flex items-end">
              <Button
                onClick={handleGenerateReport}
                loading={generating}
                className="w-full"
              >
                Generate Report
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Reports Table */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Generated Reports</h2>
          <Table
            data={reports}
            columns={[
              {
                header: 'Type',
                accessor: 'type',
                cell: (value) => REPORT_TYPES.find(opt => opt.value === value)?.label || value,
              },
              {
                header: 'Format',
                accessor: 'format',
                cell: (value) => REPORT_FORMATS.find(opt => opt.value === value)?.label || value,
              },
              {
                header: 'Status',
                accessor: 'status',
                cell: (value) => <ReportStatusBadge status={value} />,
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
              {
                header: 'Actions',
                accessor: 'id',
                cell: (value, row) => (
                  <div className="flex space-x-2">
                    {row.status === 'completed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(row.downloadUrl, '_blank')}
                      >
                        Download
                      </Button>
                    )}
                    {row.status === 'processing' && (
                      <Button
                        size="sm"
                        variant="outline"
                        color="error"
                        onClick={() => reportApi.cancelReport(value)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </Card>
    </div>
  );
} 