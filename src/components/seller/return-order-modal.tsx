import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Upload, Loader2 } from "lucide-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useReturnOrder } from "@/hooks/useReturnOrder";

interface ReturnOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: string;
}

/**
 * Return Order Modal Component
 * 
 * This component handles:
 * - Return order form
 * - Image upload and management
 * - Form submission
 * - Loading and error states
 * 
 * @param {ReturnOrderModalProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const ReturnOrderModal = ({ isOpen, onClose, orderId }: ReturnOrderModalProps) => {
    const {
        form,
        isSubmitting,
        error,
        uploadedImages,
        handleImageUpload,
        removeImage,
        handleSubmit,
    } = useReturnOrder({
        orderId,
        onSuccess: () => {
            toast.success("Return request submitted successfully");
            onClose();
        },
        onError: (error) => {
            toast.error(error.message || "Failed to submit return request");
        },
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent showCloseButton={false} className="max-w-md">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle className="text-lg">
                        Return Order #{orderId}
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
                        <FormField
                            control={form.control}
                            name="returnReason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Return Reason *
                                    </FormLabel>
                                    <Select 
                                        onValueChange={field.onChange} 
                                        defaultValue={field.value}
                                        disabled={isSubmitting}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select return reason" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="DAMAGED">Damaged Product</SelectItem>
                                            <SelectItem value="WRONG_ITEM">Wrong Product Delivered</SelectItem>
                                            <SelectItem value="NOT_AS_DESCRIBED">Product Not As Described</SelectItem>
                                            <SelectItem value="MISSING_PARTS">Missing Parts/Accessories</SelectItem>
                                            <SelectItem value="DEFECTIVE">Defective Product</SelectItem>
                                            <SelectItem value="OTHER">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="returnType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Return Type *
                                    </FormLabel>
                                    <Select 
                                        onValueChange={field.onChange} 
                                        defaultValue={field.value}
                                        disabled={isSubmitting}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select return type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="REFUND">Refund</SelectItem>
                                            <SelectItem value="REPLACEMENT">Replacement</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Additional Details
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Provide additional details about the return"
                                            className="resize-none"
                                            {...field}
                                            disabled={isSubmitting}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div>
                            <FormLabel>
                                Upload Images (Optional)
                            </FormLabel>
                            <div className="mt-2 flex items-center gap-2">
                                <label
                                    htmlFor="image-upload"
                                    className="flex items-center gap-2 px-4 py-2 border border-dashed rounded-md cursor-pointer hover:bg-gray-50"
                                >
                                    <Upload className="h-4 w-4" />
                                    <span className="text-sm">Upload</span>
                                    <input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleImageUpload}
                                        disabled={isSubmitting}
                                    />
                                </label>
                            </div>
                            {uploadedImages.length > 0 && (
                                <div className="mt-3 grid grid-cols-3 gap-2">
                                    {uploadedImages.map((image, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={image}
                                                alt={`Uploaded ${index + 1}`}
                                                className="h-20 w-20 object-cover rounded-md"
                                            />
                                            <button
                                                type="button"
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                                onClick={() => removeImage(index)}
                                                disabled={isSubmitting}
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

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
                                    'Submit Return'
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default ReturnOrderModal; 