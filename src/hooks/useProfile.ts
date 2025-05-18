import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { profileApi, Profile, UpdateProfileData, ChangePasswordData } from '@/services/api/profile';

interface UseProfileReturn {
    profile: Profile | null;
    isLoading: boolean;
    error: string | null;
    updateProfile: (data: UpdateProfileData) => Promise<void>;
    changePassword: (data: ChangePasswordData) => Promise<void>;
    uploadProfilePicture: (file: File) => Promise<void>;
    deleteProfilePicture: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

/**
 * useProfile Hook
 * 
 * Manages profile data and operations:
 * - Fetch profile data
 * - Update profile information
 * - Change password
 * - Handle profile picture
 * - Error handling and loading states
 * 
 * @returns Profile state and operations
 */
export const useProfile = (): UseProfileReturn => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch profile data
     */
    const fetchProfile = useCallback(async () => {
        try {
            setError(null);
            const response = await profileApi.getProfile();
            setProfile(response.data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profile';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Update profile information
     * @param data - Profile update data
     */
    const updateProfile = async (data: UpdateProfileData) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await profileApi.updateProfile(data);
            setProfile(response.data);
            toast.success('Profile updated successfully');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Change user password
     * @param data - Password change data
     */
    const changePassword = async (data: ChangePasswordData) => {
        try {
            setIsLoading(true);
            setError(null);
            await profileApi.changePassword(data);
            toast.success('Password changed successfully');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to change password';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Upload profile picture
     * @param file - Image file
     */
    const uploadProfilePicture = async (file: File) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await profileApi.uploadProfilePicture(file);
            setProfile(prev => prev ? { ...prev, avatar: response.data.url } : null);
            toast.success('Profile picture uploaded successfully');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to upload profile picture';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Delete profile picture
     */
    const deleteProfilePicture = async () => {
        try {
            setIsLoading(true);
            setError(null);
            await profileApi.deleteProfilePicture();
            setProfile(prev => prev ? { ...prev, avatar: undefined } : null);
            toast.success('Profile picture deleted successfully');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete profile picture';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        profile,
        isLoading,
        error,
        updateProfile,
        changePassword,
        uploadProfilePicture,
        deleteProfilePicture,
        refreshProfile: fetchProfile
    };
}; 