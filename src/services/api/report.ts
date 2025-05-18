import axios from 'axios';
import { Report, ReportFilters, ReportResponse, ReportStats } from '@/types/report';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

/**
 * Report API Service
 * Handles all report-related API calls
 */
export const reportApi = {
  /**
   * Get all reports with optional filters
   * @param filters ReportFilters
   * @returns Promise<ReportResponse>
   */
  getReports: async (filters?: ReportFilters): Promise<ReportResponse> => {
    const response = await axios.get(`${API_URL}/reports`, { params: filters });
    return response.data;
  },

  /**
   * Get a single report by ID
   * @param reportId string
   * @returns Promise<Report>
   */
  getReport: async (reportId: string): Promise<Report> => {
    const response = await axios.get(`${API_URL}/reports/${reportId}`);
    return response.data;
  },

  /**
   * Generate a new report
   * @param type ReportType
   * @param format ReportFormat
   * @param filters ReportFilters
   * @returns Promise<Report>
   */
  generateReport: async (
    type: Report['type'],
    format: Report['format'],
    filters?: ReportFilters
  ): Promise<Report> => {
    const response = await axios.post(`${API_URL}/reports/generate`, {
      type,
      format,
      filters,
    });
    return response.data;
  },

  /**
   * Download a report
   * @param reportId string
   * @returns Promise<Blob>
   */
  downloadReport: async (reportId: string): Promise<Blob> => {
    const response = await axios.get(`${API_URL}/reports/${reportId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Get report statistics
   * @returns Promise<ReportStats>
   */
  getReportStats: async (): Promise<ReportStats> => {
    const response = await axios.get(`${API_URL}/reports/stats`);
    return response.data;
  },

  /**
   * Cancel a report generation
   * @param reportId string
   * @returns Promise<void>
   */
  cancelReport: async (reportId: string): Promise<void> => {
    await axios.post(`${API_URL}/reports/${reportId}/cancel`);
  },
}; 