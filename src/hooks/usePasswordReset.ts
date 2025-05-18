import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/services/api/auth';

interface UsePasswordResetReturn {
    isLoading: boolean;
    error: string | null;
    success: boolean;
    requestReset: (email: string) => Promise<void>;
    resetPassword: (token: string, newPassword: string) => Promise<void>;
}

/**
 * usePasswordReset Hook
 * 
 * Manages password reset operations:
 * - Request password reset
 * - Reset password with token
 * - Loading and error states
 * - Success feedback
 * 
 * @returns {UsePasswordResetReturn} Password reset state and operations
 */
export const usePasswordReset = (): UsePasswordResetReturn => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    /**
     * Request password reset
     * @param {string} email - User email
     */
    const requestReset = useCallback(async (email: string) => {
        try {
            setIsLoading(true);
            setError(null);
            setSuccess(false);
            await authApi.requestPasswordReset(email);
            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to request password reset');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Reset password with token
     * @param {string} token - Password reset token
     * @param {string} newPassword - New password
     */
    const resetPassword = useCallback(async (token: string, newPassword: string) => {
        try {
            setIsLoading(true);
            setError(null);
            setSuccess(false);
            await authApi.resetPassword(token, newPassword);
            setSuccess(true);
            navigate('/admin/auth/login');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to reset password');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    return {
        isLoading,
        error,
        success,
        requestReset,
        resetPassword,
    };
}; 