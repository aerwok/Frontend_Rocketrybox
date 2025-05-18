import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { type CreateOrderInput } from "@/lib/validations/order";
import { Button } from "@/components/ui/button";
import { ChevronsUpDownIcon, Loader2 } from "lucide-react";
import { useCourierRates, type SortField } from "@/hooks/useCourierRates";

interface CourierRatesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect?: (courierType: string) => void;
}

/**
 * Courier Rates Modal Component
 * 
 * This component handles:
 * - Displaying available courier rates
 * - Sorting and filtering rates
 * - Loading states during data fetch
 * - Error handling and display
 * - Courier selection
 * 
 * @param {CourierRatesModalProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const CourierRatesModal = ({ isOpen, onClose, onSelect }: CourierRatesModalProps) => {
    const form = useFormContext<CreateOrderInput>();
    const {
        rates,
        loading,
        error,
        sortField,
        sortOrder,
        setSortField,
        setSortOrder,
    } = useCourierRates();

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    const handleShipSelected = () => {
        const selectedCourier = form.watch("courierType");
        if (selectedCourier) {
            if (onSelect) {
                onSelect(selectedCourier);
                form.clearErrors("courierType");
            } else {
                onClose();
            }
        } else {
            form.setError("courierType", {
                type: "manual",
                message: "Please select a courier before continuing"
            });
        }
    };

    const SortableHeader = ({ field, label }: { field: SortField; label: string }) => (
        <th
            className="p-3 text-left font-medium cursor-pointer group"
            onClick={() => handleSort(field)}
        >
            <div className="flex items-center gap-2">
                {label}
                <ChevronsUpDownIcon
                    className={`size-4 transition-colors ${sortField === field
                        ? "text-white"
                        : "text-white/50 group-hover:text-white"
                        }`}
                />
            </div>
        </th>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle>
                        Shipping Options
                    </DialogTitle>
                </DialogHeader>

                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                        {error}
                    </div>
                )}

                <div className="mt-4">
                    <FormField
                        control={form.control}
                        name="courierType"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="space-y-2"
                                    >
                                        <div className="rounded-lg border overflow-auto md:overflow-hidden">
                                            <table className="w-full">
                                                <thead className="bg-main text-white text-sm">
                                                    <tr>
                                                        <SortableHeader field="courier" label="Courier" />
                                                        <SortableHeader field="mode" label="Mode" />
                                                        <SortableHeader field="shipping" label="Shipping (₹)" />
                                                        <SortableHeader field="gst" label="GST (18%)" />
                                                        <SortableHeader field="total" label="Total (₹)" />
                                                        <th className="p-3 text-left font-medium">
                                                            #
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {loading ? (
                                                        <tr>
                                                            <td colSpan={6} className="p-8 text-center">
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                    Loading courier rates...
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ) : rates.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                                                No courier rates available
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        rates.map((rate, index) => (
                                                            <motion.tr
                                                                key={index}
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: index * 0.1 }}
                                                                className="border-t hover:bg-muted/50"
                                                            >
                                                                <td className="p-3">
                                                                    <div className="flex items-center gap-3">
                                                                        <img
                                                                            src={rate.image}
                                                                            alt={rate.courier}
                                                                            className="h-8 w-auto object-contain"
                                                                        />
                                                                        <span className="sr-only">
                                                                            {rate.courier}
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td className="p-3">
                                                                    {rate.mode}
                                                                </td>
                                                                <td className="p-3 text-left pl-4">
                                                                    ₹{rate.shipping}
                                                                </td>
                                                                <td className="p-3 text-left pl-4">
                                                                    ₹{rate.gst}
                                                                </td>
                                                                <td className="p-3 text-left pl-4 font-medium">
                                                                    ₹{rate.total}
                                                                </td>
                                                                <td className="p-3 text-left">
                                                                    <FormControl>
                                                                        <RadioGroupItem
                                                                            value={rate.courier}
                                                                            className="mt-1"
                                                                        />
                                                                    </FormControl>
                                                                </td>
                                                            </motion.tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </RadioGroup>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Close
                    </Button>
                    <Button
                        variant="customer"
                        onClick={handleShipSelected}
                        disabled={loading || !form.watch("courierType")}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            'Ship Selected'
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CourierRatesModal; 