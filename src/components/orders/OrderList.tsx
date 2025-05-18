import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrderData } from '@/hooks/useOrderData';
import { useOrderFilters } from '@/hooks/useOrderFilters';
import { OrderStatus } from '@/services/api/orderData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDate } from '@/lib/utils';

/**
 * OrderList Component
 * 
 * Displays a list of orders with filtering and pagination:
 * - Status filter
 * - Search functionality
 * - Date range filter
 * - Order details view
 * - Loading states
 * - Error handling
 */
export function OrderList() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const { orders, totalOrders, isLoading, error } = useOrderData();
    const {
        selectedStatus,
        searchQuery,
        dateRange,
        updateStatus,
        updateSearchQuery,
        updateDateRange,
        clearFilters,
    } = useOrderFilters();

    // Handle status change
    const handleStatusChange = (status: OrderStatus | null) => {
        updateStatus(status);
        setPage(1);
    };

    // Handle search
    const handleSearch = (query: string) => {
        updateSearchQuery(query);
        setPage(1);
    };

    // Handle date range change
    const handleDateRangeChange = (startDate: string | null, endDate: string | null) => {
        updateDateRange(startDate, endDate);
        setPage(1);
    };

    // Handle order click
    const handleOrderClick = (orderId: string) => {
        navigate(`/customer/orders/${orderId}`);
    };

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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Orders</h1>
                <Button onClick={() => navigate('/customer/create-order')}>
                    Create Order
                </Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <Select
                    value={selectedStatus || ''}
                    onChange={(value) => handleStatusChange(value as OrderStatus | null)}
                    options={[
                        { value: '', label: 'All Statuses' },
                        ...Object.values(OrderStatus).map((status) => ({
                            value: status,
                            label: status.charAt(0).toUpperCase() + status.slice(1),
                        })),
                    ]}
                />
                <Input
                    type="text"
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                <DatePicker
                    startDate={dateRange.startDate}
                    endDate={dateRange.endDate}
                    onChange={handleDateRangeChange}
                />
                <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                </Button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="rounded-md bg-red-50 p-4">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Orders Table */}
            <div className="rounded-md border">
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Order ID</Table.HeaderCell>
                            <Table.HeaderCell>Date</Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                            <Table.HeaderCell>Items</Table.HeaderCell>
                            <Table.HeaderCell>Total</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {isLoading ? (
                            // Loading skeleton
                            Array.from({ length: 5 }).map((_, index) => (
                                <Table.Row key={index}>
                                    <Table.Cell>
                                        <Skeleton className="h-4 w-24" />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Skeleton className="h-4 w-32" />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Skeleton className="h-4 w-20" />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Skeleton className="h-4 w-16" />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Skeleton className="h-4 w-24" />
                                    </Table.Cell>
                                </Table.Row>
                            ))
                        ) : (
                            // Orders list
                            orders.map((order) => (
                                <Table.Row
                                    key={order.id}
                                    className="cursor-pointer hover:bg-gray-50"
                                    onClick={() => handleOrderClick(order.id)}
                                >
                                    <Table.Cell>{order.id}</Table.Cell>
                                    <Table.Cell>{formatDate(order.createdAt)}</Table.Cell>
                                    <Table.Cell>
                                        <Badge size="sm" variant="secondary" className={`bg-${getStatusColor(order.status)}-100 text-${getStatusColor(order.status)}-800`}>
                                            {order.status}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell>{order.items.length} items</Table.Cell>
                                    <Table.Cell>{formatCurrency(order.total)}</Table.Cell>
                                </Table.Row>
                            ))
                        )}
                    </Table.Body>
                </Table>
            </div>

            {/* Pagination */}
            {!isLoading && totalOrders > 0 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-700">
                        Showing {orders.length} of {totalOrders} orders
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            disabled={orders.length < 10}
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
} 