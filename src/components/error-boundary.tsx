import React from 'react';
import { Button } from './ui/button';
import { useError } from '@/hooks/useError';
import { Loader2 } from 'lucide-react';

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
}

/**
 * ErrorBoundary Component
 * 
 * A React error boundary component that:
 * - Catches JavaScript errors in child components
 * - Reports errors to the backend
 * - Shows a fallback UI
 * - Provides error recovery options
 * 
 * @param {Props} props - Component props
 * @returns {JSX.Element} The rendered error boundary
 */
class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Use the useError hook through a wrapper component
        ErrorReporter.reportError(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <ErrorFallback />;
        }

        return this.props.children;
    }
}

/**
 * Error Reporter Component
 * 
 * A wrapper component that uses the useError hook to report errors
 * This is necessary because hooks can't be used directly in class components
 */
const ErrorReporter: React.FC<{ error?: Error; errorInfo?: React.ErrorInfo }> = ({ error, errorInfo }) => {
    const { reportError } = useError();

    React.useEffect(() => {
        if (error && errorInfo) {
            reportError(error, errorInfo);
        }
    }, [error, errorInfo, reportError]);

    return null;
};

/**
 * Error Fallback Component
 * 
 * Displays the error UI with:
 * - Error message
 * - Recovery options
 * - Loading state
 */
const ErrorFallback: React.FC = () => {
    const { error, errorReport, isLoading, clearErrorHistory } = useError();

    const handleReload = () => {
        window.location.reload();
    };

    const handleClearHistory = async () => {
        await clearErrorHistory();
        window.location.reload();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-4 p-8 max-w-md">
                <h1 className="text-2xl font-bold text-destructive">Something went wrong</h1>
                
                {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Reporting error...</span>
                    </div>
                ) : (
                    <>
                        <p className="text-muted-foreground">
                            {error?.message || 'An unexpected error occurred'}
                        </p>
                        {errorReport && (
                            <p className="text-sm text-muted-foreground">
                                Error ID: {errorReport.id}
                            </p>
                        )}
                        <div className="flex flex-col space-y-2">
                            <Button
                                onClick={handleReload}
                                variant="outline"
                            >
                                Reload Page
                            </Button>
                            <Button
                                onClick={handleClearHistory}
                                variant="ghost"
                                className="text-sm"
                            >
                                Clear Error History
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ErrorBoundary; 