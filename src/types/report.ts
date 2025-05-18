/**
 * Report Types
 * Defines the structure for report data and related operations
 */

export interface ReportFilters {
  type?: ReportType;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export type ReportType = 
  | 'sales'
  | 'inventory'
  | 'shipping'
  | 'returns'
  | 'customer'
  | 'financial';

export type ReportFormat = 
  | 'pdf'
  | 'excel'
  | 'csv';

export interface Report {
  id: string;
  type: ReportType;
  title: string;
  description?: string;
  dateRange: {
    start: string;
    end: string;
  };
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export type ReportStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed';

export interface ReportResponse {
  reports: Report[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ReportStats {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  byType: {
    [key in ReportType]: number;
  };
  byFormat: {
    [key in ReportFormat]: number;
  };
} 