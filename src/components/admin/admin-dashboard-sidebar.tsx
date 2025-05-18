import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/use-sidebar-store";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useSidebarMenu } from "@/hooks/useSidebarMenu";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * AdminDashboardSidebar Component
 * 
 * A responsive sidebar component for the admin dashboard that displays navigation links
 * with loading states and error handling. The sidebar can be collapsed/expanded.
 */
const AdminDashboardSidebar = () => {
    const { pathname } = useLocation();
    const isExpanded = useSidebarStore((state) => state.isExpanded);
    const { menuItems, loading, error } = useSidebarMenu();

    // Render loading skeleton when data is being fetched
    if (loading) {
        return (
            <aside className={cn(
                "fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r transition-all duration-300 z-40",
                isExpanded ? "w-64" : "w-16",
                "lg:sticky lg:top-16"
            )}>
                <div className="flex flex-col items-start px-2 pt-4 space-y-1">
                    {[...Array(12)].map((_, index) => (
                        <Skeleton key={index} className={cn(
                            "h-10 rounded-lg",
                            isExpanded ? "w-full" : "w-10"
                        )} />
                    ))}
                </div>
            </aside>
        );
    }

    // Render error state
    if (error) {
        return (
            <aside className={cn(
                "fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r transition-all duration-300 z-40",
                isExpanded ? "w-64" : "w-16",
                "lg:sticky lg:top-16"
            )}>
                <div className="flex items-center justify-center h-full">
                    <p className="text-red-500 text-sm">Failed to load menu items</p>
                </div>
            </aside>
        );
    }

    return (
        <aside className={cn(
            "fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r transition-all duration-300 z-40",
            isExpanded ? "w-64" : "w-16",
            "lg:sticky lg:top-16"
        )}>
            <div className={cn(
                "flex flex-col items-start px-2 pt-4 space-y-1",
                isExpanded && "min-w-[256px]"
            )}>
                <TooltipProvider delayDuration={0}>
                    {menuItems.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.to;

                        return (
                            <div key={link.label} className="w-full mx-auto">
                                {!isExpanded ? (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link
                                                to={link.to}
                                                className={cn(
                                                    "group relative flex items-center justify-center size-10 rounded-lg hover:bg-main/10 mx-auto",
                                                    isActive && "bg-main/10"
                                                )}
                                            >
                                                <Icon className={cn(
                                                    "h-5 w-5 text-muted-foreground group-hover:text-main",
                                                    isActive && "text-main"
                                                )} />
                                                <span className="sr-only">{link.label}</span>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">
                                            {link.label}
                                        </TooltipContent>
                                    </Tooltip>
                                ) : (
                                    <Link
                                        to={link.to}
                                        className={cn(
                                            "group relative flex items-center px-3 h-10 w-full rounded-lg hover:bg-main/10",
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
                                                {link.label}
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
    );
};

export default AdminDashboardSidebar; 