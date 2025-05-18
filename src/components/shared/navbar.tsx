import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavbar } from '@/hooks/useNavbar';
import { Loader2, Bell, X } from 'lucide-react';

/**
 * Navbar Component
 * 
 * This component displays the main navigation bar with:
 * - Main navigation items
 * - User navigation items
 * - Notifications
 * - Loading and error states
 * 
 * @returns {JSX.Element} The rendered navbar
 */
export const Navbar: React.FC = () => {
    const location = useLocation();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const {
        mainNav,
        userNav,
        notifications,
        isLoading,
        error,
        markNotificationAsRead,
        markAllNotificationsAsRead,
    } = useNavbar();

    // Show loading state
    if (isLoading) {
        return (
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                    </div>
                </div>
            </nav>
        );
    }

    // Show error state
    if (error) {
        return (
            <nav className="fixed top-0 left-0 right-0 z-50 bg-red-50 border-b border-red-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <p className="text-red-600">{error}</p>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Main Navigation */}
                    <div className="flex">
                        {mainNav.map((item) => (
                            <Link
                                key={item.id}
                                to={item.href}
                                className={`inline-flex items-center px-4 py-2 text-sm font-medium ${
                                    location.pathname === item.href
                                        ? 'text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* User Navigation */}
                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                <Bell className="h-6 w-6" />
                                {notifications.some(n => !n.read) && (
                                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500" />
                                )}
                            </button>

                            <AnimatePresence>
                                {isNotificationsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
                                    >
                                        <div className="p-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg font-medium">Notifications</h3>
                                                {notifications.some(n => !n.read) && (
                                                    <button
                                                        onClick={() => markAllNotificationsAsRead()}
                                                        className="text-sm text-blue-600 hover:text-blue-800"
                                                    >
                                                        Mark all as read
                                                    </button>
                                                )}
                                            </div>
                                            <div className="space-y-4">
                                                {notifications.map((notification) => (
                                                    <div
                                                        key={notification.id}
                                                        className={`p-3 rounded-lg ${
                                                            notification.read ? 'bg-gray-50' : 'bg-blue-50'
                                                        }`}
                                                    >
                                                        <div className="flex justify-between">
                                                            <h4 className="font-medium">{notification.title}</h4>
                                                            {!notification.read && (
                                                                <button
                                                                    onClick={() => markNotificationAsRead(notification.id)}
                                                                    className="text-blue-600 hover:text-blue-800"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-2">
                                                            {new Date(notification.createdAt).toLocaleString()}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* User Menu */}
                        {userNav.map((item) => (
                            <Link
                                key={item.id}
                                to={item.href}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 