import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { HeadsetIcon, PackageIcon, SettingsIcon, UserIcon, WalletIcon } from "lucide-react";
import { Link } from "react-router-dom";
import WalletModal from "./wallet-modal";
import { useSidebar } from "@/hooks/useSidebar";
import { Loader2 } from "lucide-react";

/**
 * Sidebar navigation links configuration
 * Each link defines its icon, route, label, and whether it opens a modal
 */
const SIDEBAR_LINKS = [
    {
        icon: UserIcon,
        to: "/seller/dashboard/profile",
        label: "Profile",
        isModal: false,
    },
    {
        icon: WalletIcon,
        to: "#",
        label: "Wallet",
        isModal: true,
    },
    {
        icon: PackageIcon,
        to: "/seller/dashboard/new-order",
        label: "New Order",
        isModal: false,
    },
    {
        icon: HeadsetIcon,
        to: "/seller/dashboard/support",
        label: "Support",
        isModal: false,
    },
    {
        icon: SettingsIcon,
        to: "/seller/dashboard/settings",
        label: "Settings",
        isModal: false,
    },
];

/**
 * SellerDashboardSidebar Component
 * 
 * This component renders the sidebar navigation for the seller dashboard, including:
 * - Navigation links with icons
 * - Wallet balance display
 * - Collapsible sidebar functionality
 * - Tooltips for collapsed state
 * 
 * @returns {JSX.Element} The rendered sidebar
 */
const SellerDashboardSidebar = () => {
    const {
        isExpanded,
        pathname,
        walletBalance,
        isLoadingBalance,
        error,
        handleLinkClick,
        setIsWalletOpen,
        isWalletOpen,
    } = useSidebar();

    /**
     * Render wallet balance with loading state
     * @returns {JSX.Element} Wallet balance display
     */
    const renderWalletAmount = () => {
        if (isLoadingBalance) {
            return <Loader2 className="h-3 w-3 animate-spin" />;
        }
        if (error) {
            return <span className="text-destructive">Error</span>;
        }
        return `₹${walletBalance || 0}`;
    };

    return (
        <>
            <aside className={cn(
                "fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r transition-all duration-300 z-40",
                isExpanded ? "w-64" : "w-16",
                "lg:sticky lg:top-16"
            )}>
                <div className="flex flex-col items-start py-4 space-y-2">
                    <TooltipProvider delayDuration={0}>
                        {SIDEBAR_LINKS.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.to;

                            return (
                                <div key={link.label} className="w-full px-2">
                                    {!isExpanded ? (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Link
                                                    to={link.to}
                                                    onClick={(e) => handleLinkClick(link, e)}
                                                    className={cn(
                                                        "group relative flex items-center justify-center w-12 h-10 rounded-lg hover:bg-main/10",
                                                        isActive && "bg-main/10"
                                                    )}
                                                >
                                                    <Icon className={cn(
                                                        "h-5 w-5 text-muted-foreground group-hover:text-main",
                                                        isActive && "text-main"
                                                    )} />
                                                    {link.label === "Wallet" && (
                                                        <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                                            {renderWalletAmount()}
                                                        </span>
                                                    )}
                                                    <span className="sr-only">
                                                        {link.label}
                                                    </span>
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" className="flex items-center gap-2">
                                                <span>{link.label}</span>
                                                {link.label === "Wallet" && (
                                                    <span className="text-xs text-muted-foreground">
                                                        {renderWalletAmount()}
                                                    </span>
                                                )}
                                            </TooltipContent>
                                        </Tooltip>
                                    ) : (
                                        <Link
                                            to={link.to}
                                            onClick={(e) => handleLinkClick(link, e)}
                                            className={cn(
                                                "group flex items-center w-full px-3 py-2 rounded-lg hover:bg-main/10",
                                                isActive && "bg-main/10"
                                            )}
                                        >
                                            <Icon className={cn(
                                                "h-5 w-5 text-muted-foreground group-hover:text-main",
                                                isActive && "text-main"
                                            )} />
                                            <AnimatePresence>
                                                <motion.span
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                                    className={cn(
                                                        "ml-3 text-sm text-muted-foreground group-hover:text-main",
                                                        isActive && "text-main"
                                                    )}
                                                >
                                                    {link.label} {link.label === "Wallet" && (
                                                        <span className="text-xs text-muted-foreground">
                                                            {renderWalletAmount()}
                                                        </span>
                                                    )}
                                                </motion.span>
                                            </AnimatePresence>
                                        </Link>
                                    )}
                                </div>
                            );
                        })}
                    </TooltipProvider>
                </div>
            </aside>
            <WalletModal
                isOpen={isWalletOpen}
                onClose={() => setIsWalletOpen(false)}
            />
        </>
    );
};

export default SellerDashboardSidebar;
