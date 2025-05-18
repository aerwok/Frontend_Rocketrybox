import { useState, useCallback } from 'react';
import { OrderItem } from '@/services/api/order';

interface UseOrderItemsReturn {
    // Order items state
    items: OrderItem[];
    isLoading: boolean;
    error: string | null;

    // Order items operations
    addItem: (item: OrderItem) => void;
    removeItem: (itemId: string) => void;
    updateItemQuantity: (itemId: string, quantity: number) => void;
    clearItems: () => void;
    getItemById: (itemId: string) => OrderItem | undefined;
    getItemQuantity: (itemId: string) => number;
    getTotalItems: () => number;
    getSubtotal: () => number;
}

/**
 * useOrderItems Hook
 * 
 * Manages order items state and operations:
 * - Add/remove items
 * - Update item quantities
 * - Calculate totals
 * - Loading and error states
 * 
 * @returns {UseOrderItemsReturn} Order items state and operations
 */
export const useOrderItems = (): UseOrderItemsReturn => {
    const [items, setItems] = useState<OrderItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Add item to order
     * @param {OrderItem} item - Item to add
     */
    const addItem = useCallback((item: OrderItem) => {
        try {
            setError(null);
            setItems(prev => {
                const existingItem = prev.find(i => i.id === item.id);
                if (existingItem) {
                    return prev.map(i =>
                        i.id === item.id
                            ? { ...i, quantity: i.quantity + item.quantity }
                            : i
                    );
                }
                return [...prev, item];
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add item');
            throw err;
        }
    }, []);

    /**
     * Remove item from order
     * @param {string} itemId - ID of item to remove
     */
    const removeItem = useCallback((itemId: string) => {
        try {
            setError(null);
            setItems(prev => prev.filter(item => item.id !== itemId));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to remove item');
            throw err;
        }
    }, []);

    /**
     * Update item quantity
     * @param {string} itemId - ID of item to update
     * @param {number} quantity - New quantity
     */
    const updateItemQuantity = useCallback((itemId: string, quantity: number) => {
        try {
            setError(null);
            if (quantity < 1) {
                removeItem(itemId);
                return;
            }
            setItems(prev =>
                prev.map(item =>
                    item.id === itemId ? { ...item, quantity } : item
                )
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update item quantity');
            throw err;
        }
    }, [removeItem]);

    /**
     * Clear all items
     */
    const clearItems = useCallback(() => {
        try {
            setError(null);
            setItems([]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to clear items');
            throw err;
        }
    }, []);

    /**
     * Get item by ID
     * @param {string} itemId - Item ID
     * @returns {OrderItem | undefined} Found item
     */
    const getItemById = useCallback(
        (itemId: string): OrderItem | undefined => {
            return items.find(item => item.id === itemId);
        },
        [items]
    );

    /**
     * Get item quantity
     * @param {string} itemId - Item ID
     * @returns {number} Item quantity
     */
    const getItemQuantity = useCallback(
        (itemId: string): number => {
            const item = getItemById(itemId);
            return item?.quantity || 0;
        },
        [getItemById]
    );

    /**
     * Get total number of items
     * @returns {number} Total items
     */
    const getTotalItems = useCallback((): number => {
        return items.reduce((total, item) => total + item.quantity, 0);
    }, [items]);

    /**
     * Get order subtotal
     * @returns {number} Order subtotal
     */
    const getSubtotal = useCallback((): number => {
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
    }, [items]);

    return {
        items,
        isLoading,
        error,
        addItem,
        removeItem,
        updateItemQuantity,
        clearItems,
        getItemById,
        getItemQuantity,
        getTotalItems,
        getSubtotal,
    };
}; 