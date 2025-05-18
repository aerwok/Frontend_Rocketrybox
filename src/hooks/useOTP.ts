import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { authApi } from '../services/api/auth';
import { 
    VerifyOTPRequest, 
    ResendOTPRequest,
    UseOTPReturn
} from '../types/auth';

/**
 * Custom hook for managing OTP verification and resending
 * Handles OTP verification, resending, and countdown timer
 */
export const useOTP = (): UseOTPReturn => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [remainingTime, setRemainingTime] = useState<number>(0);

    // Start countdown timer when OTP is sent
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (remainingTime > 0) {
            timer = setInterval(() => {
                setRemainingTime((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [remainingTime]);

    /**
     * Verify OTP for email verification
     * @param data OTP verification data
     */
    const verifyOTP = useCallback(async (data: VerifyOTPRequest) => {
        setIsLoading(true);
        setError(null);
        try {
            await authApi.verifyOTP(data);
            toast.success('OTP verified successfully');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'OTP verification failed');
            toast.error('OTP verification failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Resend OTP for email verification
     * @param data Email data
     */
    const resendOTP = useCallback(async (data: ResendOTPRequest) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authApi.resendOTP(data);
            setRemainingTime(response.expiresIn);
            toast.success('OTP resent successfully');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to resend OTP');
            toast.error('Failed to resend OTP');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        isLoading,
        error,
        verifyOTP,
        resendOTP,
        remainingTime
    };
}; 