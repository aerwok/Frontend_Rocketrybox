import api from './index';
import { ApiResponse } from '@/types/api';

export interface Customer {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: 'customer';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CustomerLoginCredentials {
    email: string;
    password: string;
}

export interface CustomerRegistrationData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

export interface CustomerAuthResponse {
    customer: Customer;
    token: string;
    refreshToken: string;
}

/**
 * Customer Authentication API Service
 * Handles all customer authentication related API calls
 */
export const customerAuthApi = {
    /**
     * Customer login
     * @param {CustomerLoginCredentials} credentials - Login credentials
     * @returns {Promise<ApiResponse<CustomerAuthResponse>>} Customer data and tokens
     */
    login: (credentials: CustomerLoginCredentials): Promise<ApiResponse<CustomerAuthResponse>> => {
        return api.post('/customer/auth/login', credentials);
    },

    /**
     * Customer registration
     * @param {CustomerRegistrationData} data - Registration data
     * @returns {Promise<ApiResponse<CustomerAuthResponse>>} Customer data and tokens
     */
    register: (data: CustomerRegistrationData): Promise<ApiResponse<CustomerAuthResponse>> => {
        return api.post('/customer/auth/register', data);
    },

    /**
     * Customer logout
     * @returns {Promise<ApiResponse<void>>}
     */
    logout: (): Promise<ApiResponse<void>> => {
        return api.post('/customer/auth/logout');
    },

    /**
     * Refresh customer authentication token
     * @param {string} refreshToken - Current refresh token
     * @returns {Promise<ApiResponse<{ token: string; refreshToken: string }>>} New tokens
     */
    refreshToken: (refreshToken: string): Promise<ApiResponse<{ token: string; refreshToken: string }>> => {
        return api.post('/customer/auth/refresh-token', { refreshToken });
    },

    /**
     * Request password reset
     * @param {string} email - Customer email
     * @returns {Promise<ApiResponse<void>>}
     */
    requestPasswordReset: (email: string): Promise<ApiResponse<void>> => {
        return api.post('/customer/auth/request-password-reset', { email });
    },

    /**
     * Reset password
     * @param {string} token - Password reset token
     * @param {string} newPassword - New password
     * @returns {Promise<ApiResponse<void>>}
     */
    resetPassword: (token: string, newPassword: string): Promise<ApiResponse<void>> => {
        return api.post('/customer/auth/reset-password', { token, newPassword });
    },

    /**
     * Verify customer email
     * @param {string} token - Email verification token
     * @returns {Promise<ApiResponse<void>>}
     */
    verifyEmail: (token: string): Promise<ApiResponse<void>> => {
        return api.post('/customer/auth/verify-email', { token });
    },

    /**
     * Resend verification email
     * @param {string} email - Customer email
     * @returns {Promise<ApiResponse<void>>}
     */
    resendVerificationEmail: (email: string): Promise<ApiResponse<void>> => {
        return api.post('/customer/auth/resend-verification', { email });
    }
}; 