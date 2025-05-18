import { useDashboard, useDashboardFilters } from '../../../../hooks/useDashboard';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../../../../components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Loader2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { OrderStatus, RecentOrder, TopProduct } from '../../../../types/dashboard';

/**
 * Dashboard Summary Component
 * Displays summary statistics for the dashboard
 */
const DashboardSummary = ({ summary }: { summary: any }) => {
    if (!summary) return null;

    return (
        <div className="grid gap-4 md:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{summary.totalOrders}</div>
                    <p className="text-xs text-muted-foreground">
                        Total orders received
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${summary.totalRevenue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                        Total revenue generated
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{summary.totalCustomers}</div>
                    <p className="text-xs text-muted-foreground">
                        Total registered customers
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{summary.totalProducts}</div>
                    <p className="text-xs text-muted-foreground">
                        Total products in catalog
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

/**
 * Dashboard Filters Component
 * Handles filtering of dashboard data
 */
const DashboardFilters = () => {
    const { filters, setFilters, applyFilters, resetFilters } = useDashboardFilters();

    const handlePeriodChange = (value: string) => {
        setFilters({ ...filters, period: value as 'daily' | 'weekly' | 'monthly' | 'yearly' });
    };

    return (
        <div className="flex items-center gap-4">
            <Select
                value={filters.period}
                onValueChange={handlePeriodChange}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
            </Select>
            <Button
                variant="outline"
                size="sm"
                onClick={applyFilters}
            >
                Apply Filters
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
            >
                Reset
            </Button>
        </div>
    );
};

/**
 * Recent Orders Component
 * Displays list of recent orders
 */
const RecentOrders = ({ orders }: { orders: RecentOrder[] | undefined }) => {
    if (!orders?.length) {
        return (
            <Alert>
                <AlertTitle>No Orders</AlertTitle>
                <AlertDescription>No recent orders found</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order: RecentOrder) => (
                        <TableRow key={order.id}>
                            <TableCell>{order.orderId}</TableCell>
                            <TableCell>{order.customerName}</TableCell>
                            <TableCell>${order.amount.toFixed(2)}</TableCell>
                            <TableCell>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-800' :
                                    order.status === OrderStatus.CANCELLED ? 'bg-red-100 text-red-800' :
                                    order.status === OrderStatus.SHIPPED ? 'bg-blue-100 text-blue-800' :
                                    order.status === OrderStatus.PROCESSING ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {order.status.toLowerCase()}
                                </span>
                            </TableCell>
                            <TableCell>
                                {format(new Date(order.createdAt), 'PPP')}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

/**
 * Top Products Component
 * Displays list of top selling products
 */
const TopProducts = ({ products }: { products: TopProduct[] | undefined }) => {
    if (!products?.length) {
        return (
            <Alert>
                <AlertTitle>No Products</AlertTitle>
                <AlertDescription>No top products found</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Sales</TableHead>
                        <TableHead>Revenue</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product: TopProduct) => (
                        <TableRow key={product.id}>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-8 w-8 rounded-md object-cover"
                                    />
                                    <span>{product.name}</span>
                                </div>
                            </TableCell>
                            <TableCell>${product.price.toFixed(2)}</TableCell>
                            <TableCell>{product.stock}</TableCell>
                            <TableCell>{product.sales}</TableCell>
                            <TableCell>${product.revenue.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

/**
 * Home Page Component
 * Main component for the seller dashboard
 */
export default function HomePage() {
    const { data, isLoading, error, refreshDashboard } = useDashboard();

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

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshDashboard}
                >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>

            <div className="space-y-8">
                <DashboardSummary summary={data?.summary} />
                <Card>
                    <CardHeader>
                        <CardTitle>Sales Overview</CardTitle>
                        <CardDescription>View your sales data and statistics</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <DashboardFilters />
                        {/* Sales chart will be added here when the backend is ready */}
                    </CardContent>
                </Card>
                <div className="grid gap-8 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Orders</CardTitle>
                            <CardDescription>Latest orders from your customers</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RecentOrders orders={data?.recentOrders} />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Products</CardTitle>
                            <CardDescription>Your best selling products</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TopProducts products={data?.topProducts} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 