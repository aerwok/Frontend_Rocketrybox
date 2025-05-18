import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useReattemptOrder } from "@/hooks/useReattemptOrder";

interface ReattemptOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: string;
    currentAddress?: {
        fullName?: string;
        contactNumber?: string;
        addressLine1?: string;
        addressLine2?: string;
        landmark?: string;
        pincode?: string;
        city?: string;
        state?: string;
    } | null;
}

/**
 * Reattempt Order Modal Component
 * 
 * This component handles:
 * - Reattempt order form
 * - Address validation
 * - Form submission
 * - Loading and error states
 * 
 * @param {ReattemptOrderModalProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const ReattemptOrderModal = ({ isOpen, onClose, orderId, currentAddress }: ReattemptOrderModalProps) => {
    const {
        form,
        isSubmitting,
        error,
        handleSubmit,
    } = useReattemptOrder({
        orderId,
        currentAddress,
        onSuccess: () => {
            toast.success("Reattempt request submitted successfully");
            onClose();
        },
        onError: (error) => {
            toast.error(error.message || "Failed to submit reattempt request");
        },
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent showCloseButton={false} className="max-w-md">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle className="text-lg">
                        Reattempt Delivery for Order #{orderId}
                    </DialogTitle>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium">
                                Contact Information
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs">
                                                Full Name *
                                            </FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder="Full Name" 
                                                    {...field} 
                                                    disabled={isSubmitting}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="contactNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs">
                                                Contact Number *
                                            </FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder="Contact Number" 
                                                    {...field} 
                                                    disabled={isSubmitting}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-medium">
                                Delivery Address
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                <FormField
                                    control={form.control}
                                    name="addressLine1"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs">
                                                Address Line 1 *
                                            </FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder="Address Line 1" 
                                                    {...field} 
                                                    disabled={isSubmitting}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="addressLine2"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs">
                                                Address Line 2
                                            </FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder="Address Line 2" 
                                                    {...field} 
                                                    disabled={isSubmitting}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="landmark"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs">
                                                Landmark
                                            </FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder="Landmark" 
                                                    {...field} 
                                                    disabled={isSubmitting}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="pincode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs">
                                                    Pincode *
                                                </FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        placeholder="Pincode" 
                                                        {...field} 
                                                        disabled={isSubmitting}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="city"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs">
                                                    City *
                                                </FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        placeholder="City" 
                                                        {...field} 
                                                        disabled={isSubmitting}
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
                                                <FormLabel className="text-xs">
                                                    State *
                                                </FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        placeholder="State" 
                                                        {...field} 
                                                        disabled={isSubmitting}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="reattemptReason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Reason for Reattempt *
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Provide reason for reattempt"
                                            className="resize-none"
                                            {...field}
                                            disabled={isSubmitting}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {error && (
                            <p className="text-sm text-red-500">
                                {error}
                            </p>
                        )}

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="default"
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Reattempt'
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default ReattemptOrderModal; 