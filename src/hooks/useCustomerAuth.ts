import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerAuthApi, Customer, CustomerLoginCredentials, CustomerRegistrationData } from '@/services/api/customerAuth';

interface UseCustomerAuthReturn {
    // Auth state
    customer: Customer | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Auth operations
    login: (credentials: CustomerLoginCredentials) => Promise<void>;
    register: (data: CustomerRegistrationData) => Promise<void>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<void>;

    // Password management
    requestPasswordReset: (email: string) => Promise<void>;
    resetPassword: (token: string, newPassword: string) => Promise<void>;

    // Email verification
    verifyEmail: (token: string) => Promise<void>;
    resendVerificationEmail: (email: string) => Promise<void>;
}

/**
 * useCustomerAuth Hook
 * 
 * Manages customer authentication state and operations:
 * - Login/Logout
 * - Registration
 * - Token refresh
 * - Password reset
 * - Email verification
 * - Loading and error states
 * 
 * @returns {UseCustomerAuthReturn} Auth state and operations
 */
export const useCustomerAuth = (): UseCustomerAuthReturn => {
    const navigate = useNavigate();
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Check if user is authenticated
     */
    const isAuthenticated = !!customer;

    /**
     * Customer login
     * @param {CustomerLoginCredentials} credentials - Login credentials
     */
    const login = useCallback(async (credentials: CustomerLoginCredentials) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await customerAuthApi.login(credentials);
            setCustomer(response.data.customer);
            // Store tokens in secure storage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            navigate('/customer/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    /**
     * Customer registration
     * @param {CustomerRegistrationData} data - Registration data
     */
    const register = useCallback(async (data: CustomerRegistrationData) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await customerAuthApi.register(data);
            setCustomer(response.data.customer);
            // Store tokens in secure storage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            navigate('/customer/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    /**
     * Customer logout
     */
    const logout = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            await customerAuthApi.logout();
            setCustomer(null);
            // Clear tokens from storage
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            navigate('/customer/auth/login');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Logout failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    /**
     * Refresh authentication token
     */
    const refreshToken = useCallback(async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) throw new Error('No refresh token found');

            const response = await customerAuthApi.refreshToken(refreshToken);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('refreshToken', response.data.refreshToken);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Token refresh failed');
            // Clear tokens and redirect to login on refresh failure
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            navigate('/customer/auth/login');
            throw err;
        }
    }, [navigate]);

    /**
     * Request password reset
     * @param {string} email - Customer email
     */
    const requestPasswordReset = useCallback(async (email: string) => {
        try {
            setIsLoading(true);
            setError(null);
            await customerAuthApi.requestPasswordReset(email);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Password reset request failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Reset password
     * @param {string} token - Password reset token
     * @param {string} newPassword - New password
     */
    const resetPassword = useCallback(async (token: string, newPassword: string) => {
        try {
            setIsLoading(true);
            setError(null);
            await customerAuthApi.resetPassword(token, newPassword);
            navigate('/customer/auth/login');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Password reset failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    /**
     * Verify customer email
     * @param {string} token - Email verification token
     */
    const verifyEmail = useCallback(async (token: string) => {
        try {
            setIsLoading(true);
            setError(null);
            await customerAuthApi.verifyEmail(token);
            navigate('/customer/auth/login');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Email verification failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    /**
     * Resend verification email
     * @param {string} email - Customer email
     */
    const resendVerificationEmail = useCallback(async (email: string) => {
        try {
            setIsLoading(true);
            setError(null);
            await customerAuthApi.resendVerificationEmail(email);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to resend verification email');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Check authentication status on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // TODO: Implement token validation and customer data fetch
            // This will be implemented when the backend is ready
        }
    }, []);

    return {
        // Auth state
        customer,
        isAuthenticated,
        isLoading,
        error,

        // Auth operations
        login,
        register,
        logout,
        refreshToken,

        // Password management
        requestPasswordReset,
        resetPassword,

        // Email verification
        verifyEmail,
        resendVerificationEmail,
    };
}; 