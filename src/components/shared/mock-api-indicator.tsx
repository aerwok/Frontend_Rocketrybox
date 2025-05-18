import React from 'react';
import { useApiMode } from '@/hooks/useApiMode';
import { Loader2 } from 'lucide-react';

/**
 * API Mode Indicator Component
 * 
 * This component displays the current API mode and allows toggling between:
 * - Real API mode
 * - Mock API mode
 * 
 * Features:
 * - Visual indicator of current mode
 * - Toggle functionality
 * - Loading and error states
 * - Feature flag management
 * 
 * @returns {JSX.Element | null} The rendered indicator or null if in real mode
 */
export const ApiModeIndicator: React.FC = () => {
    const { mode, config, isLoading, error, toggleMode } = useApiMode();

    // Don't show anything in real mode
    if (mode === 'real') return null;

    // Show loading state
    if (isLoading) {
        return (
            <div className="fixed bottom-2 right-2 z-50 bg-yellow-500 text-black text-xs font-bold py-1 px-2 rounded-lg shadow-md flex items-center gap-1 opacity-80">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading...
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="fixed bottom-2 right-2 z-50 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-lg shadow-md flex items-center gap-1 opacity-80">
                <span className="inline-block w-2 h-2 bg-white rounded-full"></span>
                Error: {error}
            </div>
        );
    }

    return (
        <div
            className="fixed bottom-2 right-2 z-50 bg-yellow-500 text-black text-xs font-bold py-1 px-2 rounded-lg shadow-md cursor-pointer flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity"
            onClick={toggleMode}
            title={`Click to switch to ${mode === 'mock' ? 'real' : 'mock'} API mode`}
        >
            <span className="inline-block w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
            {mode === 'mock' ? 'DEMO MODE' : 'REAL MODE'}
            {config?.lastUpdated && (
                <span className="text-[10px] opacity-75 ml-1">
                    (Updated: {new Date(config.lastUpdated).toLocaleTimeString()})
                </span>
            )}
        </div>
    );
};

export default ApiModeIndicator; 