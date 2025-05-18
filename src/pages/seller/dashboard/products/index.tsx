import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Plus, Trash2, Package, Loader2, Filter, ArrowUpDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter } from "@/components/ui/dialog";
import axios from 'axios';
import { API_CONFIG } from '@/config/api.config';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProducts, useProductFilters } from '@/hooks/useProducts';
import { ProductStatus } from '@/types/product';
import { Label } from '@/components/ui/label';

interface Product {
    id: string;
    name: string;
    sku: string;
    category: string;
    price: number;
    stock: number;
    status: "Active" | "Inactive";
    lastUpdated: string;
}

// Fallback data if API fails or is unavailable
const mockProducts: Product[] = [
    {
        id: "1",
        name: "Premium Laptop",
        sku: "LAP001",
        category: "Electronics",
        price: 49999,
        stock: 50,
        status: "Active",
        lastUpdated: "2024-03-25"
    },
    {
        id: "2",
        name: "Wireless Mouse",
        sku: "MOU001",
        category: "Accessories",
        price: 1799,
        stock: 100,
        status: "Active",
        lastUpdated: "2024-03-25"
    },
    {
        id: "3",
        name: "Mechanical Keyboard",
        sku: "KEY001",
        category: "Accessories",
        price: 4999,
        stock: 30,
        status: "Inactive",
        lastUpdated: "2024-03-24"
    },
    {
        id: "4",
        name: "4K Monitor",
        sku: "MON001",
        category: "Electronics",
        price: 29999,
        stock: 20,
        status: "Active",
        lastUpdated: "2024-03-23"
    },
    {
        id: "5",
        name: "USB-C Hub",
        sku: "HUB001",
        category: "Accessories",
        price: 2499,
        stock: 75,
        status: "Active",
        lastUpdated: "2024-03-22"
    }
];

/**
 * Product Filters Component
 * Handles filtering of products based on various criteria
 */
const ProductFilters = ({ onApplyFilters }: { onApplyFilters: (filters: any) => void }) => {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<string>('');
    const [category, setCategory] = useState<string>('');

    const handleApply = () => {
        onApplyFilters({
            search,
            status,
            category
        });
    };

    const handleReset = () => {
        setSearch('');
        setStatus('');
        setCategory('');
        onApplyFilters({});
    };

    return (
        <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        id="search"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>
            <div className="w-[200px]">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All</SelectItem>
                        <SelectItem value={ProductStatus.ACTIVE}>Active</SelectItem>
                        <SelectItem value={ProductStatus.INACTIVE}>Inactive</SelectItem>
                        <SelectItem value={ProductStatus.DRAFT}>Draft</SelectItem>
                        <SelectItem value={ProductStatus.ARCHIVED}>Archived</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="w-[200px]">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All Categories</SelectItem>
                        {/* Add categories dynamically when available */}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-end gap-2">
                <Button onClick={handleApply} className="bg-[#7352FF] hover:bg-[#5e3dd3]">
                    <Filter className="h-4 w-4 mr-2" />
                    Apply Filters
                </Button>
                <Button variant="outline" onClick={handleReset}>
                    Reset
                </Button>
            </div>
        </div>
    );
};

/**
 * Products Table Component
 * Displays the list of products with sorting and actions
 */
const ProductsTable = ({ products, onSort }: { 
    products: any[],
    onSort: (key: string) => void
}) => {
    return (
        <div className="rounded-lg border">
            <Table>
                <TableHeader className="bg-[#F4F2FF]">
                    <TableRow>
                        <TableHead className="w-[50px]">#</TableHead>
                        <TableHead 
                            className="cursor-pointer"
                            onClick={() => onSort('name')}
                        >
                            Name <ArrowUpDown className="inline h-4 w-4 ml-1" />
                        </TableHead>
                        <TableHead 
                            className="cursor-pointer"
                            onClick={() => onSort('sku')}
                        >
                            SKU <ArrowUpDown className="inline h-4 w-4 ml-1" />
                        </TableHead>
                        <TableHead 
                            className="cursor-pointer"
                            onClick={() => onSort('price')}
                        >
                            Price <ArrowUpDown className="inline h-4 w-4 ml-1" />
                        </TableHead>
                        <TableHead 
                            className="cursor-pointer"
                            onClick={() => onSort('inventory')}
                        >
                            Inventory <ArrowUpDown className="inline h-4 w-4 ml-1" />
                        </TableHead>
                        <TableHead 
                            className="cursor-pointer"
                            onClick={() => onSort('status')}
                        >
                            Status <ArrowUpDown className="inline h-4 w-4 ml-1" />
                        </TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product, index) => (
                        <TableRow key={product.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                                <Link to={`/seller/dashboard/products/${product.id}`} className="text-blue-600 hover:underline">
                                    {product.name}
                                </Link>
                            </TableCell>
                            <TableCell>{product.sku}</TableCell>
                            <TableCell>₹{product.price.toFixed(2)}</TableCell>
                            <TableCell>{product.inventory}</TableCell>
                            <TableCell>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    product.status === ProductStatus.ACTIVE ? 'bg-green-100 text-green-800' :
                                    product.status === ProductStatus.INACTIVE ? 'bg-red-100 text-red-800' :
                                    product.status === ProductStatus.DRAFT ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {product.status}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                    >
                                        <Link to={`/seller/dashboard/products/${product.id}/edit`}>
                                            Edit
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        Delete
                                    </Button>
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
 * Products Page Component
 * Main component for managing products
 */
export default function ProductsPage() {
    const {
        products,
        isLoading,
        error,
        total,
        page,
        limit,
        totalPages,
        setPage,
        setLimit,
        fetchProducts,
        refreshProducts
    } = useProducts();

    const { filters, applyFilters } = useProductFilters();

    const handleSort = (key: string) => {
        // Implement sorting logic
        console.log('Sort by:', key);
    };

    if (isLoading && !products.length) {
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Products</h1>
                <Button
                    className="bg-[#7352FF] hover:bg-[#5e3dd3]"
                >
                    <Link to="/seller/dashboard/products/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Product List</CardTitle>
                    <CardDescription>
                        Manage your products, update inventory, and track performance
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ProductFilters onApplyFilters={applyFilters} />
                    
                    {products.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No products found. Add your first product to get started.
                        </div>
                    ) : (
                        <ProductsTable 
                            products={products}
                            onSort={handleSort}
                        />
                    )}

                    {/* Add pagination component here */}
                </CardContent>
            </Card>
        </div>
    );
} 