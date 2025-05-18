import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useAddress, addressSchema, type AddressFormValues } from "@/hooks/useAddress";
import { Loader2 } from "lucide-react";

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: AddressFormValues) => void;
}

/**
 * Address Modal Component
 * 
 * This component handles:
 * - Address form input and validation
 * - Loading states during submission
 * - Error handling and display
 * - Form submission and reset
 * 
 * @param {AddressModalProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const AddressModal = ({ isOpen, onClose, onSubmit }: AddressModalProps) => {
    const { loading, error, success, addAddress, resetState } = useAddress();

    const form = useForm<AddressFormValues>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            address1: "",
            address2: "",
            city: "",
            state: "",
            pincode: "",
            phone: "",
        },
    });

    const handleSubmit = async (data: AddressFormValues) => {
        try {
            await addAddress(data);
            onSubmit(data);
            form.reset();
            onClose();
        } catch (err) {
            // Error is handled by the useAddress hook
            console.error('Failed to add address:', err);
        }
    };

    const handleClose = () => {
        resetState();
        form.reset();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        Add New Address
                    </DialogTitle>
                </DialogHeader>

                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                        {error}
                    </div>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="address1"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Address Line 1
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter address line 1"
                                            className="bg-[#99BCDDB5]"
                                            disabled={loading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="address2"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Address Line 2 (Optional)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter address line 2"
                                            className="bg-[#99BCDDB5]"
                                            disabled={loading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            City
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter city"
                                                className="bg-[#99BCDDB5]"
                                                disabled={loading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            State
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter state"
                                                className="bg-[#99BCDDB5]"
                                                disabled={loading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="pincode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Pincode
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter pincode"
                                                className="bg-[#99BCDDB5]"
                                                maxLength={6}
                                                disabled={loading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Phone Number
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter phone number"
                                                className="bg-[#99BCDDB5]"
                                                maxLength={10}
                                                disabled={loading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    type="submit"
                                    variant="customer"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Adding...
                                        </>
                                    ) : (
                                        'Add Address'
                                    )}
                                </Button>
                            </motion.div>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddressModal; 