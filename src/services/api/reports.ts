import axios from 'axios';
import { Report, ReportFilters } from '@/types/report';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const reportsApi = {
  /**
   * Get reports with optional filters
   */
  getReports: async (filters?: ReportFilters) => {
    const response = await axios.get(`${API_URL}/reports`, { params: filters });
    return response.data;
  },

  /**
   * Generate a new report
   */
  generateReport: async (type: Report['type'], dateRange: Report['dateRange']) => {
    const response = await axios.post(`${API_URL}/reports/generate`, {
      type,
      dateRange,
    });
    return response.data;
  },

  /**
   * Download a report
   */
  downloadReport: async (reportId: string) => {
    const response = await axios.get(`${API_URL}/reports/${reportId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
}; 