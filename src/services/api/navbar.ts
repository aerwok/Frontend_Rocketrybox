import api from './index';

export interface NavItem {
    id: string;
    label: string;
    href: string;
    icon?: string;
    children?: NavItem[];
}

export interface NavbarData {
    mainNav: NavItem[];
    userNav: NavItem[];
    notifications: {
        id: string;
        title: string;
        message: string;
        read: boolean;
        createdAt: string;
    }[];
}

/**
 * Navbar API service
 * Handles all navigation-related API calls
 */
export const navbarApi = {
    /**
     * Get main navigation items
     * @returns {Promise<NavItem[]>} Main navigation items
     */
    getMainNav: (): Promise<NavItem[]> => {
        return api.get('/navigation/main');
    },

    /**
     * Get user navigation items
     * @returns {Promise<NavItem[]>} User navigation items
     */
    getUserNav: (): Promise<NavItem[]> => {
        return api.get('/navigation/user');
    },

    /**
     * Get user notifications
     * @returns {Promise<NavbarData['notifications']>} User notifications
     */
    getNotifications: (): Promise<NavbarData['notifications']> => {
        return api.get('/notifications');
    },

    /**
     * Mark notification as read
     * @param {string} notificationId - ID of the notification
     * @returns {Promise<void>}
     */
    markNotificationAsRead: (notificationId: string): Promise<void> => {
        return api.put(`/notifications/${notificationId}/read`);
    },

    /**
     * Mark all notifications as read
     * @returns {Promise<void>}
     */
    markAllNotificationsAsRead: (): Promise<void> => {
        return api.put('/notifications/read-all');
    },
}; 