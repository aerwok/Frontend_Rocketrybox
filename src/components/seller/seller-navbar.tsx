import { Link } from "react-router-dom";
import { useSellerProfile } from "@/hooks/useSellerProfile";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * SellerNavbar Component
 * 
 * This component renders the navigation bar for the seller interface, including:
 * - Company logo
 * - Loading states
 * - Error handling
 * 
 * @returns {JSX.Element} The rendered navigation bar
 */
const SellerNavbar = () => {
    const { profile, isLoading, error } = useSellerProfile();

    /**
     * Render the company logo with loading state
     * @returns {JSX.Element} Logo element
     */
    const renderLogo = () => {
        if (isLoading) {
            return (
                <div className="h-10 w-32 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            );
        }

        if (error) {
            return (
                <div className="h-10 w-32 flex items-center justify-center text-destructive">
                    Error
                </div>
            );
        }

        return (
            <img
                src={profile?.logo || "/icons/logo.svg"}
                alt={profile?.name || "Rocketry Box"}
                className={cn(
                    "h-10",
                    !profile?.logo && "opacity-50"
                )}
            />
        );
    };

    return (
        <div className="sticky top-0 z-50 bg-white border-b">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-center lg:justify-start h-16">
                    <Link 
                        to="/"
                        className="flex items-center space-x-2"
                    >
                        {renderLogo()}
                        {profile?.name && (
                            <span className="text-sm font-medium text-muted-foreground">
                                {profile.name}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SellerNavbar;
