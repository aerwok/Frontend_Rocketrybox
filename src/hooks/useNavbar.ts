import { useState, useEffect } from 'react';
import { navbarApi, NavItem, NavbarData } from '@/services/api/navbar';

interface UseNavbarReturn {
    mainNav: NavItem[];
    userNav: NavItem[];
    notifications: NavbarData['notifications'];
    isLoading: boolean;
    error: string | null;
    markNotificationAsRead: (notificationId: string) => Promise<void>;
    markAllNotificationsAsRead: () => Promise<void>;
    refetch: () => Promise<void>;
}

/**
 * Custom hook for managing navbar data and state
 * 
 * This hook handles:
 * - Fetching navigation items
 * - Managing notifications
 * - Loading and error states
 * - Data refetching
 * 
 * @returns {UseNavbarReturn} Navbar data and state management functions
 */
export const useNavbar = (): UseNavbarReturn => {
    const [mainNav, setMainNav] = useState<NavItem[]>([]);
    const [userNav, setUserNav] = useState<NavItem[]>([]);
    const [notifications, setNotifications] = useState<NavbarData['notifications']>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch all navbar data
     */
    const fetchNavbarData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const [mainNavData, userNavData, notificationsData] = await Promise.all([
                navbarApi.getMainNav(),
                navbarApi.getUserNav(),
                navbarApi.getNotifications(),
            ]);

            setMainNav(mainNavData);
            setUserNav(userNavData);
            setNotifications(notificationsData);
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Failed to fetch navbar data');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Mark a notification as read
     * @param {string} notificationId - ID of the notification
     */
    const markNotificationAsRead = async (notificationId: string) => {
        try {
            await navbarApi.markNotificationAsRead(notificationId);
            setNotifications(prev =>
                prev.map(notification =>
                    notification.id === notificationId
                        ? { ...notification, read: true }
                        : notification
                )
            );
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Failed to mark notification as read');
        }
    };

    /**
     * Mark all notifications as read
     */
    const markAllNotificationsAsRead = async () => {
        try {
            await navbarApi.markAllNotificationsAsRead();
            setNotifications(prev =>
                prev.map(notification => ({ ...notification, read: true }))
            );
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Failed to mark all notifications as read');
        }
    };

    // Fetch data on mount
    useEffect(() => {
        fetchNavbarData();
    }, []);

    return {
        mainNav,
        userNav,
        notifications,
        isLoading,
        error,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        refetch: fetchNavbarData,
    };
}; 