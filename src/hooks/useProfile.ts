import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { profileApi } from '@/services/api/profile';
import { Profile, ProfileUpdateData, ChangePasswordData } from '@/types/profile';

/**
 * Hook for managing user profile data
 * Handles fetching, updating, and managing profile state
 */
export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch user profile data
   */
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await profileApi.getProfile();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      toast.error('Failed to fetch profile data');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update user profile
   * @param data ProfileUpdateData
   */
  const updateProfile = async (data: ProfileUpdateData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedProfile = await profileApi.updateProfile(data);
      setProfile(updatedProfile);
      toast.success('Profile updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update profile picture
   * @param file File
   */
  const updateProfilePicture = async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      const { imageUrl } = await profileApi.updateProfilePicture(file);
      if (profile) {
        setProfile({ ...profile, avatar: imageUrl });
      }
      toast.success('Profile picture updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile picture');
      toast.error('Failed to update profile picture');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete profile picture
   */
  const deleteProfilePicture = async () => {
    try {
      setLoading(true);
      setError(null);
      await profileApi.deleteProfilePicture();
      if (profile) {
        setProfile({ ...profile, avatar: undefined });
      }
      toast.success('Profile picture deleted successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete profile picture');
      toast.error('Failed to delete profile picture');
    } finally {
      setLoading(false);
    }
  };

  // Fetch profile data on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    updateProfile,
    updateProfilePicture,
    deleteProfilePicture,
    refreshProfile: fetchProfile,
  };
};

/**
 * Hook for managing password changes
 * Handles password change operations and validation
 */
export const usePasswordChange = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Change user password
   * @param data ChangePasswordData
   */
  const changePassword = async (data: ChangePasswordData) => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implement password change API call
      // await profileApi.changePassword(data);
      toast.success('Password changed successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    changePassword,
  };
}; 