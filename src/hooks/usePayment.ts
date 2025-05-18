import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { paymentService } from '@/services/api/payment';
import { OrderData, PaymentMethod, PriceDetail, RazorpayResponse } from '@/types/payment';

// Constants
const GST_RATE = 0.18;
const PLATFORM_FEE = 25;

interface UsePaymentReturn {
    selectedPayment: PaymentMethod | '';
    setSelectedPayment: (method: PaymentMethod | '') => void;
    isProcessing: boolean;
    priceDetails: PriceDetail[];
    total: number;
    initializePayment: () => Promise<void>;
}

/**
 * usePayment Hook
 * 
 * Manages payment state and operations:
 * - Payment method selection
 * - Price calculations
 * - Payment initialization
 * - Razorpay integration
 * - Error handling
 * 
 * @param orderData - Order data for payment calculation
 * @returns Payment state and operations
 */
export const usePayment = (orderData: OrderData | null): UsePaymentReturn => {
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | ''>('');
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    /**
     * Calculate price details for the order
     * @param data - Order data
     * @returns Array of price details
     */
    const calculatePriceDetails = useCallback((data: OrderData): PriceDetail[] => {
        const shippingCost = data.shippingPartner.rate;
        const gstAmount = Math.round(shippingCost * GST_RATE);
        
        return [
            { label: "Shipping Cost", value: shippingCost },
            { label: "GST", value: gstAmount },
            { label: "Insurance", value: 0 },
            { label: "Platform Fee", value: PLATFORM_FEE }
        ];
    }, []);

    const priceDetails = orderData ? calculatePriceDetails(orderData) : [];
    const total = priceDetails.reduce((acc, item) => acc + item.value, 0);

    /**
     * Initialize payment process
     * Creates payment order and opens Razorpay modal
     */
    const initializePayment = async () => {
        if (!selectedPayment || !orderData) return;

        setIsProcessing(true);
        try {
            // Create payment order
            const { orderId, keyId } = await paymentService.createPaymentOrder(
                total,
                orderData.awbNumber
            );

            // Initialize Razorpay
            const options = {
                key: keyId,
                amount: total * 100, // amount in paisa
                currency: "INR",
                name: "RocketryBox",
                description: `Order Payment - ${orderData.awbNumber}`,
                order_id: orderId,
                handler: async (response: RazorpayResponse) => {
                    try {
                        // Verify payment
                        await paymentService.verifyPayment({
                            ...response,
                            awbNumber: orderData.awbNumber
                        });

                        toast.success("Payment successful!");
                        navigate("/customer/orders");
                    } catch (error) {
                        toast.error("Payment verification failed. Please contact support.");
                    }
                },
                prefill: {
                    name: orderData.receiverName,
                    contact: orderData.receiverMobile,
                },
                theme: {
                    color: "#0070BA"
                },
                modal: {
                    ondismiss: () => {
                        setIsProcessing(false);
                    }
                }
            };

            const razorpay = new (window as any).Razorpay(options);
            razorpay.open();
        } catch (error) {
            setIsProcessing(false);
            const errorMessage = error instanceof Error 
                ? error.message 
                : "Payment initialization failed. Please try again.";
            toast.error(errorMessage);
        }
    };

    return {
        selectedPayment,
        setSelectedPayment,
        isProcessing,
        priceDetails,
        total,
        initializePayment
    };
}; 