import { Link, useLocation } from 'react-router-dom';
import { Menu, MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebarStore } from '@/store/use-sidebar-store';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useNavLinks } from '@/hooks/useNavLinks';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * AdminNavbar Component
 * 
 * A responsive navigation bar for the admin dashboard that includes:
 * - Logo
 * - Sidebar toggle button
 * - Mobile menu with navigation links
 * - Loading and error states
 */
const AdminNavbar = () => {
    const { pathname } = useLocation();
    const isAuthPage = pathname.includes('/admin/auth/login') || pathname.includes('/admin/auth/register');
    const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);
    const { navLinks, loading, error } = useNavLinks();

    const handleLinkClick = () => {
        toggleSidebar();
    };

    // Render loading skeleton when data is being fetched
    if (loading) {
        return (
            <header className="fixed top-0 left-0 right-0 border-b border-border z-50 bg-white h-16">
                <div className="px-4 h-full">
                    <div className="flex items-center justify-between h-full">
                        <div className="flex items-center gap-x-4">
                            <Skeleton className="h-10 w-32" />
                            {!isAuthPage && pathname.includes('/admin/dashboard') && (
                                <Skeleton className="h-10 w-10 rounded-lg" />
                            )}
                        </div>
                        {!isAuthPage && (
                            <Skeleton className="h-10 w-10 rounded-lg lg:hidden" />
                        )}
                    </div>
                </div>
            </header>
        );
    }

    // Render error state
    if (error) {
        return (
            <header className="fixed top-0 left-0 right-0 border-b border-border z-50 bg-white h-16">
                <div className="px-4 h-full">
                    <div className="flex items-center justify-between h-full">
                        <div className="flex items-center gap-x-4">
                            <Link to="/admin/dashboard" className="flex items-center">
                                <img
                                    src="/icons/logo.svg"
                                    alt="Rocketry Box"
                                    className="h-10"
                                />
                            </Link>
                        </div>
                        <p className="text-red-500 text-sm">Failed to load navigation</p>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="fixed top-0 left-0 right-0 border-b border-border z-50 bg-white h-16">
            <div className="px-4 h-full">
                <div className="flex items-center justify-between h-full">
                    {/* Left Section - Logo and Toggle */}
                    <div className="flex items-center gap-x-4">
                        {/* Logo */}
                        <Link to="/admin/dashboard" className="flex items-center">
                            <img
                                src="/icons/logo.svg"
                                alt="Rocketry Box"
                                className="h-10"
                            />
                        </Link>

                        {/* Sidebar Toggle Button - Only show on dashboard pages */}
                        {!isAuthPage && pathname.includes('/admin/dashboard') && (
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={toggleSidebar}
                                className="hidden lg:flex items-center justify-center"
                            >
                                <MenuIcon className="h-5 w-5" />
                            </Button>
                        )}
                    </div>

                    {/* Show navigation only for non-auth pages */}
                    {!isAuthPage && (
                        <>
                            {/* Mobile Menu Button */}
                            <div className="lg:hidden">
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <Menu />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="right" className="w-screen p-0">
                                        <div className="flex flex-col h-full pt-12">
                                            {/* Mobile Navigation Links */}
                                            <div className="flex-1 overflow-auto py-4">
                                                <nav className="flex flex-col space-y-1 px-2">
                                                    {navLinks.map((link) => (
                                                        <Link
                                                            key={link.label}
                                                            to={link.to}
                                                            className="px-4 py-2 rounded-lg hover:bg-sky-500/10 transition-colors"
                                                            onClick={handleLinkClick}
                                                        >
                                                            {link.label}
                                                        </Link>
                                                    ))}
                                                </nav>
                                            </div>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AdminNavbar; 