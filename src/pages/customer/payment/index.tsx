import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatCurrency, formatDate, formatAddress } from "@/lib/utils";
import { useOrderData } from "@/hooks/useOrderData";
import { usePayment } from "@/hooks/usePayment";
import { PAYMENT_METHODS } from "@/types/payment";

/**
 * Loading Spinner Component
 * Displays a loading state while fetching order data
 */
const LoadingSpinner = () => (
    <div className="container mx-auto py-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0070BA]" />
        <span className="ml-2 text-gray-600">Loading order details...</span>
    </div>
);

/**
 * Error Display Component
 * Shows error message and provides a way to return to order creation
 */
const ErrorDisplay = ({ error }: { error: string }) => (
    <div className="container mx-auto py-6 text-center">
        <p className="text-red-600">{error}</p>
        <Button 
            onClick={() => window.location.href = '/customer/create-order'}
            className="mt-4"
        >
            Return to Create Order
        </Button>
    </div>
);

/**
 * Payment Page Component
 * 
 * Displays payment interface with:
 * - Order details
 * - Payment method selection
 * - Price breakdown
 * - Payment processing
 */
const PaymentPage = () => {
    const { orderData, isLoading, error } = useOrderData();
    const { 
        selectedPayment, 
        setSelectedPayment, 
        isProcessing, 
        priceDetails, 
        total, 
        initializePayment 
    } = usePayment(orderData);
    const navigate = useNavigate();

    if (isLoading) return <LoadingSpinner />;
    if (error || !orderData) return <ErrorDisplay error={error || "Failed to load order details"} />;

    const handleChangeAddress = () => {
        navigate('/customer/create-order', { 
            state: { 
                editMode: 'address',
                awbNumber: orderData.awbNumber 
            } 
        });
    };

    const handleChangeOrder = () => {
        navigate('/customer/create-order', { 
            state: { 
                editMode: 'order',
                awbNumber: orderData.awbNumber 
            } 
        });
    };

    return (
        <div className="container mx-auto py-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Order Details */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Order Details</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-600">AWB Number:</span>
                            <span className="font-medium">{orderData.awbNumber}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Pickup Date:</span>
                            <span className="font-medium">{formatDate(orderData.pickupDate)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Shipping Partner:</span>
                            <span className="font-medium">{orderData.shippingPartner.name}</span>
                        </div>
                    </div>
                </div>

                {/* Delivery Address */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Delivery Address</h2>
                        <Button variant="outline" onClick={handleChangeAddress}>
                            Change
                        </Button>
                    </div>
                    <div className="space-y-2">
                        <p className="font-medium">{orderData.receiverName}</p>
                        <p>{formatAddress(orderData)}</p>
                        <p>{orderData.receiverMobile}</p>
                    </div>
                </div>

                {/* Package Details */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Package Details</h2>
                        <Button variant="outline" onClick={handleChangeOrder}>
                            Change
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-600">Weight</p>
                            <p className="font-medium">{orderData.weight} kg</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Dimensions</p>
                            <p className="font-medium">
                                {orderData.length} x {orderData.width} x {orderData.height} cm
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600">Package Type</p>
                            <p className="font-medium">{orderData.packageType}</p>
                        </div>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>
                    <RadioGroup
                        value={selectedPayment}
                        onValueChange={(value) => setSelectedPayment(value as any)}
                        className="space-y-4"
                    >
                        {Object.entries(PAYMENT_METHODS).map(([key, value]) => (
                            <div key={value} className="flex items-center space-x-2">
                                <RadioGroupItem value={value} id={value} />
                                <Label htmlFor={value}>{key}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                {/* Price Details */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Price Details</h2>
                    <div className="space-y-2">
                        {priceDetails.map((detail, index) => (
                            <div key={index} className="flex justify-between">
                                <span className="text-gray-600">{detail.label}</span>
                                <span>{formatCurrency(detail.value)}</span>
                            </div>
                        ))}
                        <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between font-semibold">
                                <span>Total Amount</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Button */}
                <Button
                    className="w-full"
                    disabled={!selectedPayment || isProcessing}
                    onClick={initializePayment}
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        `Pay ${formatCurrency(total)}`
                    )}
                </Button>
            </div>
        </div>
    );
};

export default PaymentPage;
