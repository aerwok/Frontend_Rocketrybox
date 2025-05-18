import { useParams } from 'react-router-dom';
import { useOrder } from '../../../../hooks/useOrders';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../../../../components/ui/alert';
import { Loader2, ArrowLeft, Printer, Download } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { OrderStatus, PaymentStatus } from '../../../../types/order';

/**
 * Order Status Badge Component
 * Displays order status with appropriate styling
 */
const OrderStatusBadge = ({ status }: { status: OrderStatus }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
    status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-800' :
    status === OrderStatus.CANCELLED ? 'bg-red-100 text-red-800' :
    status === OrderStatus.SHIPPED ? 'bg-blue-100 text-blue-800' :
    'bg-yellow-100 text-yellow-800'
  }`}>
    {status.toLowerCase().replace(/_/g, ' ')}
  </span>
);

/**
 * Payment Status Badge Component
 * Displays payment status with appropriate styling
 */
const PaymentStatusBadge = ({ status }: { status: PaymentStatus }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
    status === PaymentStatus.PAID ? 'bg-green-100 text-green-800' :
    status === PaymentStatus.FAILED ? 'bg-red-100 text-red-800' :
    'bg-yellow-100 text-yellow-800'
  }`}>
    {status.toLowerCase()}
  </span>
);

/**
 * Order Detail Page Component
 * Displays detailed information about a single order
 */
export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const {
    order,
    isLoading,
    error,
    updateOrder,
    cancelOrder,
    generateShippingLabel
  } = useOrder(id || null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!order) {
    return (
      <Alert>
        <AlertTitle>Not Found</AlertTitle>
        <AlertDescription>Order not found</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <Link to="/seller/dashboard/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Order {order.orderId}</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => generateShippingLabel()}
          >
            <Printer className="h-4 w-4 mr-2" />
            Print Label
          </Button>
          <Button
            variant="outline"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>Basic information about the order</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-500">Order ID</div>
                <div>{order.orderId}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Date</div>
                <div>{format(new Date(order.createdAt), 'PPP')}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Status</div>
                <OrderStatusBadge status={order.status} />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Payment</div>
                <PaymentStatusBadge status={order.paymentStatus} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
            <CardDescription>Contact and shipping details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Name</div>
              <div>{order.customerName}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Email</div>
              <div>{order.customerEmail}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Phone</div>
              <div>{order.customerPhone}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Shipping Address</div>
              <div className="mt-1">
                {order.shippingAddress.addressLine1}<br />
                {order.shippingAddress.addressLine2 && (
                  <>{order.shippingAddress.addressLine2}<br /></>
                )}
                {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                {order.shippingAddress.pincode}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
            <CardDescription>Products in this order</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-4 border-b last:border-0">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    {item.variant && (
                      <div className="text-sm text-gray-500">Variant: {item.variant}</div>
                    )}
                    {item.sku && (
                      <div className="text-sm text-gray-500">SKU: {item.sku}</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div>₹{item.price.toFixed(2)} × {item.quantity}</div>
                    <div className="font-medium">₹{item.total.toFixed(2)}</div>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4 border-t">
                <div>Subtotal</div>
                <div>₹{order.subtotal.toFixed(2)}</div>
              </div>
              <div className="flex justify-between items-center">
                <div>Shipping</div>
                <div>₹{order.shippingCost.toFixed(2)}</div>
              </div>
              <div className="flex justify-between items-center">
                <div>Tax</div>
                <div>₹{order.tax.toFixed(2)}</div>
              </div>
              <div className="flex justify-between items-center font-bold">
                <div>Total</div>
                <div>₹{order.total.toFixed(2)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 