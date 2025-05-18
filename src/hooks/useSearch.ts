import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { searchApi } from '@/services/api/search';

interface UseSearchProps {
    onSearch?: (query: string) => void;
    onError?: (error: Error) => void;
}

interface UseSearchReturn {
    searchQuery: string;
    isLoading: boolean;
    error: string | null;
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSearchSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    getSearchPlaceholder: () => string;
}

/**
 * Custom hook for managing search functionality
 * 
 * This hook handles:
 * - Search query state management
 * - Debounced search execution
 * - Route-specific search behavior
 * - Loading and error states
 * 
 * @param {UseSearchProps} props - Hook configuration
 * @returns {UseSearchReturn} Search state and methods
 */
export const useSearch = ({ onSearch, onError }: UseSearchProps = {}): UseSearchReturn => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize search from URL parameters
    useEffect(() => {
        const searchParam = searchParams.get("search");
        const awbParam = searchParams.get("awb");
        
        if (searchParam) {
            setSearchQuery(searchParam);
        } else if (awbParam) {
            setSearchQuery(awbParam);
        }
    }, [searchParams]);

    /**
     * Helper to check if string looks like an AWB number
     * @param {string} query - Query string to check
     * @returns {boolean} Whether the query looks like an AWB number
     */
    const isAwbNumber = (query: string): boolean => {
        return /^[A-Z0-9]{6,18}$/i.test(query.trim());
    };

    /**
     * Perform the search with specified query
     * @param {string} queryText - Search query
     */
    const performSearch = async (queryText: string) => {
        if (!queryText) return;
        
        try {
            setIsLoading(true);
            setError(null);

            const currentPath = location.pathname;
            
            // On dashboard, AWB searches go to shipments page
            if (currentPath === "/seller/dashboard" && isAwbNumber(queryText)) {
                navigate(`/seller/dashboard/shipments?awb=${encodeURIComponent(queryText)}`);
                return;
            }
            
            // On shipments page, use awb parameter for AWB-like queries
            if (currentPath.includes('/seller/dashboard/shipments')) {
                const paramName = isAwbNumber(queryText) ? "awb" : "search";
                const newParams = new URLSearchParams(searchParams);
                newParams.set(paramName, queryText);
                
                // Clear the other param to avoid conflicts
                if (paramName === "awb") {
                    newParams.delete("search");
                } else {
                    newParams.delete("awb");
                }
                
                setSearchParams(newParams);
                return;
            }
            
            // For all other pages, just update the search param
            const newParams = new URLSearchParams(searchParams);
            newParams.set("search", queryText);
            setSearchParams(newParams);

            // TODO: Replace with actual API endpoint when ready
            await searchApi.search(queryText, currentPath);
            onSearch?.(queryText);
        } catch (err) {
            const error = err as Error;
            setError(error.message || "Failed to perform search");
            onError?.(error);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handle search input changes with debouncing
     * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
     */
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        
        // Clear previous timeout if exists
        if (searchDebounceRef.current) {
            clearTimeout(searchDebounceRef.current);
        }
        
        // Set new timeout for debounce (300ms)
        searchDebounceRef.current = setTimeout(() => {
            if (value.trim()) {
                performSearch(value.trim());
            } else {
                // Clear search parameters if search is empty
                const newParams = new URLSearchParams(searchParams);
                newParams.delete("search");
                newParams.delete("awb");
                setSearchParams(newParams);
            }
        }, 300);
    };

    /**
     * Handle search form submission
     * @param {React.FormEvent<HTMLFormElement>} e - Form submit event
     */
    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Clear any pending debounced search
        if (searchDebounceRef.current) {
            clearTimeout(searchDebounceRef.current);
        }
        
        const queryText = searchQuery.trim();
        if (queryText) {
            performSearch(queryText);
        }
    };

    /**
     * Get the appropriate search placeholder based on current route
     * @returns {string} Search placeholder text
     */
    const getSearchPlaceholder = () => {
        if (location.pathname.includes('/seller/dashboard/ndr')) {
            return "Search NDR by AWB, Customer, Courier...";
        } else if (location.pathname.includes('/seller/dashboard/shipments')) {
            return "Search Shipments by AWB...";
        } else if (location.pathname.includes('/seller/dashboard/orders')) {
            return "Search Orders by ID, Customer...";
        } else if (location.pathname === "/seller/dashboard") {
            return "Search shipment by AWB number...";
        }
        return "Search...";
    };

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (searchDebounceRef.current) {
                clearTimeout(searchDebounceRef.current);
            }
        };
    }, []);

    return {
        searchQuery,
        isLoading,
        error,
        handleSearchChange,
        handleSearchSubmit,
        getSearchPlaceholder,
    };
}; 