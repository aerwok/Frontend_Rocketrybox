import { useState } from 'react';
import { useCODOrders, useCODOrderFilters } from '../../../../hooks/useCODOrders';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../../../../components/ui/alert';
import { Input } from '../../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Loader2, Search, Filter, X } from 'lucide-react';
import { format } from 'date-fns';
import { CODOrderStatus } from '../../../../types/cod';

/**
 * COD Summary Component
 * Displays summary statistics for COD orders
 */
const CODSummary = ({ summary }: { summary: any }) => {
    if (!summary) return null;

    return (
        <div className="grid gap-4 md:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{summary.total}</div>
                    <p className="text-xs text-muted-foreground">
                        Total COD orders
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{summary.pending}</div>
                    <p className="text-xs text-muted-foreground">
                        Orders pending delivery
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">₹{summary.totalAmount}</div>
                    <p className="text-xs text-muted-foreground">
                        Total COD amount
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Collected</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">₹{summary.collectedAmount}</div>
                    <p className="text-xs text-muted-foreground">
                        Amount collected
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

/**
 * COD Filters Component
 * Handles filtering of COD orders
 */
const CODFilters = () => {
    const { filters, setFilters, applyFilters, resetFilters } = useCODOrderFilters();

    const handleSearch = (value: string) => {
        setFilters({ ...filters, search: value });
    };

    const handleStatusChange = (value: string) => {
        setFilters({ ...filters, status: value as CODOrderStatus });
    };

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
                <Input
                    placeholder="Search orders..."
                    value={filters.search || ''}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="max-w-sm"
                />
            </div>
            <div className="flex items-center gap-2">
                <Select
                    value={filters.status}
                    onValueChange={handleStatusChange}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All Status</SelectItem>
                        {Object.values(CODOrderStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                                {status.replace(/_/g, ' ').toLowerCase()}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={applyFilters}
                >
                    <Filter className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={resetFilters}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

/**
 * COD Orders Table Component
 * Displays list of COD orders
 */
const CODOrdersTable = () => {
    const { orders, isLoading, error, cancelCODOrder } = useCODOrders();

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

    if (orders.length === 0) {
        return (
            <Alert>
                <AlertTitle>No Orders</AlertTitle>
                <AlertDescription>No COD orders found</AlertDescription>
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
                        <TableHead>Delivery Date</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell>{order.orderId}</TableCell>
                            <TableCell>
                                <div>
                                    <div className="font-medium">{order.customerName}</div>
                                    <div className="text-sm text-gray-500">{order.customerPhone}</div>
                                </div>
                            </TableCell>
                            <TableCell>₹{order.amount}</TableCell>
                            <TableCell>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    order.status === CODOrderStatus.DELIVERED ? 'bg-green-100 text-green-800' :
                                    order.status === CODOrderStatus.FAILED ? 'bg-red-100 text-red-800' :
                                    order.status === CODOrderStatus.CANCELLED ? 'bg-gray-100 text-gray-800' :
                                    'bg-blue-100 text-blue-800'
                                }`}>
                                    {order.status.replace(/_/g, ' ').toLowerCase()}
                                </span>
                            </TableCell>
                            <TableCell>
                                {order.deliveryDate ? format(new Date(order.deliveryDate), 'PPP') : '-'}
                            </TableCell>
                            <TableCell>
                                {order.status === CODOrderStatus.PENDING && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => cancelCODOrder(order.id)}
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

/**
 * COD Page Component
 * Main component for the COD dashboard
 */
export default function CODPage() {
    const { summary } = useCODOrders();

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Cash on Delivery</h1>
            </div>

            <div className="space-y-8">
                <CODSummary summary={summary} />
                <Card>
                    <CardHeader>
                        <CardTitle>COD Orders</CardTitle>
                        <CardDescription>Manage your cash on delivery orders</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <CODFilters />
                        <CODOrdersTable />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 