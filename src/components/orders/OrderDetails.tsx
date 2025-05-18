import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrderDetails } from '@/hooks/useOrderDetails';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ArrowLeft, Download, RefreshCw } from 'lucide-react';
import { OrderStatus } from '@/services/api/orderData';

/**
 * OrderDetails Component
 * 
 * Displays detailed information about a specific order:
 * - Order status and timeline
 * - Customer information
 * - Order items
 * - Shipping details
 * - Payment information
 * - Loading states
 * - Error handling
 */
export function OrderDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { order, items, status, isLoading, error, refreshOrder } = useOrderDetails();

    // Get status badge color
    const getStatusColor = (status: OrderStatus): 'yellow' | 'blue' | 'purple' | 'indigo' | 'green' | 'red' | 'gray' => {
        switch (status) {
            case OrderStatus.PENDING:
                return 'yellow';
            case OrderStatus.CONFIRMED:
                return 'blue';
            case OrderStatus.PROCESSING:
                return 'purple';
            case OrderStatus.SHIPPED:
                return 'indigo';
            case OrderStatus.DELIVERED:
                return 'green';
            case OrderStatus.CANCELLED:
                return 'red';
            default:
                return 'gray';
        }
    };

    // Handle download label
    const handleDownloadLabel = async () => {
        try {
            // TODO: Implement label download functionality
            console.log('Downloading label for order:', id);
        } catch (error) {
            console.error('Error downloading label:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6">
                        <Skeleton className="h-4 w-24 mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                    </Card>
                    <Card className="p-6">
                        <Skeleton className="h-4 w-24 mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                    </Card>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/customer/orders')}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Orders
                    </Button>
                    <Button
                        variant="outline"
                        onClick={refreshOrder}
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Retry
                    </Button>
                </div>
                <div className="rounded-md bg-red-50 p-4">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/customer/orders')}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Orders
                    </Button>
                </div>
                <div className="rounded-md bg-yellow-50 p-4">
                    <p className="text-sm text-yellow-700">Order not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    onClick={() => navigate('/customer/orders')}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Orders
                </Button>
                <Button
                    variant="outline"
                    onClick={handleDownloadLabel}
                    className="flex items-center gap-2"
                >
                    <Download className="h-4 w-4" />
                    Download Label
                </Button>
            </div>

            {/* Order Status */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Order Status</h2>
                    <Badge
                        variant="secondary"
                        className={`bg-${getStatusColor(status as OrderStatus)}-100 text-${getStatusColor(status as OrderStatus)}-800`}
                    >
                        {status}
                    </Badge>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <p className="text-sm text-gray-500">Order ID</p>
                            <p className="font-medium">{order.id}</p>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-500">Order Date</p>
                            <p className="font-medium">{formatDate(new Date(order.createdAt))}</p>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-500">Total Amount</p>
                            <p className="font-medium">{formatCurrency(order.total)}</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Order Items */}
            <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Order Items</h2>
                <div className="space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                            <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium">{formatCurrency(item.price)}</p>
                                <p className="text-sm text-gray-500">
                                    Total: {formatCurrency(item.price * item.quantity)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Order Information */}
            <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Order Information</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">Customer ID</p>
                        <p className="font-medium">{order.customerId}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">Last Updated</p>
                        <p className="font-medium">{formatDate(new Date(order.updatedAt))}</p>
                    </div>
                </div>
            </Card>
        </div>
    );
} 