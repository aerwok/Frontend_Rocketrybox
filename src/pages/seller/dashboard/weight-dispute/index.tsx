import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ArrowUpDown, Filter, UploadCloud, Package, Calendar, ChevronLeft, ChevronRight, ChevronDown, X, FileText, Upload } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { DayPicker, DateRange as DayPickerDateRange } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";
import React from "react";
import { Label } from "@/components/ui/label";
import { useWeightDisputes } from '@/hooks/useWeightDisputes';
import { DisputeStatus, DisputeType, DisputePriority } from '@/types/weight-dispute';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { formatDate } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WeightDisputeData {
    disputeDate: string;
    awbNumber: string;
    orderId: string;
    given: number;
    applied: number;
    revised: number;
    accepted: boolean;
    difference: number;
    product: string;
    comments: string;
    status: "Action Required" | "Accepted" | "Open Dispute" | "Closed Dispute" | "Closed Resolved";
}

const mockData: WeightDisputeData[] = [
    {
        disputeDate: "2024-03-15",
        awbNumber: "AWB123456789",
        orderId: "ORD-987654",
        given: 2.5,
        applied: 1.8,
        revised: 2.2,
        accepted: true,
        difference: 0.7,
        product: "Nike Air Max 270 - Black/White (Size UK 9)",
        comments: "Weight difference due to additional packaging material",
        status: "Action Required"
    },
    {
        disputeDate: "2024-03-14",
        awbNumber: "AWB987654321",
        orderId: "ORD-123456",
        given: 1.2,
        applied: 0.8,
        revised: 1.0,
        accepted: false,
        difference: 0.4,
        product: "Adidas Ultraboost 21 - Grey (Size UK 8)",
        comments: "Customer claims package weight was less than charged",
        status: "Open Dispute"
    },
    {
        disputeDate: "2024-03-13",
        awbNumber: "AWB456789123",
        orderId: "ORD-345678",
        given: 3.0,
        applied: 3.0,
        revised: 3.0,
        accepted: true,
        difference: 0.0,
        product: "Puma RS-X - White/Blue (Size UK 10)",
        comments: "Weight verified and accepted",
        status: "Closed Resolved"
    },
    {
        disputeDate: "2024-03-12",
        awbNumber: "AWB789123456",
        orderId: "ORD-234567",
        given: 1.5,
        applied: 1.2,
        revised: 1.4,
        accepted: true,
        difference: 0.3,
        product: "New Balance 574 - Navy (Size UK 7.5)",
        comments: "Partial weight adjustment accepted",
        status: "Action Required"
    },
    {
        disputeDate: "2024-03-11",
        awbNumber: "AWB654321987",
        orderId: "ORD-876543",
        given: 2.8,
        applied: 2.3,
        revised: 2.5,
        accepted: false,
        difference: 0.5,
        product: "Reebok Classic - White (Size UK 8.5)",
        comments: "Awaiting additional documentation for weight verification",
        status: "Open Dispute"
    },
    {
        disputeDate: "2024-03-10",
        awbNumber: "AWB321987654",
        orderId: "ORD-765432",
        given: 1.8,
        applied: 1.8,
        revised: 1.8,
        accepted: true,
        difference: 0.0,
        product: "Asics Gel-Nimbus 23 - Black (Size UK 9.5)",
        comments: "No discrepancy found in weight measurement",
        status: "Closed Resolved"
    },
    {
        disputeDate: "2024-03-09",
        awbNumber: "AWB147258369",
        orderId: "ORD-654321",
        given: 2.2,
        applied: 1.7,
        revised: 2.0,
        accepted: true,
        difference: 0.5,
        product: "Brooks Ghost 14 - Grey/Mint (Size UK 7)",
        comments: "Weight adjusted after reviewing packaging standards",
        status: "Closed Dispute"
    },
    {
        disputeDate: "2024-03-08",
        awbNumber: "AWB258369147",
        orderId: "ORD-543210",
        given: 3.5,
        applied: 2.8,
        revised: 3.2,
        accepted: false,
        difference: 0.7,
        product: "Saucony Ride 14 - Blue/Orange (Size UK 10.5)",
        comments: "Disputing weight calculation method",
        status: "Action Required"
    },
    {
        disputeDate: "2024-03-07",
        awbNumber: "AWB369147258",
        orderId: "ORD-432109",
        given: 1.6,
        applied: 1.3,
        revised: 1.5,
        accepted: true,
        difference: 0.3,
        product: "Under Armour HOVR - Red (Size UK 8)",
        comments: "Weight difference acknowledged and corrected",
        status: "Closed Resolved"
    },
    {
        disputeDate: "2024-03-06",
        awbNumber: "AWB741852963",
        orderId: "ORD-321098",
        given: 2.4,
        applied: 2.0,
        revised: 2.2,
        accepted: false,
        difference: 0.4,
        product: "Hoka One One Bondi 7 - White/Pink (Size UK 6.5)",
        comments: "Requesting photographic evidence of weighing process",
        status: "Action Required"
    },
    {
        disputeDate: "2024-03-05",
        awbNumber: "AWB852963741",
        orderId: "ORD-210987",
        given: 1.9,
        applied: 1.5,
        revised: 1.7,
        accepted: true,
        difference: 0.4,
        product: "Mizuno Wave Rider 25 - Black/Silver (Size UK 9)",
        comments: "Weight adjustment approved after review",
        status: "Closed Dispute"
    },
    {
        disputeDate: "2024-03-04",
        awbNumber: "AWB963741852",
        orderId: "ORD-109876",
        given: 2.7,
        applied: 2.2,
        revised: 2.5,
        accepted: false,
        difference: 0.5,
        product: "On Cloud X - Grey/White (Size UK 8)",
        comments: "Escalated for detailed weight analysis",
        status: "Open Dispute"
    }
];

interface DisputeTableProps {
    data: WeightDisputeData[];
}

interface OrderDetails {
    awbNumber: string;
    orderId: string;
    customerName: string;
    customerPhone: string;
    address: string;
    product: string;
    price: number;
    quantity: number;
    status: string;
    courierPartner: string;
    trackingStatus: string;
    pickupDate: string;
    deliveryDate: string;
    deliveryAttempts: number;
    paymentMethod: string;
    codAmount: number;
    sellerName: string;
    sellerSKU: string;
    givenWeight: number;
    appliedWeight: number;
    revisedWeight: number;
    shippingCharge: number;
    weightChargeDiscount: number;
    weightDifferenceCharge: number;
    comments: string;
}

// API service for weight disputes
const weightDisputeApi = {
  // Get all weight disputes with optional filters
  getWeightDisputes: async (params?: Record<string, any>) => {
    try {
      // When API is ready, uncomment this
      // const response = await axios.get('/api/weight-disputes', { params });
      // return response.data;
      
      // Mock data for development only - will be replaced with actual API in production
      console.warn('Using mock data - replace with actual API before production');
      
      // Simulating API request delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Simple filtering for mock data
      let filteredData = [...mockData];
      
      if (params) {
        // Filter by status if provided
        if (params.status) {
          filteredData = filteredData.filter(item => item.status === params.status);
        }
        
        // Filter by accepted if provided
        if (params.accepted !== undefined) {
          filteredData = filteredData.filter(item => item.accepted === params.accepted);
        }
        
        // Filter by AWB number if provided
        if (params.awbNumber) {
          filteredData = filteredData.filter(item => 
            item.awbNumber.toLowerCase().includes(params.awbNumber.toLowerCase())
          );
        }
        
        // Filter by product if provided
        if (params.product) {
          filteredData = filteredData.filter(item => 
            item.product.toLowerCase().includes(params.product.toLowerCase())
          );
        }
        
        // Filter by date range if provided
        if (params.fromDate) {
          const fromDate = new Date(params.fromDate);
          fromDate.setHours(0, 0, 0, 0);
          filteredData = filteredData.filter(item => {
            const disputeDate = new Date(item.disputeDate);
            return disputeDate >= fromDate;
          });
        }
        
        if (params.toDate) {
          const toDate = new Date(params.toDate);
          toDate.setHours(23, 59, 59, 999);
          filteredData = filteredData.filter(item => {
            const disputeDate = new Date(item.disputeDate);
            return disputeDate <= toDate;
          });
        }
        
        // Filter by search query (general search across multiple fields)
        if (params.search) {
          const searchLower = params.search.toLowerCase();
          filteredData = filteredData.filter(item => 
            item.awbNumber.toLowerCase().includes(searchLower) ||
            item.orderId.toLowerCase().includes(searchLower) ||
            item.product.toLowerCase().includes(searchLower) ||
            item.comments.toLowerCase().includes(searchLower) ||
            item.status.toLowerCase().includes(searchLower)
          );
        }
        
        // Filter by courier partner if provided (based on AWB prefix)
        if (params.courierPartner) {
          const courierMapping = {
            "Delhivery": "AWB12",
            "Ecom Express": "AWB98",
            "Xpressbees": "AWB45",
            "Bluedart": "AWB78",
            "Ekart": "AWB65",
            "Shadowfax": "AWB32",
            "DTDC": "AWB14",
            "Delhivery Surface": "AWB25",
            "ShipRocket": "AWB36",
            "FedEx": "AWB74",
            "Amazon Shipping": "AWB85",
            "Gati": "AWB96"
          };
          
          const prefix = courierMapping[params.courierPartner as keyof typeof courierMapping];
          if (prefix) {
            filteredData = filteredData.filter(item => item.awbNumber.startsWith(prefix));
          }
        }
      }
      
      return filteredData;
    } catch (error) {
      console.error('Error fetching weight disputes:', error);
      throw error;
    }
  },
  
  // Get a single weight dispute by AWB number
  getWeightDisputeDetails: async (awbNumber: string, orderId: string) => {
    try {
      // When API is ready, uncomment this
      // const response = await axios.get(`/api/weight-disputes/${awbNumber}`, { params: { orderId } });
      // return response.data;
      
      // Simulating API request delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Return mock detail (this should be removed in production)
      return mockData.find(item => item.awbNumber === awbNumber && item.orderId === orderId);
    } catch (error) {
      console.error('Error fetching weight dispute details:', error);
      throw error;
    }
  },
  
  // Upload weight dispute file
  uploadDisputeFile: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // When API is ready, uncomment this
      // const response = await axios.post('/api/weight-disputes/upload', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });
      // return response.data;
      
      // Simulating API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock response (this should be removed in production)
      return { success: true, message: 'File uploaded successfully' };
    } catch (error) {
      console.error('Error uploading weight dispute file:', error);
      throw error;
    }
  }
};

const DisputeTable = ({ data }: DisputeTableProps) => {
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getOrderDetails = async (awbNumber: string, orderId: string) => {
        setIsLoading(true);
        setError(null);
        
        try {
            // For demo purposes, we're using mock data
            // In production, this would call an API
            const item = await weightDisputeApi.getWeightDisputeDetails(awbNumber, orderId);
            
            if (!item) {
                throw new Error('Order details not found');
            }
            
            // Calculate additional data for the order
            const shippingCharge = Math.round(Math.random() * 100) + 50;
            const weightDifferenceCharge = Math.round((item.given - item.applied) * 30);
            const weightChargeDiscount = item.revised ? Math.round((item.given - item.revised) * 10) : 0;
            
            // Generate courier partner based on AWB prefix
            let courierPartner = "";
            if (awbNumber.startsWith("AWB12")) courierPartner = "Delhivery";
            else if (awbNumber.startsWith("AWB98")) courierPartner = "Ecom Express";
            else if (awbNumber.startsWith("AWB45")) courierPartner = "Xpressbees";
            else if (awbNumber.startsWith("AWB78")) courierPartner = "Bluedart";
            else if (awbNumber.startsWith("AWB65")) courierPartner = "Ekart";
            else if (awbNumber.startsWith("AWB32")) courierPartner = "Shadowfax";
            else if (awbNumber.startsWith("AWB14")) courierPartner = "DTDC";
            else if (awbNumber.startsWith("AWB25")) courierPartner = "Delhivery Surface";
            else if (awbNumber.startsWith("AWB36")) courierPartner = "ShipRocket";
            else if (awbNumber.startsWith("AWB74")) courierPartner = "FedEx";
            else if (awbNumber.startsWith("AWB85")) courierPartner = "Amazon Shipping";
            else if (awbNumber.startsWith("AWB96")) courierPartner = "Gati";

            // Calculate delivery date based on dispute date
            const disputeDate = new Date(item.disputeDate);
            const pickupDate = new Date(disputeDate);
            pickupDate.setDate(pickupDate.getDate() - 2);
            
            const deliveryDate = new Date(disputeDate);
            deliveryDate.setDate(deliveryDate.getDate() + 7 + Math.floor(Math.random() * 4));
            
            const details: OrderDetails = {
                awbNumber,
                orderId,
                customerName: ["Amit Sharma", "Priya Patel", "Rahul Gupta", "Neha Singh", "Vikram Agarwal", "Ananya Desai", "Rajesh Kumar", "Sneha Reddy"][Math.floor(Math.random() * 8)],
                customerPhone: "+91 " + Math.floor(Math.random() * 9000000000 + 1000000000),
                address: [
                    "123 Park Street, Kolkata, West Bengal - 700016",
                    "42 MG Road, Bangalore, Karnataka - 560001",
                    "78 Linking Road, Mumbai, Maharashtra - 400052",
                    "15 Connaught Place, New Delhi, Delhi - 110001",
                    "234 Anna Salai, Chennai, Tamil Nadu - 600002"
                ][Math.floor(Math.random() * 5)],
                product: item.product,
                price: Math.floor(Math.random() * 3000 + 999),
                quantity: Math.floor(Math.random() * 3) + 1,
                status: item.status,
                courierPartner,
                trackingStatus: item.status === "Closed Dispute" || item.status === "Closed Resolved" ? "Delivered" : 
                                item.status === "Open Dispute" ? "In Transit" : "Pending",
                pickupDate: pickupDate.toISOString().split('T')[0],
                deliveryDate: deliveryDate.toISOString().split('T')[0],
                deliveryAttempts: item.status === "Closed Dispute" || item.status === "Closed Resolved" ? 1 : 
                                item.status === "Open Dispute" ? Math.floor(Math.random() * 2) + 1 : 0,
                paymentMethod: Math.random() > 0.6 ? "Cash on Delivery" : "Prepaid",
                codAmount: Math.random() > 0.6 ? Math.floor(Math.random() * 3000 + 999) : 0,
                sellerName: ["FashionHub", "ElectroWorld", "HomeEssentials", "SportsPro", "BeautyBazaar"][Math.floor(Math.random() * 5)],
                sellerSKU: "SKU-" + orderId.slice(-6) + "-" + item.product.split(" ")[0].toUpperCase(),
                givenWeight: item.given,
                appliedWeight: item.applied,
                revisedWeight: item.revised,
                shippingCharge: shippingCharge,
                weightChargeDiscount: weightChargeDiscount,
                weightDifferenceCharge: weightDifferenceCharge,
                comments: item.comments
            };

            setOrderDetails(details);
            setShowDetailsDialog(true);
        } catch (err) {
            console.error('Error fetching order details:', err);
            setError('Failed to load order details. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="rounded-md border overflow-x-auto">
            {error && (
                <div className="bg-red-50 p-4 text-red-800 border border-red-200 rounded-md mb-4">
                    {error}
                </div>
            )}
            
            {isLoading ? (
                <div className="p-8 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent"></div>
                    <p className="mt-2 text-sm text-gray-500">Loading details...</p>
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow className="bg-[#f8f8fa] hover:bg-[#f8f8fa]">
                            <TableHead className="text-xs font-medium text-center p-2 whitespace-nowrap">
                                <div className="flex items-center gap-1 justify-center">
                                    DISPUTE DATE <ArrowUpDown className="h-3 w-3" />
                                </div>
                            </TableHead>
                            <TableHead className="text-xs font-medium text-center p-2 whitespace-nowrap">
                                <div className="flex items-center gap-1 justify-center">
                                    AWB NUMBER <ArrowUpDown className="h-3 w-3" />
                                </div>
                            </TableHead>
                            <TableHead className="text-xs font-medium text-center p-2 whitespace-nowrap">
                                <div className="flex items-center gap-1 justify-center">
                                    ORDER ID <ArrowUpDown className="h-3 w-3" />
                                </div>
                            </TableHead>
                            <TableHead className="text-xs font-medium text-center p-2 whitespace-nowrap">
                                <div className="flex items-center gap-1 justify-center">
                                    GIVEN <ArrowUpDown className="h-3 w-3" />
                                </div>
                            </TableHead>
                            <TableHead className="text-xs font-medium text-center p-2 whitespace-nowrap">
                                <div className="flex items-center gap-1 justify-center">
                                    APPLIED <ArrowUpDown className="h-3 w-3" />
                                </div>
                            </TableHead>
                            <TableHead className="text-xs font-medium text-center p-2 whitespace-nowrap">
                                <div className="flex items-center gap-1 justify-center">
                                    REVISED <ArrowUpDown className="h-3 w-3" />
                                </div>
                            </TableHead>
                            <TableHead className="text-xs font-medium text-center p-2 whitespace-nowrap">
                                <div className="flex items-center gap-1 justify-center">
                                    ACCEPTED <ArrowUpDown className="h-3 w-3" />
                                </div>
                            </TableHead>
                            <TableHead className="text-xs font-medium text-center p-2 whitespace-nowrap">
                                <div className="flex items-center gap-1 justify-center">
                                    DIFFERENCE <ArrowUpDown className="h-3 w-3" />
                                </div>
                            </TableHead>
                            <TableHead className="text-xs font-medium text-center p-2 whitespace-nowrap">
                                <div className="flex items-center gap-1 justify-center">
                                    PRODUCT <ArrowUpDown className="h-3 w-3" />
                                </div>
                            </TableHead>
                            <TableHead className="text-xs font-medium text-center p-2 whitespace-nowrap">
                                <div className="flex items-center gap-1 justify-center">
                                    COMMENTS <ArrowUpDown className="h-3 w-3" />
                                </div>
                            </TableHead>
                            <TableHead className="text-xs font-medium text-center p-2 whitespace-nowrap">
                                <div className="flex items-center gap-1 justify-center">
                                    STATUS <ArrowUpDown className="h-3 w-3" />
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.awbNumber} className="hover:bg-gray-50 text-center">
                                <TableCell className="p-2 text-xs text-center">{item.disputeDate}</TableCell>
                                <TableCell className="p-2 text-xs text-center">
                                    <button
                                        onClick={() => getOrderDetails(item.awbNumber, item.orderId)}
                                        className="text-blue-600 hover:underline font-medium cursor-pointer"
                                    >
                                        {item.awbNumber}
                                    </button>
                                </TableCell>
                                <TableCell className="p-2 text-xs text-center">
                                    <button
                                        onClick={() => getOrderDetails(item.awbNumber, item.orderId)}
                                        className="text-blue-600 hover:underline font-medium cursor-pointer"
                                    >
                                        {item.orderId}
                                    </button>
                                </TableCell>
                                <TableCell className="p-2 text-xs text-center">{item.given} kg</TableCell>
                                <TableCell className="p-2 text-xs text-center">{item.applied} kg</TableCell>
                                <TableCell className="p-2 text-xs text-center">{item.revised} kg</TableCell>
                                <TableCell className="p-2 text-xs text-center">{item.accepted ? "Yes" : "No"}</TableCell>
                                <TableCell className="p-2 text-xs text-center">{item.difference.toFixed(1)} kg</TableCell>
                                <TableCell className="p-2 text-xs text-center">
                                    <div className="max-w-[150px] truncate" title={item.product}>
                                        {item.product}
                                    </div>
                                </TableCell>
                                <TableCell className="p-2 text-xs text-center">
                                    <div className="max-w-[150px] truncate" title={item.comments}>
                                        {item.comments}
                                    </div>
                                </TableCell>
                                <TableCell className="p-2 text-xs text-center">
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "bg-gray-100 text-gray-800 border border-gray-200",
                                            item.status === "Action Required" && "bg-gray-100 text-gray-800 border-gray-300 font-medium",
                                            item.status === "Open Dispute" && "bg-gray-100 text-gray-800 border-gray-300",
                                            item.status === "Closed Dispute" && "bg-gray-100 text-gray-800 border-gray-300",
                                            item.status === "Closed Resolved" && "bg-gray-100 text-gray-800 border-gray-300"
                                        )}
                                    >
                                        {item.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {/* Order Details Dialog */}
            {showDetailsDialog && orderDetails && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-md shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-4 flex justify-between items-center border-b bg-gray-50">
                            <div>
                                <h2 className="text-lg font-medium flex items-center">
                                    <Package className="mr-2 h-5 w-5 text-purple-600" />
                                    Order Details
                                </h2>
                                <p className="text-sm text-gray-500">{orderDetails.orderId} • {orderDetails.awbNumber}</p>
                            </div>
                            <button 
                                onClick={() => setShowDetailsDialog(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Order & Shipping Details */}
                            <div className="space-y-4">
                                <div className="bg-purple-50 p-3 rounded-md border border-purple-100">
                                    <h3 className="text-sm font-medium text-purple-700 mb-2">Order Information</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">Order ID:</span>
                                            <span className="text-sm font-medium">{orderDetails.orderId}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">AWB Number:</span>
                                            <span className="text-sm font-medium">{orderDetails.awbNumber}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">Courier Partner:</span>
                                            <span className="text-sm font-medium">{orderDetails.courierPartner}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">Status:</span>
                                            <Badge
                                                variant="outline"
                                                className="bg-gray-100 text-gray-800 border border-gray-300 font-medium"
                                            >
                                                {orderDetails.status}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">Tracking Status:</span>
                                            <Badge
                                                variant="outline"
                                                className="bg-gray-100 text-gray-800 border border-gray-300 font-medium"
                                            >
                                                {orderDetails.trackingStatus}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">Seller:</span>
                                            <span className="text-sm font-medium">{orderDetails.sellerName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">Seller SKU:</span>
                                            <span className="text-sm font-medium">{orderDetails.sellerSKU}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                                    <h3 className="text-sm font-medium text-blue-700 mb-2">Shipping Timeline</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">Pickup Date:</span>
                                            <span className="text-sm font-medium">{orderDetails.pickupDate}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">Delivery Date:</span>
                                            <span className="text-sm font-medium">{orderDetails.deliveryDate}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">Delivery Attempts:</span>
                                            <span className="text-sm font-medium">{orderDetails.deliveryAttempts}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Customer & Product Details */}
                            <div className="space-y-4">
                                <div className="bg-green-50 p-3 rounded-md border border-green-100">
                                    <h3 className="text-sm font-medium text-green-700 mb-2">Customer Information</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">Name:</span>
                                            <span className="text-sm font-medium">{orderDetails.customerName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">Phone:</span>
                                            <span className="text-sm font-medium">{orderDetails.customerPhone}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm text-gray-500">Address:</span>
                                            <span className="text-sm font-medium text-right mt-1">{orderDetails.address}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-amber-50 p-3 rounded-md border border-amber-100">
                                    <h3 className="text-sm font-medium text-amber-700 mb-2">Product Information</h3>
                                    <div className="space-y-2">
                                        <div className="flex flex-col">
                                            <span className="text-sm text-gray-500">Product:</span>
                                            <span className="text-sm font-medium text-right mt-1">{orderDetails.product}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">Price:</span>
                                            <span className="text-sm font-medium">₹{orderDetails.price.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">Quantity:</span>
                                            <span className="text-sm font-medium">{orderDetails.quantity}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">Payment Method:</span>
                                            <span className="text-sm font-medium">{orderDetails.paymentMethod}</span>
                                        </div>
                                        {orderDetails.paymentMethod === "Cash on Delivery" && (
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">COD Amount:</span>
                                                <span className="text-sm font-medium">₹{orderDetails.codAmount.toFixed(2)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Weight & Shipping Charges */}
                            <div className="space-y-4">
                                <div className="bg-red-50 p-3 rounded-md border border-red-100">
                                    <h3 className="text-sm font-medium text-red-700 mb-2">Weight Information</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">Given Weight:</span>
                                            <span className="text-sm font-medium">{orderDetails.givenWeight} kg</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">Applied Weight:</span>
                                            <span className="text-sm font-medium">{orderDetails.appliedWeight} kg</span>
                                        </div>
                                        {orderDetails.revisedWeight > 0 && (
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Revised Weight:</span>
                                                <span className="text-sm font-medium">{orderDetails.revisedWeight} kg</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">Weight Difference:</span>
                                            <span className="text-sm font-medium">{(orderDetails.givenWeight - orderDetails.appliedWeight).toFixed(1)} kg</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-indigo-50 p-3 rounded-md border border-indigo-100">
                                    <h3 className="text-sm font-medium text-indigo-700 mb-2">Shipping Charges</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">Base Shipping Charge:</span>
                                            <span className="text-sm font-medium">₹{orderDetails.shippingCharge.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">Weight Difference Charge:</span>
                                            <span className="text-sm font-medium">₹{orderDetails.weightDifferenceCharge.toFixed(2)}</span>
                                        </div>
                                        {orderDetails.weightChargeDiscount > 0 && (
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Weight Charge Discount:</span>
                                                <span className="text-sm font-medium text-green-600">-₹{orderDetails.weightChargeDiscount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="border-t border-indigo-200 pt-2 mt-2">
                                            <div className="flex justify-between font-medium">
                                                <span className="text-sm text-gray-700">Total Charge:</span>
                                                <span className="text-sm">₹{(orderDetails.shippingCharge + orderDetails.weightDifferenceCharge - orderDetails.weightChargeDiscount).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Weight Dispute Comments</h3>
                                    <div className="mt-2">
                                        <p className="text-sm">{orderDetails.comments}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-4 bg-gray-50 flex justify-end border-t">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowDetailsDialog(false)}
                                className="bg-purple-600 text-white hover:bg-purple-700"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Extracted date utility functions
// Commented out as it's not being used
/* 
const getPresetDateRange = (preset: string): DateRange | undefined => {
    const today = startOfToday();
    switch (preset) {
        case "today":
            return { from: today, to: today };
        case "yesterday":
            const yesterday = subDays(today, 1);
            return { from: yesterday, to: yesterday };
        case "last7days":
            return { from: subDays(today, 6), to: today };
        case "last30days":
            return { from: subDays(today, 29), to: today };
        case "lastMonth":
            const lastMonth = subDays(startOfMonth(today), 1);
            from = startOfMonth(lastMonth);
            to = endOfMonth(lastMonth);
            break;
        case "currentMonth":
            from = startOfMonth(today);
            to = endOfMonth(today);
            break;
        case "lifetime":
            return undefined; // No date filter for lifetime
        default:
            return undefined;
    }
};
*/

// Use the DayPickerDateRange type directly
type DateRange = DayPickerDateRange;

// Update CustomDateRange to match DateRange
// interface CustomDateRange {
//     from?: Date;
//     to?: Date;
// }

// Date picker component props
interface DatePickerProps {
    selected: DateRange | undefined;
    onSelect: (range: DateRange | undefined) => void;
    month?: Date;
    onMonthChange?: (month: Date) => void;
}

// Extracted DatePicker component
const DatePickerCalendar = React.memo(({ selected, onSelect, month, onMonthChange }: DatePickerProps & { month: Date; onMonthChange: (month: Date) => void }) => (
    <DayPicker
        mode="range"
        selected={selected}
        onSelect={onSelect}
        numberOfMonths={2}
        month={month}
        onMonthChange={onMonthChange}
        showOutsideDays={true}
        fixedWeeks={true}
        captionLayout="buttons"
        pagedNavigation
        className="border-gray-200 relative [&_.rdp-nav]:hidden" // Hide nav buttons using CSS
        styles={{
            table: { width: '100%', tableLayout: 'fixed', borderSpacing: '0' },
            cell: { padding: 0, textAlign: 'center', width: '2rem', height: '2rem' },
            day: { width: '100%', height: '100%', margin: '0', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }
        }}
        modifiersStyles={{
            outside: { opacity: '0.5' },
            range_middle: { borderRadius: 0 },
            range_start: { borderRadius: '9999px 0 0 9999px' },
            range_end: { borderRadius: '0 9999px 9999px 0' },
        }}
        classNames={{
            root: "mx-auto w-full",
            months: "flex justify-center",
            month: "space-y-4",
            caption: "relative py-1 px-0 text-center",
            caption_label: "text-base font-medium text-gray-900",
            nav: "hidden", // Hide navigation with classes
            nav_button: "hidden", // Hide navigation buttons 
            head: "mt-2",
            head_row: "grid grid-cols-7 text-xs leading-6 text-gray-500",
            head_cell: "text-center font-normal",
            tbody: "grid grid-cols-1",
            row: "grid grid-cols-7 mt-0.5",
            cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-transparent",
            day: "h-8 w-8 p-0 mx-auto flex items-center justify-center rounded-full text-sm text-gray-900 font-medium hover:bg-gray-100",
            day_selected: "bg-violet-500 text-white hover:bg-violet-600",
            day_today: "font-semibold text-violet-600",
            day_outside: "text-gray-300 opacity-50",
            day_disabled: "text-gray-300",
            day_range_middle: "bg-violet-50 text-violet-600 rounded-none",
            day_range_end: "rounded-r-full",
            day_range_start: "rounded-l-full",
            day_hidden: "invisible",
        }}
        formatters={{
            formatCaption: (date) => {
                return (
                    <div className="text-base font-medium text-center">
                        {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </div>
                );
            },
        }}
    />
));

DatePickerCalendar.displayName = "DatePickerCalendar";

const SellerWeightDisputePage = () => {
    const { disputes, loading, error, filters, updateFilters } = useWeightDisputes();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateFilters({ search: searchQuery });
    };

    const handleStatusChange = (value: string) => {
        const status = value as DisputeStatus | '';
        updateFilters({ status: status || undefined });
    };

    const handleTypeChange = (value: string) => {
        const type = value as DisputeType | '';
        updateFilters({ type: type || undefined });
    };

    const handlePriorityChange = (value: string) => {
        const priority = value as DisputePriority | '';
        updateFilters({ priority: priority || undefined });
    };

    const handleDateRangeChange = (startDate: string, endDate: string) => {
        updateFilters({ startDate, endDate });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-8">Weight Disputes</h1>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-8">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                    <Input
                        type="text"
                        placeholder="Search disputes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1"
                    />
                    <Select value={filters.status || ''} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-full md:w-40">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_review">In Review</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filters.type || ''} onValueChange={handleTypeChange}>
                        <SelectTrigger className="w-full md:w-40">
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All Types</SelectItem>
                            <SelectItem value="weight_mismatch">Weight Mismatch</SelectItem>
                            <SelectItem value="dimension_mismatch">Dimension Mismatch</SelectItem>
                            <SelectItem value="label_issue">Label Issue</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filters.priority || ''} onValueChange={handlePriorityChange}>
                        <SelectTrigger className="w-full md:w-40">
                            <SelectValue placeholder="All Priorities" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All Priorities</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button type="submit">Search</Button>
                </form>
            </div>

            {/* Disputes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {disputes.map((dispute) => (
                    <Card key={dispute.id} className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="font-semibold">Order #{dispute.orderId}</h3>
                                <p className="text-sm text-gray-500">
                                    Tracking: {dispute.trackingNumber}
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <Badge
                                    className={
                                        dispute.status === 'resolved'
                                            ? 'bg-green-100 text-green-800'
                                            : dispute.status === 'rejected'
                                            ? 'bg-red-100 text-red-800'
                                            : dispute.status === 'in_review'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-blue-100 text-blue-800'
                                    }
                                >
                                    {dispute.status}
                                </Badge>
                                <Badge
                                    className={
                                        dispute.priority === 'urgent'
                                            ? 'bg-red-100 text-red-800'
                                            : dispute.priority === 'high'
                                            ? 'bg-orange-100 text-orange-800'
                                            : dispute.priority === 'medium'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-green-100 text-green-800'
                                    }
                                >
                                    {dispute.priority}
                                </Badge>
                            </div>
                        </div>
                        <div className="space-y-2 mb-4">
                            <p className="text-sm">
                                <span className="font-medium">Type:</span> {dispute.type}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Weight Difference:</span>{' '}
                                {Math.abs(dispute.claimedWeight - dispute.actualWeight)} lbs
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Customer:</span>{' '}
                                {dispute.customer.name}
                            </p>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                                Created {formatDate(new Date(dispute.createdAt))}
                            </span>
                            <Button
                                variant="outline"
                                onClick={() => window.location.href = `/seller/dashboard/weight-dispute/${dispute.id}`}
                            >
                                View Details
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default SellerWeightDisputePage; 
