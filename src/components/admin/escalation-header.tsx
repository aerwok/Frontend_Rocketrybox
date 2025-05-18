import { useEscalationHeader } from "@/hooks/useEscalationHeader";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * EscalationHeader Component
 * 
 * A dynamic header component that displays title and description based on the current route.
 * Features:
 * - Fetches header information from API
 * - Handles loading and error states
 * - Updates automatically on route changes
 * - Provides a clean and consistent UI
 * 
 * @returns {JSX.Element} The escalation header component
 */
const EscalationHeader = () => {
    const { headerInfo, loading, error } = useEscalationHeader();

    // Render loading state
    if (loading) {
        return (
            <div className="flex flex-col gap-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="flex flex-col gap-2">
                <h1 className="text-xl lg:text-2xl font-semibold text-red-500">
                    Error Loading Header
                </h1>
                <p className="text-muted-foreground">
                    {error}
                </p>
            </div>
        );
    }

    // Render header information
    return (
        <div className="flex flex-col gap-2">
            <h1 className="text-xl lg:text-2xl font-semibold">
                {headerInfo?.title || 'Escalation Management'}
            </h1>
            <p className="text-muted-foreground">
                {headerInfo?.description || 'Manage and track escalation tickets'}
            </p>
        </div>
    );
};

export default EscalationHeader; 