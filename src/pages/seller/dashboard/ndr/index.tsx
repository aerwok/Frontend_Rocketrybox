import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ArrowUpDown, Search, MoreVertical } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BulkNDRUploadModal from "@/components/seller/ndr/bulk-ndr-upload-modal";
import ExcelJS from "exceljs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ReturnOrderModal from "@/components/seller/return-order-modal";
import ReattemptOrderModal from "@/components/seller/reattempt-order-modal";
import { useNDRs, useNDRFilters } from '../../../../hooks/useNDRs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../../../../components/ui/alert';
import { Input } from '../../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Loader2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { NDRReason, NDRStatus } from '../../../../types/ndr';

interface NDRData {
    awb: string;
    orderDate: string;
    courier: string;
    customer: string;
    attempts: number;
    lastAttemptDate: string;
    status: string;
    reason: string;
    action: string;
    address?: {
        fullName: string;
        contactNumber: string;
        addressLine1: string;
        addressLine2?: string;
        landmark?: string;
        pincode: string;
        city: string;
        state: string;
    };
}

const NDRTable = ({ data, showActions = false }: { data: NDRData[], showActions?: boolean }) => {

    const [sortConfig, setSortConfig] = useState<{
        key: keyof NDRData;
        direction: 'asc' | 'desc';
    } | null>(null);

    const [selectedAwb, setSelectedAwb] = useState<string>("");
    const [isReturnModalOpen, setIsReturnModalOpen] = useState<boolean>(false);
    const [isReattemptModalOpen, setIsReattemptModalOpen] = useState<boolean>(false);
    const [selectedNDR, setSelectedNDR] = useState<NDRData | null>(null);

    const sortedData = [...data].sort((a, b) => {
        if (!sortConfig) return 0;

        const { key, direction } = sortConfig;

        // Handle potentially undefined values safely
        const aValue = a[key] ?? '';
        const bValue = b[key] ?? '';

        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (key: keyof NDRData) => {
        setSortConfig(current => ({
            key,
            direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const handleReturnClick = (ndr: NDRData) => {
        setSelectedAwb(ndr.awb);
        setSelectedNDR(ndr);
        setIsReturnModalOpen(true);
    };

    const handleReattemptClick = (ndr: NDRData) => {
        setSelectedAwb(ndr.awb);
        setSelectedNDR(ndr);
        setIsReattemptModalOpen(true);
    };

    return (
        <>
            {data.length === 0 ? (
                <div className="py-12 text-center">
                    <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No results found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Try adjusting your search query to find what you're looking for.
                    </p>
                </div>
            ) : (
                <Table>
                    <TableHeader className="bg-[#F4F2FF] h-12">
                        <TableRow className="hover:bg-[#F4F2FF]">
                            <TableHead onClick={() => handleSort('awb')} className="cursor-pointer text-black min-w-[120px] whitespace-nowrap">
                                AWB <ArrowUpDown className="inline h-4 w-4 ml-1" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('orderDate')} className="cursor-pointer text-black min-w-[120px] whitespace-nowrap">
                                Order Date <ArrowUpDown className="inline h-4 w-4 ml-1" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('courier')} className="cursor-pointer text-black min-w-[140px] whitespace-nowrap">
                                Courier <ArrowUpDown className="inline h-4 w-4 ml-1" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('customer')} className="cursor-pointer text-black min-w-[140px] whitespace-nowrap">
                                Customer <ArrowUpDown className="inline h-4 w-4 ml-1" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('status')} className="cursor-pointer text-black min-w-[120px] whitespace-nowrap">
                                Status <ArrowUpDown className="inline h-4 w-4 ml-1" />
                            </TableHead>
                            <TableHead onClick={() => handleSort('reason')} className="cursor-pointer text-black min-w-[160px] whitespace-nowrap">
                                Reason <ArrowUpDown className="inline h-4 w-4 ml-1" />
                            </TableHead>
                            {showActions && (
                                <TableHead className="text-black min-w-[80px] whitespace-nowrap text-right">
                                    Actions
                                </TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedData.map((row, index) => (
                            <TableRow key={index} className="h-12">
                                <TableCell className="whitespace-nowrap">
                                    <Link
                                        to={`/seller/dashboard/ndr/${row.awb}`}
                                        className="text-violet-600 hover:underline"
                                    >
                                        {row.awb}
                                    </Link>
                                </TableCell>
                                <TableCell className="whitespace-nowrap">{row.orderDate}</TableCell>
                                <TableCell className="whitespace-nowrap">{row.courier}</TableCell>
                                <TableCell className="whitespace-nowrap">{row.customer}</TableCell>
                                <TableCell className="whitespace-nowrap">
                                    <span className={cn(
                                        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                                        {
                                            "bg-red-100 text-red-800": row.status === "Action Required",
                                            "bg-orange-100 text-orange-800": row.status === "Action Requested",
                                            "bg-blue-100 text-blue-800": row.status === "In Transit",
                                            "bg-purple-100 text-purple-800": row.status === "Out for Delivery",
                                            "bg-green-100 text-green-800": row.status === "Delivered",
                                        }
                                    )}>
                                        {row.status}
                                    </span>
                                </TableCell>
                                <TableCell className="whitespace-nowrap">{row.reason}</TableCell>
                                {showActions && (
                                    <TableCell className="whitespace-nowrap text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleReturnClick(row)}>
                                                    Return
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleReattemptClick(row)}>
                                                    Reattempt
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {/* Return Order Modal */}
            <ReturnOrderModal
                isOpen={isReturnModalOpen}
                onClose={() => setIsReturnModalOpen(false)}
                orderId={selectedAwb}
            />

            {/* Reattempt Order Modal */}
            <ReattemptOrderModal
                isOpen={isReattemptModalOpen}
                onClose={() => setIsReattemptModalOpen(false)}
                orderId={selectedAwb}
                currentAddress={selectedNDR?.address || null}
            />
        </>
    );
};

const mapToNDRData = (data: any[]): NDRData[] => {
    return data.map(item => ({
        awb: item.awb,
        orderDate: item.orderDate || item.order_date,
        courier: item.courier || item.courier_name,
        customer: item.customer || item.customer_name,
        attempts: item.attempts || 0,
        lastAttemptDate: item.lastAttemptDate || item.last_attempt_date || "-",
        status: item.status,
        reason: item.reason || item.ndr_reason,
        action: item.action || item.recommended_action || "",
        address: item.address || item.delivery_address,
    }));
};

/**
 * NDR Filters Component
 * Handles filtering of NDRs
 */
const NDRFilters = () => {
    const { filters, setFilters, applyFilters, resetFilters } = useNDRFilters();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, search: e.target.value });
    };

    const handleStatusChange = (value: string) => {
        setFilters({ ...filters, status: value as NDRStatus });
    };

    const handleReasonChange = (value: string) => {
        setFilters({ ...filters, reason: value as NDRReason });
    };

    return (
        <div className="flex items-center gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search NDRs..."
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
                    <SelectItem value={NDRStatus.PENDING}>Pending</SelectItem>
                    <SelectItem value={NDRStatus.IN_PROGRESS}>In Progress</SelectItem>
                    <SelectItem value={NDRStatus.RESOLVED}>Resolved</SelectItem>
                    <SelectItem value={NDRStatus.CANCELLED}>Cancelled</SelectItem>
                </SelectContent>
            </Select>
            <Select
                value={filters.reason}
                onValueChange={handleReasonChange}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={NDRReason.CUSTOMER_NOT_AVAILABLE}>Customer Not Available</SelectItem>
                    <SelectItem value={NDRReason.WRONG_ADDRESS}>Wrong Address</SelectItem>
                    <SelectItem value={NDRReason.CUSTOMER_REFUSED}>Customer Refused</SelectItem>
                    <SelectItem value={NDRReason.DAMAGED_PACKAGE}>Damaged Package</SelectItem>
                    <SelectItem value={NDRReason.OTHER}>Other</SelectItem>
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
 * NDR Page Component
 * Main component for the NDR management page
 */
export default function NDRPage() {
    const { refreshNDRs } = useNDRs();

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Non-Delivery Reports</h1>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshNDRs}
                >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>

            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>NDR List</CardTitle>
                        <CardDescription>View and manage your non-delivery reports</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <NDRFilters />
                        <NDRTable 
                            data={mapToNDRData(filterDataBySearch(ndrData[activeTab]))} 
                            showActions={showActions} 
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 