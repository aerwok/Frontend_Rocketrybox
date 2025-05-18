import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useStats } from "@/hooks/useStats";

interface StatCardProps {
    title: string;
    subtitle?: string;
    statType: 'orders' | 'revenue' | 'returns' | 'customers';
    icon: LucideIcon;
    href: string;
    timeRange?: 'today' | 'week' | 'month' | 'year';
    iconClassName?: string;
}

/**
 * StatCard Component
 * 
 * This component displays a single statistic card with:
 * - Title and subtitle
 * - Current value
 * - Today's value (if applicable)
 * - Additional value (if applicable)
 * - Loading and error states
 * 
 * @param {StatCardProps} props - Component props
 * @returns {JSX.Element} The rendered card
 */
const StatCard = ({
    title,
    subtitle,
    statType,
    icon: Icon,
    href,
    timeRange = 'today',
    iconClassName
}: StatCardProps) => {
    const { data, isLoading, error } = useStats({ statType, timeRange });

    return (
        <Card className="px-4 py-3 bg-[#BCDDFF] h-[140px] flex flex-col justify-between relative group">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-medium">
                        {title}
                    </h3>
                    {subtitle && (
                        <p className="text-xs text-muted-foreground">
                            {subtitle}
                        </p>
                    )}
                </div>
                <div className={cn(
                    "rounded-full p-2 bg-white/20",
                    iconClassName
                )}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div>
                {isLoading ? (
                    <div className="flex items-center justify-center h-12">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-sm text-destructive">
                        {error}
                    </div>
                ) : data ? (
                    <>
                        {data.todayValue !== undefined && (
                            <div className="flex flex-col">
                                <p className="text-sm">
                                    Today's total:
                                </p>
                                <p className="text-2xl font-semibold">
                                    {data.todayValue}
                                </p>
                            </div>
                        )}
                        {data.additionalValue && (
                            <div className="flex flex-col">
                                <p className="text-sm">
                                    {data.additionalValue.label}:
                                </p>
                                <p className="text-2xl font-semibold">
                                    {data.additionalValue.value}
                                </p>
                            </div>
                        )}
                        {!data.todayValue && !data.additionalValue && (
                            <p className="text-2xl font-semibold">
                                {data.value}
                            </p>
                        )}
                    </>
                ) : null}
            </div>
            <Link
                to={href}
                className="absolute bottom-3 right-4 text-sm font-medium text-blue-700 hover:underline"
            >
                View
            </Link>
        </Card>
    );
};

export default StatCard; 