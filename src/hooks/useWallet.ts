import { useState, useEffect } from 'react';
import { walletApi } from '@/services/api/wallet';
import { toast } from 'sonner';

export interface WalletBalance {
    walletBalance: number;
    remittanceBalance: number;
    lastRecharge: number;
}

export interface Transaction {
    transactionId: string;
    type: 'Credit' | 'Debit';
    amount: number;
    balance: number;
    date: string;
    status: 'pending' | 'completed' | 'failed';
    paymentMethod?: string;
}

interface UseWalletProps {
    pageSize?: number;
}

interface UseWalletReturn {
    walletBalance: WalletBalance | null;
    transactions: Transaction[];
    isLoadingBalance: boolean;
    isLoadingTransactions: boolean;
    isRecharging: boolean;
    hasMoreTransactions: boolean;
    error: string | null;
    rechargeWallet: (data: { amount: number; paymentMethod: string }) => Promise<void>;
    loadMoreTransactions: () => Promise<void>;
    refreshTransactions: () => Promise<void>;
}

/**
 * Custom hook for managing wallet functionality
 * 
 * This hook handles:
 * - Wallet balance fetching
 * - Transaction history with pagination
 * - Wallet recharge
 * - Loading and error states
 * 
 * @param {UseWalletProps} props - Hook configuration
 * @returns {UseWalletReturn} Wallet state and methods
 */
export const useWallet = ({ pageSize = 10 }: UseWalletProps = {}): UseWalletReturn => {
    const [walletBalance, setWalletBalance] = useState<WalletBalance | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoadingBalance, setIsLoadingBalance] = useState(true);
    const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
    const [isRecharging, setIsRecharging] = useState(false);
    const [hasMoreTransactions, setHasMoreTransactions] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);

    /**
     * Fetch wallet balance
     */
    const fetchBalance = async () => {
        try {
            setIsLoadingBalance(true);
            setError(null);
            const response = await walletApi.getBalance();
            setWalletBalance(response);
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Failed to fetch wallet balance');
            toast.error('Failed to fetch wallet balance');
        } finally {
            setIsLoadingBalance(false);
        }
    };

    /**
     * Fetch transactions with pagination
     */
    const fetchTransactions = async (isRefresh = false) => {
        try {
            setIsLoadingTransactions(true);
            setError(null);
            
            const currentPage = isRefresh ? 1 : page;
            const response = await walletApi.getTransactions({
                page: currentPage,
                pageSize,
            });

            if (isRefresh) {
                setTransactions(response.transactions);
                setPage(1);
            } else {
                setTransactions(prev => [...prev, ...response.transactions]);
                setPage(currentPage + 1);
            }

            setHasMoreTransactions(response.hasMore);
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Failed to fetch transactions');
            toast.error('Failed to fetch transactions');
        } finally {
            setIsLoadingTransactions(false);
        }
    };

    /**
     * Recharge wallet
     */
    const rechargeWallet = async (data: { amount: number; paymentMethod: string }) => {
        try {
            setIsRecharging(true);
            setError(null);
            await walletApi.recharge(data);
            await fetchBalance();
            toast.success('Wallet recharged successfully');
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Failed to recharge wallet');
            toast.error('Failed to recharge wallet');
            throw error;
        } finally {
            setIsRecharging(false);
        }
    };

    /**
     * Load more transactions
     */
    const loadMoreTransactions = async () => {
        if (!isLoadingTransactions && hasMoreTransactions) {
            await fetchTransactions();
        }
    };

    /**
     * Refresh transactions
     */
    const refreshTransactions = async () => {
        await fetchTransactions(true);
    };

    // Fetch initial data
    useEffect(() => {
        fetchBalance();
        fetchTransactions(true);
    }, []);

    return {
        walletBalance,
        transactions,
        isLoadingBalance,
        isLoadingTransactions,
        isRecharging,
        hasMoreTransactions,
        error,
        rechargeWallet,
        loadMoreTransactions,
        refreshTransactions,
    };
}; 