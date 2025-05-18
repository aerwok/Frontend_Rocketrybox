import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useShippingRates } from "@/hooks/useShippingRates";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShippingOptionsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    singleOrderId: string;
    onSubmit: (data: {
        courier: string;
        mode: string;
        charges: {
            shippingCharge: number;
            codCharge: number;
            gst: number;
            total: number;
        };
    }) => void;
    isCOD?: boolean;
}

/**
 * ShippingOptionsModal Component
 * 
 * This component renders a modal for selecting shipping options, including:
 * - Warehouse selection
 * - Shipping rate calculation
 * - Courier selection
 * - Rate display
 * 
 * @param {ShippingOptionsModalProps} props - Component props
 * @returns {JSX.Element} The rendered modal
 */
export function ShippingOptionsModal({
    open,
    onOpenChange,
    singleOrderId,
    onSubmit,
    isCOD = false
}: ShippingOptionsModalProps) {
    const [warehouse, setWarehouse] = useState("400001");
    const [rtoWarehouse, setRtoWarehouse] = useState("400001");
    const [showAddress, setShowAddress] = useState(false);
    const [selectedCourier, setSelectedCourier] = useState("");
    const [selectedMode, setSelectedMode] = useState("");

    // Use shipping rates hook
    const {
        rates: courierRates,
        currentZone,
        isLoading,
        error,
    } = useShippingRates({
        warehousePincode: warehouse,
        destinationPincode: "110001", // TODO: Get from order details
        weight: 0.5, // TODO: Get from order details
        isCOD,
    });

    /**
     * Handle courier selection
     * @param {ShippingRate} rate - Selected shipping rate
     */
    const handleCourierSelect = (rate: any) => {
        setSelectedCourier(rate.courier);
        setSelectedMode(rate.mode);
    };

    /**
     * Handle form submission
     */
    const handleSubmit = () => {
        if (selectedCourier && selectedMode) {
            const selectedRate = courierRates.find(
                rate => rate.courier === selectedCourier && rate.mode === selectedMode
            );

            if (selectedRate) {
                onSubmit({
                    courier: selectedCourier,
                    mode: selectedMode,
                    charges: {
                        shippingCharge: selectedRate.baseCharge + selectedRate.additionalWeightCharge,
                        codCharge: selectedRate.codCharge,
                        gst: selectedRate.gst,
                        total: selectedRate.total
                    }
                });
                onOpenChange(false);
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Select Shipping Options for Order #{singleOrderId}</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                    {/* Warehouse Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Warehouse Pincode</label>
                            <Input
                                value={warehouse}
                                onChange={(e) => setWarehouse(e.target.value)}
                                placeholder="Enter warehouse pincode"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">RTO Warehouse Pincode</label>
                            <Input
                                value={rtoWarehouse}
                                onChange={(e) => setRtoWarehouse(e.target.value)}
                                placeholder="Enter RTO warehouse pincode"
                            />
                        </div>
                    </div>

                    {/* Address Toggle */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="showAddress"
                            checked={showAddress}
                            onCheckedChange={(checked) => setShowAddress(checked as boolean)}
                        />
                        <label htmlFor="showAddress" className="text-sm font-medium">
                            Show Address
                        </label>
                    </div>

                    {/* Zone and Weight Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium">Zone</p>
                                <p className="text-sm text-gray-600 capitalize">
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : error ? (
                                        <span className="text-destructive">Error</span>
                                    ) : (
                                        currentZone.replace(/([A-Z])/g, ' $1').trim()
                                    )}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Weight</p>
                                <p className="text-sm text-gray-600">0.5 kg</p>
                            </div>
                        </div>
                    </div>

                    {/* Courier Rates Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left">Select</th>
                                    <th className="px-4 py-2 text-left">Courier</th>
                                    <th className="px-4 py-2 text-left">Mode</th>
                                    {isCOD && <th className="px-4 py-2 text-right">COD</th>}
                                    <th className="px-4 py-2 text-right">Shipping</th>
                                    <th className="px-4 py-2 text-right">GST ({courierRates[0]?.gstPercentage || 18}%)</th>
                                    <th className="px-4 py-2 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={isCOD ? 7 : 6} className="px-4 py-8 text-center">
                                            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan={isCOD ? 7 : 6} className="px-4 py-8 text-center text-destructive">
                                            {error}
                                        </td>
                                    </tr>
                                ) : (
                                    courierRates.map((rate, index) => (
                                        <tr
                                            key={index}
                                            className={cn(
                                                index % 2 === 0 ? "bg-white" : "bg-gray-50",
                                                selectedCourier === rate.courier && selectedMode === rate.mode
                                                    ? "bg-blue-50"
                                                    : ""
                                            )}
                                        >
                                            <td className="px-4 py-2">
                                                <input
                                                    type="radio"
                                                    name="courier"
                                                    checked={selectedCourier === rate.courier && selectedMode === rate.mode}
                                                    onChange={() => handleCourierSelect(rate)}
                                                />
                                            </td>
                                            <td className="px-4 py-2">{rate.courier}</td>
                                            <td className="px-4 py-2">{rate.mode.split("-")[0].split(" ")[2]}</td>
                                            {isCOD && <td className="px-4 py-2 text-right">₹{rate.codCharge.toFixed(2)}</td>}
                                            <td className="px-4 py-2 text-right">₹{(rate.baseCharge + rate.additionalWeightCharge).toFixed(2)}</td>
                                            <td className="px-4 py-2 text-right">₹{rate.gst.toFixed(2)}</td>
                                            <td className="px-4 py-2 text-right font-medium">₹{rate.total.toFixed(2)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleSubmit}
                            disabled={!selectedCourier || !selectedMode || isLoading}
                            className="bg-primary text-white px-4 py-2 rounded-md disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Confirm Selection"
                            )}
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
} 