import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { 
    sellerOrderService, 
    OrderData, 
    OrderFilters, 
    OrderStats 
} from '@/services/seller-order.service';
import { orderDataApi, OrderItem, OrderStatus } from '@/services/api/orderData';

// Mock data for testing
const mockOrders: OrderData[] = [
    {
        orderId: "ORD-2025-001",
        date: "2024-02-20",
        customer: "Rahul Sharma",
        contact: "9876543210",
        items: [
            {
                name: "Gaming Laptop",
                sku: "LAP-001",
                quantity: 1,
                price: 97497.00
            }
        ],
        amount: "97497.00",
        payment: "COD",
        chanel: "MANUAL",
        weight: "2.5",
        tags: "Gaming",
        action: "Ship",
        whatsapp: "Message Delivered",
        status: "not-booked",
        awbNumber: undefined,
        pincode: "400001"
    },
    {
        orderId: "ORD-2025-002",
        date: "2024-02-19",
        customer: "Priya Patel",
        contact: "9876543211",
        items: [
            {
                name: "Wireless Mouse",
                sku: "WM001",
                quantity: 1,
                price: 7999.00
            },
            {
                name: "Keyboard",
                sku: "KB001",
                quantity: 1,
                price: 8000.00
            }
        ],
        amount: "15999.00",
        payment: "Prepaid",
        chanel: "EXCEL",
        weight: "1.2",
        tags: "Electronics",
        action: "Processing",
        whatsapp: "Message Read",
        status: "processing",
        awbNumber: "AWB123456",
        pincode: "400002"
    },
    {
        orderId: "ORD-2025-003",
        date: "2024-02-19",
        customer: "Amit Kumar",
        contact: "9876543212",
        items: [
            {
                name: "Premium Headphones",
                sku: "PH001",
                quantity: 1,
                price: 49999.00
            }
        ],
        amount: "49999.00",
        payment: "COD",
        chanel: "SHOPIFY",
        weight: "3.5",
        tags: "Premium",
        action: "Pending",
        whatsapp: "Order Confirm",
        status: "booked",
        awbNumber: "AWB123457",
        pincode: "400003"
    },
    {
        orderId: "ORD-2025-004",
        date: "2024-02-18",
        customer: "Neha Singh",
        contact: "9876543213",
        items: [
            {
                name: "Phone Case",
                sku: "PC001",
                quantity: 2,
                price: 999.00
            },
            {
                name: "Screen Guard",
                sku: "SG001",
                quantity: 1,
                price: 11001.00
            }
        ],
        amount: "12999.00",
        payment: "Prepaid",
        chanel: "WOOCOMMERCE",
        weight: "1.8",
        tags: "Accessories",
        action: "Processing",
        whatsapp: "Message Read",
        status: "processing",
        awbNumber: "AWB123458",
        pincode: "400004"
    },
    {
        orderId: "ORD-2025-005",
        date: "2024-02-18",
        customer: "Vikram Verma",
        contact: "9876543214",
        items: [
            {
                name: "Bluetooth Speaker",
                sku: "BS001",
                quantity: 1,
                price: 7999.00
            }
        ],
        amount: "7999.00",
        payment: "COD",
        chanel: "AMAZON",
        weight: "0.8",
        tags: "Electronics",
        action: "Cancelled",
        whatsapp: "Message Delivered",
        status: "shipment-cancelled",
        awbNumber: "AWB123459",
        pincode: "400005"
    },
    {
        orderId: "ORD-2025-006",
        date: "2024-02-17",
        customer: "Anjali Gupta",
        contact: "9876543215",
        items: [
            {
                name: "Gaming Mouse",
                sku: "GM001",
                quantity: 1,
                price: 12499.00
            },
            {
                name: "Gaming Keyboard",
                sku: "GK001",
                quantity: 1,
                price: 12500.00
            }
        ],
        amount: "24999.00",
        payment: "Prepaid",
        chanel: "FLIPKART",
        weight: "1.5",
        tags: "Gaming",
        action: "Error",
        whatsapp: "Message Read",
        status: "error",
        awbNumber: "AWB123460",
        pincode: "400006"
    },
    {
        orderId: "ORD-2025-007",
        date: "2024-02-17",
        customer: "Rajesh Kumar",
        contact: "9876543216",
        items: [
            {
                name: "Premium Smartwatch",
                sku: "PS001",
                quantity: 1,
                price: 39999.00
            }
        ],
        amount: "39999.00",
        payment: "COD",
        chanel: "OPENCART",
        weight: "2.2",
        tags: "Premium",
        action: "In Transit",
        whatsapp: "Order Confirm",
        status: "not-booked",
        awbNumber: undefined,
        pincode: "400007"
    },
    {
        orderId: "ORD-2025-008",
        date: "2024-02-16",
        customer: "Meera Shah",
        contact: "9876543217",
        items: [
            {
                name: "Power Bank",
                sku: "PB001",
                quantity: 1,
                price: 3999.00
            },
            {
                name: "USB Cable",
                sku: "UC001",
                quantity: 1,
                price: 5000.00
            }
        ],
        amount: "8999.00",
        payment: "Prepaid",
        chanel: "API",
        weight: "1.0",
        tags: "Accessories",
        action: "Processing",
        whatsapp: "Order Cancelled",
        status: "processing",
        awbNumber: "AWB123461",
        pincode: "400008"
    },
    {
        orderId: "ORD-2025-009",
        date: "2024-02-16",
        customer: "Arun Reddy",
        contact: "9876543218",
        items: [
            {
                name: "Wireless Earbuds",
                sku: "WE001",
                quantity: 1,
                price: 15999.00
            }
        ],
        amount: "15999.00",
        payment: "COD",
        chanel: "MANUAL",
        weight: "1.3",
        tags: "Electronics",
        action: "Pending",
        whatsapp: "Message Delivered",
        status: "booked",
        awbNumber: "AWB123462",
        pincode: "400009"
    },
    {
        orderId: "ORD-2025-010",
        date: "2024-02-15",
        customer: "Pooja Sharma",
        contact: "9876543219",
        items: [
            {
                name: "Gaming Console",
                sku: "GC001",
                quantity: 1,
                price: 29999.00
            },
            {
                name: "Game Controller",
                sku: "GCT001",
                quantity: 2,
                price: 0.00
            }
        ],
        amount: "29999.00",
        payment: "Prepaid",
        chanel: "EXCEL",
        weight: "2.0",
        tags: "Gaming",
        action: "Cancelled",
        whatsapp: "Message Read",
        status: "cancelled",
        awbNumber: "AWB123463",
        pincode: "400010"
    }
];

const USE_MOCK_DATA = true; // Set to true to use mock data for testing

interface OrderDataState {
    loading: boolean;
    error: string | null;
    orders: OrderData[] | null;
    stats: OrderStats | null;
    filters: OrderFilters;
    selectedOrders: string[];
}

interface UseOrderDataReturn {
    // Order data state
    orders: OrderData[];
    totalOrders: number;
    currentPage: number;
    isLoading: boolean;
    error: string | null;

    // Order data operations
    fetchOrders: (page?: number, limit?: number, filters?: OrderFilters) => Promise<void>;
    getOrder: (orderId: string) => Promise<OrderData>;
    getOrderStatus: (orderId: string) => Promise<OrderStatus>;
    getOrderItems: (orderId: string) => Promise<OrderItem[]>;
    getOrderStats: () => Promise<{ total: number; byStatus: Record<OrderStatus, number> }>;
}

/**
 * useOrderData Hook
 * 
 * Manages order data state and operations:
 * - Fetch orders with pagination and filters
 * - Get order details
 * - Get order status
 * - Get order items
 * - Get order statistics
 * - Loading and error states
 * 
 * @returns {UseOrderDataReturn} Order data state and operations
 */
export const useOrderData = (): UseOrderDataReturn => {
    const [orders, setOrders] = useState<OrderData[]>([]);
    const [totalOrders, setTotalOrders] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch orders with pagination and filters
     * @param {number} page - Page number
     * @param {number} limit - Items per page
     * @param {OrderFilters} filters - Order filters
     */
    const fetchOrders = useCallback(async (page: number = 1, limit: number = 10, filters?: OrderFilters) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await orderDataApi.getOrders(page, limit, filters);
            setOrders(response.data.items);
            setTotalOrders(response.data.total);
            setCurrentPage(page);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch orders');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Get order details
     * @param {string} orderId - Order ID
     * @returns {Promise<OrderData>} Order details
     */
    const getOrder = useCallback(async (orderId: string): Promise<OrderData> => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await orderDataApi.getOrder(orderId);
            return response.data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch order details');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Get order status
     * @param {string} orderId - Order ID
     * @returns {Promise<OrderStatus>} Order status
     */
    const getOrderStatus = useCallback(async (orderId: string): Promise<OrderStatus> => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await orderDataApi.getOrderStatus(orderId);
            return response.data.status;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch order status');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Get order items
     * @param {string} orderId - Order ID
     * @returns {Promise<OrderItem[]>} Order items
     */
    const getOrderItems = useCallback(async (orderId: string): Promise<OrderItem[]> => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await orderDataApi.getOrderItems(orderId);
            return response.data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch order items');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Get order statistics
     * @returns {Promise<{ total: number; byStatus: Record<OrderStatus, number> }>} Order statistics
     */
    const getOrderStats = useCallback(async (): Promise<{ total: number; byStatus: Record<OrderStatus, number> }> => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await orderDataApi.getOrderStats();
            return response.data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch order statistics');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial fetch of orders
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return {
        orders,
        totalOrders,
        currentPage,
        isLoading,
        error,
        fetchOrders,
        getOrder,
        getOrderStatus,
        getOrderItems,
        getOrderStats,
    };
}; 