import axios from 'axios';
import { Profile, ProfileUpdateData } from '@/types/profile';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

/**
 * Profile API Service
 * Handles all profile-related API calls
 */
export const profileApi = {
  /**
   * Get user profile data
   * @returns Promise<Profile>
   */
  getProfile: async (): Promise<Profile> => {
    const response = await axios.get(`${API_URL}/profile`);
    return response.data;
  },

  /**
   * Update user profile
   * @param data ProfileUpdateData
   * @returns Promise<Profile>
   */
  updateProfile: async (data: ProfileUpdateData): Promise<Profile> => {
    const response = await axios.put(`${API_URL}/profile`, data);
    return response.data;
  },

  /**
   * Update profile picture
   * @param file File
   * @returns Promise<{ imageUrl: string }>
   */
  updateProfilePicture: async (file: File): Promise<{ imageUrl: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await axios.post(`${API_URL}/profile/picture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Delete profile picture
   * @returns Promise<void>
   */
  deleteProfilePicture: async (): Promise<void> => {
    await axios.delete(`${API_URL}/profile/picture`);
  },
}; 