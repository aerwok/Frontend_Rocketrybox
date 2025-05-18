import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReturnOrderInput, returnOrderSchema } from '@/lib/validations/order-actions';
import { returnApi } from '@/services/api/return';

interface UseReturnOrderProps {
    orderId: string;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

interface UseReturnOrderReturn {
    form: ReturnType<typeof useForm<ReturnOrderInput>>;
    isSubmitting: boolean;
    error: string | null;
    uploadedImages: string[];
    handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    removeImage: (index: number) => void;
    handleSubmit: (data: ReturnOrderInput) => Promise<void>;
}

/**
 * Custom hook for managing return order functionality
 * 
 * This hook handles:
 * - Form state management using react-hook-form
 * - Image upload and management
 * - API integration for return requests
 * - Loading and error states
 * 
 * @param {UseReturnOrderProps} props - Hook configuration
 * @returns {UseReturnOrderReturn} Hook methods and state
 */
export const useReturnOrder = ({ 
    orderId, 
    onSuccess, 
    onError 
}: UseReturnOrderProps): UseReturnOrderReturn => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);

    const form = useForm<ReturnOrderInput>({
        resolver: zodResolver(returnOrderSchema),
        defaultValues: {
            orderId,
            returnReason: "",
            returnType: "REFUND",
            description: "",
            images: [],
        },
    });

    /**
     * Handles image upload and validation
     * @param {React.ChangeEvent<HTMLInputElement>} event - File input change event
     */
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files);
            const imageUrls = files.map(file => URL.createObjectURL(file));
            setUploadedImages(prev => [...prev, ...imageUrls]);
            form.setValue("images", [...uploadedImages, ...imageUrls]);
        }
    };

    /**
     * Removes an image from the uploaded images list
     * @param {number} index - Index of the image to remove
     */
    const removeImage = (index: number) => {
        const newImages = [...uploadedImages];
        newImages.splice(index, 1);
        setUploadedImages(newImages);
        form.setValue("images", newImages);
    };

    /**
     * Handles form submission and API integration
     * @param {ReturnOrderInput} data - Form data
     */
    const handleSubmit = async (data: ReturnOrderInput) => {
        try {
            setIsSubmitting(true);
            setError(null);

            // TODO: Replace with actual API endpoint when ready
            await returnApi.submitReturn(data);

            onSuccess?.();
        } catch (err) {
            const error = err as Error;
            setError(error.message || "Failed to submit return request");
            onError?.(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        form,
        isSubmitting,
        error,
        uploadedImages,
        handleImageUpload,
        removeImage,
        handleSubmit,
    };
}; 