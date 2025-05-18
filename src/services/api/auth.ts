import axios from 'axios';
import { 
    LoginRequest, 
    RegisterRequest, 
    VerifyOTPRequest, 
    ResendOTPRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    AuthResponse,
    OTPResponse,
    PasswordResetResponse
} from '../../types/auth';

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'user';
    createdAt: string;
    lastLogin?: string;
}

/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */
export const authApi = {
    /**
     * Login user with email and password
     * @param data Login credentials
     * @returns AuthResponse with user data and tokens
     */
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await axios.post<AuthResponse>('/api/auth/login', data);
        return response.data;
    },

    /**
     * Register new user
     * @param data Registration data
     * @returns AuthResponse with user data and tokens
     */
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await axios.post<AuthResponse>('/api/auth/register', data);
        return response.data;
    },

    /**
     * Verify OTP for email verification
     * @param data OTP verification data
     * @returns AuthResponse with user data and tokens
     */
    verifyOTP: async (data: VerifyOTPRequest): Promise<AuthResponse> => {
        const response = await axios.post<AuthResponse>('/api/auth/verify-otp', data);
        return response.data;
    },

    /**
     * Resend OTP for email verification
     * @param data Email data
     * @returns OTPResponse with message and expiry
     */
    resendOTP: async (data: ResendOTPRequest): Promise<OTPResponse> => {
        const response = await axios.post<OTPResponse>('/api/auth/resend-otp', data);
        return response.data;
    },

    /**
     * Request password reset
     * @param data Email data
     * @returns PasswordResetResponse with message
     */
    forgotPassword: async (data: ForgotPasswordRequest): Promise<PasswordResetResponse> => {
        const response = await axios.post<PasswordResetResponse>('/api/auth/forgot-password', data);
        return response.data;
    },

    /**
     * Reset password with token
     * @param data Password reset data
     * @returns PasswordResetResponse with message
     */
    resetPassword: async (data: ResetPasswordRequest): Promise<PasswordResetResponse> => {
        const response = await axios.post<PasswordResetResponse>('/api/auth/reset-password', data);
        return response.data;
    },

    /**
     * Logout user
     * @returns void
     */
    logout: async (): Promise<void> => {
        await axios.post('/api/auth/logout');
    },

    /**
     * Refresh authentication token
     * @returns AuthResponse with new tokens
     */
    refreshToken: async (): Promise<AuthResponse> => {
        const response = await axios.post<AuthResponse>('/api/auth/refresh-token');
        return response.data;
    },

    /**
     * Get current user data
     * @returns AuthUser data
     */
    getCurrentUser: async (): Promise<AuthResponse> => {
        const response = await axios.get<AuthResponse>('/api/auth/me');
        return response.data;
    }
}; 