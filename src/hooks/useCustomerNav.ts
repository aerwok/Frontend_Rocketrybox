import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { customerApi } from '@/services/api/customer';

export interface NavLink {
    label: string;
    href: string;
}

interface UseCustomerNavReturn {
    navLinks: NavLink[];
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    isAuthPage: boolean;
    checkAuth: () => Promise<void>;
}

/**
 * Custom hook for managing customer navigation and authentication
 * 
 * This hook handles:
 * - Fetching navigation links from API
 * - Managing authentication state
 * - Loading and error states
 * - Route-based authentication checks
 * 
 * @returns {UseCustomerNavReturn} Object containing navigation state and methods
 */
export const useCustomerNav = (): UseCustomerNavReturn => {
    const [navLinks, setNavLinks] = useState<NavLink[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    const navigate = useNavigate();
    const location = useLocation();
    
    const isAuthPage = location.pathname === "/customer/login" || location.pathname === "/customer/register";

    /**
     * Fetch navigation links from API
     * TODO: Replace with actual API endpoint when ready
     */
    const fetchNavLinks = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // TODO: Replace with actual API call
            // const response = await customerApi.getNavLinks();
            // setNavLinks(response.data);
            
            // For now, set empty array until API is ready
            setNavLinks([]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch navigation links');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Check authentication status
     * TODO: Replace with actual API endpoint when ready
     */
    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('customer_token');
            
            if (!token) {
                setIsAuthenticated(false);
                if (!isAuthPage) {
                    navigate('/customer/login');
                }
                return;
            }

            // TODO: Replace with actual API call
            // const response = await customerApi.validateToken(token);
            // setIsAuthenticated(response.data.isValid);
            
            // For now, set authenticated to true if token exists
            setIsAuthenticated(true);
        } catch (err) {
            setIsAuthenticated(false);
            setError(err instanceof Error ? err.message : 'Authentication check failed');
            if (!isAuthPage) {
                navigate('/customer/login');
            }
        }
    };

    useEffect(() => {
        fetchNavLinks();
        checkAuth();
    }, []);

    return {
        navLinks,
        isAuthenticated,
        loading,
        error,
        isAuthPage,
        checkAuth,
    };
}; 