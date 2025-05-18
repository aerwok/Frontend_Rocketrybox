import { BaseEntity, EntityStatus } from './api';

/**
 * Authentication Types
 */
export interface AuthUser extends BaseEntity {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: UserRole;
    status: EntityStatus;
    avatar?: string;
    lastLogin?: string;
    metadata?: Record<string, unknown>;
}

export enum UserRole {
    CUSTOMER = 'customer',
    SELLER = 'seller',
    ADMIN = 'admin',
    SUPER_ADMIN = 'super-admin',
    SUPPORT = 'support',
    OPERATIONS = 'operations',
    FINANCE = 'finance'
}

/**
 * Authentication Request Types
 */
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: UserRole;
}

export interface VerifyOTPRequest {
    email: string;
    otp: string;
}

export interface ResendOTPRequest {
    email: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    password: string;
    confirmPassword: string;
}

/**
 * Authentication Response Types
 */
export interface AuthResponse {
    user: AuthUser;
    token: string;
    refreshToken: string;
}

export interface OTPResponse {
    message: string;
    expiresIn: number;
}

export interface PasswordResetResponse {
    message: string;
}

/**
 * Authentication State Types
 */
export interface AuthState {
    user: AuthUser | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

/**
 * Authentication Hook Return Types
 */
export interface UseAuthReturn {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
    verifyOTP: (data: VerifyOTPRequest) => Promise<void>;
    resendOTP: (data: ResendOTPRequest) => Promise<void>;
    forgotPassword: (data: ForgotPasswordRequest) => Promise<void>;
    resetPassword: (data: ResetPasswordRequest) => Promise<void>;
}

export interface UseOTPReturn {
    isLoading: boolean;
    error: string | null;
    verifyOTP: (data: VerifyOTPRequest) => Promise<void>;
    resendOTP: (data: ResendOTPRequest) => Promise<void>;
    remainingTime: number;
} 