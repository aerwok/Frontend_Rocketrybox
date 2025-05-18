import { api } from './index';
import { WalletBalance, Transaction } from '@/hooks/useWallet';

/**
 * Wallet API service
 * 
 * This service handles all wallet-related API calls:
 * - Balance management
 * - Transaction history
 * - Recharge operations
 * 
 * TODO: Replace placeholder endpoints with actual API endpoints when ready
 */
export const walletApi = {
    /**
     * Get wallet balance
     * @returns {Promise<WalletBalance>} Wallet balance information
     */
    getBalance: (): Promise<WalletBalance> => {
        return api.get('/wallet/balance');
    },

    /**
     * Get transaction history
     * @param {Object} params - Pagination parameters
     * @returns {Promise<{ transactions: Transaction[]; hasMore: boolean }>} Transaction history
     */
    getTransactions: (params: { page: number; pageSize: number }): Promise<{ transactions: Transaction[]; hasMore: boolean }> => {
        return api.get('/wallet/transactions', { params });
    },

    /**
     * Recharge wallet
     * @param {Object} data - Recharge data
     * @returns {Promise<void>} Recharge result
     */
    recharge: (data: { amount: number; paymentMethod: string }): Promise<void> => {
        return api.post('/wallet/recharge', data);
    },

    /**
     * Get transaction details
     * @param {string} transactionId - Transaction ID
     * @returns {Promise<Transaction>} Transaction details
     */
    getTransactionDetails: (transactionId: string): Promise<Transaction> => {
        return api.get(`/wallet/transactions/${transactionId}`);
    },

    /**
     * Cancel transaction
     * @param {string} transactionId - Transaction ID
     * @returns {Promise<void>} Cancellation result
     */
    cancelTransaction: (transactionId: string): Promise<void> => {
        return api.post(`/wallet/transactions/${transactionId}/cancel`);
    },
}; 