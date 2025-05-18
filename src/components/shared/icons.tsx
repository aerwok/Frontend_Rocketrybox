import { LucideProps } from "lucide-react";
import { useIcons } from "@/hooks/useIcons";
import { Loader2 } from "lucide-react";

/**
 * Icons Component
 * 
 * This component provides a collection of SVG icons with:
 * - Dynamic content from API
 * - Loading and error states
 * - TypeScript support
 * - Lucide props compatibility
 * 
 * @returns {Record<string, (props: LucideProps) => JSX.Element>} Icon components
 */
const Icons = () => {
    const { icons, isLoading, error } = useIcons();

    if (isLoading) {
        return {
            team: (props: LucideProps) => (
                <div className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin" {...props} />
                </div>
            ),
        };
    }

    if (error) {
        console.error('Failed to load icons:', error);
        return {
            team: (props: LucideProps) => (
                <div className="flex items-center justify-center text-red-500">
                    <span className="text-xs">!</span>
                </div>
            ),
        };
    }

    // Create icon components from API data
    const iconComponents: Record<string, (props: LucideProps) => JSX.Element> = {};

    Object.entries(icons).forEach(([name, iconData]) => {
        iconComponents[name] = (props: LucideProps) => (
            <svg
                {...props}
                width={iconData.width || props.width}
                height={iconData.height || props.height}
                viewBox={iconData.viewBox}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {iconData.paths.map((path, index) => (
                    <path key={index} d={path} fill="currentColor" />
                ))}
            </svg>
        );
    });

    return iconComponents;
};

export default Icons();
