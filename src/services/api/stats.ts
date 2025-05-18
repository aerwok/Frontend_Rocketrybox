import { api } from './index';
import { StatData } from '@/hooks/useStats';

/**
 * Stats API service
 * 
 * This service handles all statistics-related API calls:
 * - Fetching dashboard statistics
 * - Getting time-based metrics
 * - Retrieving specific stat types
 * 
 * TODO: Replace placeholder endpoints with actual API endpoints when ready
 */
export const statsApi = {
    /**
     * Get statistics data
     * @param {string} statType - Type of statistics to fetch
     * @param {string} timeRange - Time range for the statistics
     * @returns {Promise<StatData>} Statistics data
     */
    getStats: (statType: string, timeRange: string): Promise<StatData> => {
        return api.get(`/stats/${statType}?timeRange=${timeRange}`);
    },

    /**
     * Get dashboard overview statistics
     * @returns {Promise<StatData[]>} Array of statistics data
     */
    getDashboardStats: (): Promise<StatData[]> => {
        return api.get('/stats/dashboard');
    },

    /**
     * Get time-based statistics
     * @param {string} statType - Type of statistics to fetch
     * @param {string} startDate - Start date for the range
     * @param {string} endDate - End date for the range
     * @returns {Promise<StatData>} Statistics data
     */
    getTimeBasedStats: (statType: string, startDate: string, endDate: string): Promise<StatData> => {
        return api.get(`/stats/${statType}/time-range?start=${startDate}&end=${endDate}`);
    },
}; 