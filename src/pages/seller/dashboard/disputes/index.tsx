import { useState } from 'react';
import { useDisputes, useDisputeFilters } from '../../../../hooks/useDisputes';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../../../../components/ui/alert';
import { Input } from '../../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Loader2, Search, Filter, X } from 'lucide-react';
import { format } from 'date-fns';
import { DisputeStatus, DisputePriority, DisputeCategory, Dispute } from '../../../../types/dispute';

/**
 * Dispute Summary Component
 * Displays summary statistics for disputes
 */
const DisputeSummary = ({ summary }: { summary: any }) => {
    if (!summary) return null;

    return (
        <div className="grid gap-4 md:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Disputes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{summary.total}</div>
                    <p className="text-xs text-muted-foreground">
                        Total disputes
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Open</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{summary.open}</div>
                    <p className="text-xs text-muted-foreground">
                        Active disputes
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{summary.inProgress}</div>
                    <p className="text-xs text-muted-foreground">
                        Being handled
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{summary.resolved}</div>
                    <p className="text-xs text-muted-foreground">
                        Successfully resolved
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

/**
 * Dispute Filters Component
 * Handles filtering of disputes
 */
const DisputeFilters = () => {
    const { filters, setFilters, applyFilters, resetFilters } = useDisputeFilters();

    const handleSearch = (value: string) => {
        setFilters({ ...filters, search: value });
    };

    const handleStatusChange = (value: string) => {
        setFilters({ ...filters, status: value as DisputeStatus });
    };

    const handlePriorityChange = (value: string) => {
        setFilters({ ...filters, priority: value as DisputePriority });
    };

    const handleCategoryChange = (value: string) => {
        setFilters({ ...filters, category: value as DisputeCategory });
    };

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
                <Input
                    placeholder="Search disputes..."
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
                        {Object.values(DisputeStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                                {status.replace(/_/g, ' ').toLowerCase()}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select
                    value={filters.priority}
                    onValueChange={handlePriorityChange}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All Priority</SelectItem>
                        {Object.values(DisputePriority).map((priority) => (
                            <SelectItem key={priority} value={priority}>
                                {priority.toLowerCase()}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select
                    value={filters.category}
                    onValueChange={handleCategoryChange}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All Categories</SelectItem>
                        {Object.values(DisputeCategory).map((category) => (
                            <SelectItem key={category} value={category}>
                                {category.replace(/_/g, ' ').toLowerCase()}
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
 * Dispute Table Component
 * Displays list of disputes
 */
const DisputeTable = () => {
    const { disputes, isLoading, error, resolveDispute, closeDispute, reopenDispute } = useDisputes();

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

    if (disputes.length === 0) {
        return (
            <Alert>
                <AlertTitle>No Disputes</AlertTitle>
                <AlertDescription>No disputes found</AlertDescription>
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
                        <TableHead>Category</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {disputes.map((dispute: Dispute) => (
                        <TableRow key={dispute.id}>
                            <TableCell>{dispute.orderId}</TableCell>
                            <TableCell>
                                <div>
                                    <div className="font-medium">{dispute.customerName}</div>
                                    <div className="text-sm text-gray-500">{dispute.customerEmail}</div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                                    {dispute.category.replace(/_/g, ' ').toLowerCase()}
                                </span>
                            </TableCell>
                            <TableCell>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    dispute.priority === DisputePriority.URGENT ? 'bg-red-100 text-red-800' :
                                    dispute.priority === DisputePriority.HIGH ? 'bg-orange-100 text-orange-800' :
                                    dispute.priority === DisputePriority.MEDIUM ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                }`}>
                                    {dispute.priority.toLowerCase()}
                                </span>
                            </TableCell>
                            <TableCell>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    dispute.status === DisputeStatus.RESOLVED ? 'bg-green-100 text-green-800' :
                                    dispute.status === DisputeStatus.CLOSED ? 'bg-gray-100 text-gray-800' :
                                    dispute.status === DisputeStatus.REOPENED ? 'bg-orange-100 text-orange-800' :
                                    dispute.status === DisputeStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {dispute.status.replace(/_/g, ' ').toLowerCase()}
                                </span>
                            </TableCell>
                            <TableCell>
                                {format(new Date(dispute.createdAt), 'PPP')}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    {dispute.status === DisputeStatus.OPEN && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => resolveDispute(dispute.id, '')}
                                        >
                                            Resolve
                                        </Button>
                                    )}
                                    {dispute.status === DisputeStatus.RESOLVED && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => closeDispute(dispute.id)}
                                        >
                                            Close
                                        </Button>
                                    )}
                                    {dispute.status === DisputeStatus.CLOSED && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => reopenDispute(dispute.id)}
                                        >
                                            Reopen
                                        </Button>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

/**
 * Disputes Page Component
 * Main component for the disputes dashboard
 */
export default function DisputesPage() {
    const { summary } = useDisputes();

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Disputes</h1>
            </div>

            <div className="space-y-8">
                <DisputeSummary summary={summary} />
                <Card>
                    <CardHeader>
                        <CardTitle>Dispute Management</CardTitle>
                        <CardDescription>Manage and resolve customer disputes</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <DisputeFilters />
                        <DisputeTable />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 