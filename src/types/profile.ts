/**
 * Profile Types
 * Defines the structure for user profile data and related operations
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

export interface ProfileUpdateData {
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