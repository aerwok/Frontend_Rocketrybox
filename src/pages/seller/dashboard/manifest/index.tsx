import { useManifests, useManifestFilters } from '../../../../hooks/useManifests';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../../../../components/ui/alert';
import { Input } from '../../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Loader2, RefreshCw, Search } from 'lucide-react';
import { format } from 'date-fns';
import { ManifestStatus } from '../../../../types/manifest';

/**
 * Manifest Filters Component
 * Handles filtering of manifests
 */
const ManifestFilters = () => {
    const { filters, setFilters, applyFilters, resetFilters } = useManifestFilters();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, search: e.target.value });
    };

    const handleStatusChange = (value: string) => {
        setFilters({ ...filters, status: value as ManifestStatus });
    };

    return (
        <div className="flex items-center gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search manifests..."
                    className="pl-8"
                    value={filters.search || ''}
                    onChange={handleSearchChange}
                />
            </div>
            <Select
                value={filters.status}
                onValueChange={handleStatusChange}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={ManifestStatus.PENDING}>Pending</SelectItem>
                    <SelectItem value={ManifestStatus.PROCESSING}>Processing</SelectItem>
                    <SelectItem value={ManifestStatus.SHIPPED}>Shipped</SelectItem>
                    <SelectItem value={ManifestStatus.DELIVERED}>Delivered</SelectItem>
                    <SelectItem value={ManifestStatus.CANCELLED}>Cancelled</SelectItem>
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
 * Manifest Table Component
 * Displays list of manifests
 */
const ManifestTable = () => {
    const { manifests, isLoading, error } = useManifests();

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

    if (!manifests.length) {
        return (
            <Alert>
                <AlertTitle>No Manifests</AlertTitle>
                <AlertDescription>No manifests found</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Manifest ID</TableHead>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {manifests.map((manifest) => (
                        <TableRow key={manifest.id}>
                            <TableCell>{manifest.manifestId}</TableCell>
                            <TableCell>{manifest.orderId}</TableCell>
                            <TableCell>
                                <div>
                                    <div className="font-medium">{manifest.customerName}</div>
                                    <div className="text-sm text-muted-foreground">{manifest.customerEmail}</div>
                                </div>
                            </TableCell>
                            <TableCell>{manifest.items.length} items</TableCell>
                            <TableCell>${manifest.totalAmount.toFixed(2)}</TableCell>
                            <TableCell>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    manifest.status === ManifestStatus.DELIVERED ? 'bg-green-100 text-green-800' :
                                    manifest.status === ManifestStatus.CANCELLED ? 'bg-red-100 text-red-800' :
                                    manifest.status === ManifestStatus.SHIPPED ? 'bg-blue-100 text-blue-800' :
                                    manifest.status === ManifestStatus.PROCESSING ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {manifest.status.toLowerCase()}
                                </span>
                            </TableCell>
                            <TableCell>
                                {format(new Date(manifest.createdAt), 'PPP')}
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {/* View manifest details */}}
                                >
                                    View
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

/**
 * Manifest Page Component
 * Main component for the manifest management page
 */
export default function ManifestPage() {
    const { refreshManifests } = useManifests();

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Manifests</h1>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshManifests}
                >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>

            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Manifest List</CardTitle>
                        <CardDescription>View and manage your shipping manifests</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ManifestFilters />
                        <ManifestTable />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 