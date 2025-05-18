import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCustomerNav } from "@/hooks/useCustomerNav";

/**
 * Customer Navigation Bar Component
 * 
 * This component handles:
 * - Responsive navigation menu
 * - Authentication state
 * - Loading and error states
 * - Mobile menu toggle
 * 
 * @returns {JSX.Element} Rendered component
 */
const CustomerNavbar = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const {
        navLinks,
        loading,
        error,
        isAuthPage,
    } = useCustomerNav();

    const isActiveLink = (href: string) => {
        if (href === "/customer/home" && location.pathname === "/customer") {
            return true;
        }
        return location.pathname === href;
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    if (isAuthPage) {
        return (
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 bg-white",
                    isOpen && "shadow-xl shadow-neutral-400/30"
                )}
            >
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link to="/" className="flex items-center">
                                <img
                                    src="/icons/logo.svg"
                                    alt="Rocketry Box"
                                    className="h-10"
                                />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </motion.header>
        );
    }

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className={cn(
                "fixed top-0 left-0 right-0 z-50 bg-white",
                isOpen && "shadow-xl shadow-neutral-400/30"
            )}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link to="/customer/home" className="flex items-center">
                            <img
                                src="/icons/logo.svg"
                                alt="Rocketry Box"
                                className="h-10"
                            />
                        </Link>
                    </motion.div>

                    {error && (
                        <div className="text-sm text-red-500">
                            {error}
                        </div>
                    )}

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center space-x-1">
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Loading...
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex items-center justify-center px-1 py-2 rounded-lg bg-main text-white gap-x-1"
                            >
                                {navLinks.map((link, index) => (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * (index + 1) }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Link
                                            to={link.href}
                                            className={cn(
                                                "px-4 py-1.5 rounded-md transition-all duration-200",
                                                isActiveLink(link.href)
                                                    ? "bg-white/20 font-medium"
                                                    : "hover:bg-white/10"
                                            )}
                                        >
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleMenu}
                        className="lg:hidden p-2 text-gray-700 hover:text-main"
                    >
                        <AnimatePresence mode="wait">
                            {isOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <X className="h-6 w-6" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="menu"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Menu className="h-6 w-6" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>

                {/* Mobile Navigation */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="lg:hidden overflow-hidden"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                                className="p-4 bg-main text-white rounded-lg mb-4"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2 py-4">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Loading...
                                    </div>
                                ) : (
                                    <nav className="flex flex-col gap-1">
                                        {navLinks.map((link, index) => (
                                            <motion.div
                                                key={link.href}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.05 * (index + 1) }}
                                            >
                                                <Link
                                                    to={link.href}
                                                    className={cn(
                                                        "px-4 py-2 rounded-lg block transition-all duration-200",
                                                        isActiveLink(link.href)
                                                            ? "bg-white/20 font-medium"
                                                            : "hover:bg-white/10"
                                                    )}
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    {link.label}
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </nav>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.header>
    );
};

export default CustomerNavbar;
