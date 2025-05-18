import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";
import { DateRange } from "react-day-picker";
import { useDateRange } from "@/hooks/useDateRange";
import { Skeleton } from "@/components/ui/skeleton";

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
    onDateChange?: (date: DateRange | undefined) => void;
}

/**
 * DateRangePicker Component
 * 
 * A reusable date range picker component that:
 * - Allows users to select a date range
 * - Handles loading and error states
 * - Persists selected date ranges
 * - Provides a clean UI for date selection
 * 
 * @param {DateRangePickerProps} props - Component props
 * @returns {JSX.Element} The date range picker component
 */
const DateRangePicker = ({
    className,
    onDateChange,
}: DateRangePickerProps) => {
    const { dateRange, setDateRange, loading, error, saveDateRange } = useDateRange();

    const handleDateSelect = async (newDateRange: DateRange | undefined) => {
        try {
            if (newDateRange) {
                await saveDateRange(newDateRange);
            }
            setDateRange(newDateRange);
            onDateChange?.(newDateRange);
        } catch (err) {
            // Error is already handled in the hook
            console.error('Failed to update date range:', err);
        }
    };

    // Render loading state
    if (loading) {
        return (
            <div className={cn("grid gap-2", className)}>
                <Skeleton className="h-10 w-[300px]" />
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className={cn("grid gap-2", className)}>
                <Button
                    variant="outline"
                    className="md:w-[300px] justify-start text-left font-normal text-red-500"
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Error loading date range
                </Button>
            </div>
        );
    }

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant="outline"
                        className={cn(
                            "md:w-[300px] justify-start text-left font-normal",
                            !dateRange && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                            dateRange.to ? (
                                <>
                                    {format(dateRange.from, "LLL dd, y")} -{" "}
                                    {format(dateRange.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(dateRange.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={handleDateSelect}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default DateRangePicker; 