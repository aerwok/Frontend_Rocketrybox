import React from 'react';
import { useComponent } from '@/hooks/useComponent';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

/**
 * Button Component
 * 
 * A customizable button component that:
 * - Supports multiple variants and sizes
 * - Shows loading state
 * - Supports icons
 * - Uses dynamic configuration from API
 * 
 * @param {ButtonProps} props - Component props
 * @returns {JSX.Element} The rendered button
 */
export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    className,
    children,
    disabled,
    ...props
}) => {
    const { config, isLoading: isConfigLoading, error } = useComponent('button');

    // Show error state
    if (error) {
        return (
            <button
                className={cn(
                    'inline-flex items-center justify-center rounded-md font-medium transition-colors',
                    'bg-red-100 text-red-700 hover:bg-red-200',
                    'disabled:opacity-50 disabled:pointer-events-none',
                    className
                )}
                disabled
                {...props}
            >
                Error: {error}
            </button>
        );
    }

    // Get styles from config or use defaults
    const styles = config?.styles || {
        variants: {
            primary: 'bg-blue-600 text-white hover:bg-blue-700',
            secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
            outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
            ghost: 'text-gray-700 hover:bg-gray-100',
        },
        sizes: {
            sm: 'h-8 px-3 text-sm',
            md: 'h-10 px-4',
            lg: 'h-12 px-6 text-lg',
        },
    };

    return (
        <button
            className={cn(
                'inline-flex items-center justify-center rounded-md font-medium transition-colors',
                styles.variants[variant],
                styles.sizes[size],
                'disabled:opacity-50 disabled:pointer-events-none',
                className
            )}
            disabled={disabled || isLoading || isConfigLoading}
            {...props}
        >
            {isLoading || isConfigLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <>
                    {leftIcon && <span className="mr-2">{leftIcon}</span>}
                    {children}
                    {rightIcon && <span className="ml-2">{rightIcon}</span>}
                </>
            )}
        </button>
    );
};

export default Button;
