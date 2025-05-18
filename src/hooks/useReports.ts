import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { reportApi } from '@/services/api/report';
import { Report, ReportFilters, ReportResponse, ReportStats } from '@/types/report';
import { reportsApi } from '@/services/api/reports';

/**
 * Hook for managing reports list with pagination and filters
 */
export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async (filters?: ReportFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reportsApi.getReports(filters);
      setReports(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  }, []);

  const generateReport = useCallback(async (type: Report['type'], dateRange: Report['dateRange']) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reportsApi.generateReport(type, dateRange);
      setReports(prev => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadReport = useCallback(async (reportId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reportsApi.downloadReport(reportId);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download report');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    reports,
    loading,
    error,
    fetchReports,
    generateReport,
    downloadReport,
  };
}

/**
 * Hook for managing a single report
 */
export const useReport = (reportId: string) => {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportApi.getReport(reportId);
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch report');
      toast.error('Failed to fetch report');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async () => {
    try {
      setLoading(true);
      const blob = await reportApi.downloadReport(reportId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${reportId}.${report?.format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Report downloaded successfully');
    } catch (err) {
      toast.error('Failed to download report');
    } finally {
      setLoading(false);
    }
  };

  const cancelReport = async () => {
    try {
      setLoading(true);
      await reportApi.cancelReport(reportId);
      await fetchReport();
      toast.success('Report cancelled successfully');
    } catch (err) {
      toast.error('Failed to cancel report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reportId) {
      fetchReport();
    }
  }, [reportId]);

  return {
    report,
    loading,
    error,
    downloadReport,
    cancelReport,
    refetch: fetchReport,
  };
};

/**
 * Hook for managing report generation
 */
export const useReportGeneration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = async (
    type: Report['type'],
    format: Report['format'],
    filters?: ReportFilters
  ) => {
    try {
      setLoading(true);
      setError(null);
      const report = await reportApi.generateReport(type, format, filters);
      toast.success('Report generation started');
      return report;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
      toast.error('Failed to generate report');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    generateReport,
  };
};

/**
 * Hook for managing report statistics
 */
export const useReportStats = () => {
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportApi.getReportStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch report statistics');
      toast.error('Failed to fetch report statistics');
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