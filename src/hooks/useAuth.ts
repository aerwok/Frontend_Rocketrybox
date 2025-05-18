import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, User, LoginCredentials, RegisterData, AuthResponse } from '@/services/api/auth';

interface UseAuthReturn {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<void>;
    requestPasswordReset: (email: string) => Promise<void>;
    resetPassword: (token: string, newPassword: string) => Promise<void>;
}

/**
 * useAuth Hook
 * 
 * Manages authentication state and operations:
 * - User login/logout
 * - Registration
 * - Token management
 * - Password reset
 * - Session persistence
 * 
 * @returns {UseAuthReturn} Authentication state and operations
 */
export const useAuth = (): UseAuthReturn => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Handle successful authentication
     * @param {AuthResponse} response - Authentication response
     */
    const handleAuthSuccess = useCallback((response: AuthResponse) => {
        const { user, token, refreshToken } = response;
        setUser(user);
        setError(null);
        // Store tokens in secure storage
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
    }, []);

    /**
     * Login user
     * @param {LoginCredentials} credentials - User login credentials
     */
    const login = useCallback(async (credentials: LoginCredentials) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await authApi.login(credentials);
            handleAuthSuccess(response);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [navigate, handleAuthSuccess]);

    /**
     * Register new user
     * @param {RegisterData} data - User registration data
     */
    const register = useCallback(async (data: RegisterData) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await authApi.register(data);
            handleAuthSuccess(response);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [navigate, handleAuthSuccess]);

    /**
     * Logout user
     */
    const logout = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            await authApi.logout();
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            navigate('/admin/auth/login');
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
            if (!refreshToken) throw new Error('No refresh token available');

            const { token, refreshToken: newRefreshToken } = await authApi.refreshToken(refreshToken);
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', newRefreshToken);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Token refresh failed');
            throw err;
        }
    }, []);

    /**
     * Request password reset
     * @param {string} email - User email
     */
    const requestPasswordReset = useCallback(async (email: string) => {
        try {
            setIsLoading(true);
            setError(null);
            await authApi.requestPasswordReset(email);
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
            await authApi.resetPassword(token, newPassword);
            navigate('/admin/auth/login');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Password reset failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    return {
        user,
        isLoading,
        error,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshToken,
        requestPasswordReset,
        resetPassword,
    };
}; 