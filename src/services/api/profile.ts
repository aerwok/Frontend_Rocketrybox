import api from './index';
import { ApiResponse } from '@/types/api';

/**
 * Profile Types
 */
export interface Profile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar?: string;
    address: {
        street: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
    };
    preferences: {
        notifications: boolean;
        marketing: boolean;
        language: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface UpdateProfileData {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        pincode?: string;
        country?: string;
    };
    preferences?: {
        notifications?: boolean;
        marketing?: boolean;
        language?: string;
    };
}

export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

/**
 * Profile API Service
 * Handles all profile-related API calls
 */
export const profileApi = {
    /**
     * Get user profile
     * @returns {Promise<ApiResponse<Profile>>} User profile data
     */
    getProfile: (): Promise<ApiResponse<Profile>> => {
        return api.get('/customer/profile');
    },

    /**
     * Update user profile
     * @param {UpdateProfileData} data - Profile update data
     * @returns {Promise<ApiResponse<Profile>>} Updated profile data
     */
    updateProfile: (data: UpdateProfileData): Promise<ApiResponse<Profile>> => {
        return api.put('/customer/profile', data);
    },

    /**
     * Change user password
     * @param {ChangePasswordData} data - Password change data
     * @returns {Promise<ApiResponse<void>>} Empty response
     */
    changePassword: (data: ChangePasswordData): Promise<ApiResponse<void>> => {
        return api.post('/customer/profile/change-password', data);
    },

    /**
     * Upload profile picture
     * @param {File} file - Image file
     * @returns {Promise<ApiResponse<{ url: string }>>} Uploaded image URL
     */
    uploadProfilePicture: (file: File): Promise<ApiResponse<{ url: string }>> => {
        const formData = new FormData();
        formData.append('image', file);
        return api.post('/customer/profile/picture', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    /**
     * Delete profile picture
     * @returns {Promise<ApiResponse<void>>} Empty response
     */
    deleteProfilePicture: (): Promise<ApiResponse<void>> => {
        return api.delete('/customer/profile/picture');
    },
}; 