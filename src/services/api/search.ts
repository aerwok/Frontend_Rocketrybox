import { api } from './index';

/**
 * Search API service
 * 
 * This service handles all search-related API calls:
 * - Global search
 * - Route-specific search
 * - Search suggestions
 * 
 * TODO: Replace placeholder endpoints with actual API endpoints when ready
 */
export const searchApi = {
    /**
     * Perform search based on query and current route
     * @param {string} query - Search query
     * @param {string} route - Current route path
     * @returns {Promise<any>} Search results
     */
    search: (query: string, route: string) => {
        return api.post('/search', { query, route });
    },

    /**
     * Get search suggestions
     * @param {string} query - Partial search query
     * @returns {Promise<string[]>} List of suggestions
     */
    getSuggestions: (query: string) => {
        return api.get(`/search/suggestions?q=${encodeURIComponent(query)}`);
    },

    /**
     * Get recent searches
     * @returns {Promise<string[]>} List of recent searches
     */
    getRecentSearches: () => {
        return api.get('/search/recent');
    },

    /**
     * Clear search history
     * @returns {Promise<{ success: boolean }>}
     */
    clearHistory: () => {
        return api.delete('/search/history');
    },
}; 