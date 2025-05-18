import { useState, useCallback } from 'react';
import { profileApi, Profile } from '@/services/api/profile';

interface UseProfilePreferencesReturn {
    preferences: Profile['preferences'] | null;
    isLoading: boolean;
    error: string | null;
    updateTheme: (theme: Profile['preferences']['theme']) => Promise<void>;
    updateNotifications: (notifications: Profile['preferences']['notifications']) => Promise<void>;
    updateLanguage: (language: string) => Promise<void>;
}

/**
 * useProfilePreferences Hook
 * 
 * Manages user preferences state and operations:
 * - Theme preferences
 * - Notification settings
 * - Language preferences
 * - Loading and error states
 * 
 * @param {Profile['preferences']} initialPreferences - Initial preferences
 * @returns {UseProfilePreferencesReturn} Preferences state and operations
 */
export const useProfilePreferences = (
    initialPreferences: Profile['preferences']
): UseProfilePreferencesReturn => {
    const [preferences, setPreferences] = useState<Profile['preferences']>(initialPreferences);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Update theme preference
     * @param {Profile['preferences']['theme']} theme - New theme
     */
    const updateTheme = useCallback(async (theme: Profile['preferences']['theme']) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await profileApi.updatePreferences({
                ...preferences,
                theme,
            });
            setPreferences(response.data.preferences);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update theme');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [preferences]);

    /**
     * Update notification preferences
     * @param {Profile['preferences']['notifications']} notifications - New notification settings
     */
    const updateNotifications = useCallback(async (
        notifications: Profile['preferences']['notifications']
    ) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await profileApi.updatePreferences({
                ...preferences,
                notifications,
            });
            setPreferences(response.data.preferences);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update notifications');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [preferences]);

    /**
     * Update language preference
     * @param {string} language - New language
     */
    const updateLanguage = useCallback(async (language: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await profileApi.updatePreferences({
                ...preferences,
                language,
            });
            setPreferences(response.data.preferences);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update language');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [preferences]);

    return {
        preferences,
        isLoading,
        error,
        updateTheme,
        updateNotifications,
        updateLanguage,
    };
}; 