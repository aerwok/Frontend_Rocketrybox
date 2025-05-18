import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TicketFormValues, ticketFormSchema } from '@/lib/validations/support';
import { supportApi } from '@/services/api/support';

interface UseTicketCreationReturn {
    form: ReturnType<typeof useForm<TicketFormValues>>;
    isSubmitting: boolean;
    error: string | null;
    handleSubmit: (data: TicketFormValues) => Promise<void>;
}

/**
 * Custom hook for managing ticket creation
 * 
 * This hook handles:
 * - Form state management using react-hook-form
 * - Form validation using zod
 * - File upload handling
 * - API integration for ticket creation
 * - Loading and error states
 * 
 * @returns {UseTicketCreationReturn} Object containing form state and methods
 */
export const useTicketCreation = (): UseTicketCreationReturn => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<TicketFormValues>({
        resolver: zodResolver(ticketFormSchema),
        defaultValues: {
            subject: "",
            contactNumber: "",
            details: "",
            category: "",
            attachments: undefined,
        },
    });

    /**
     * Handle form submission
     * @param {TicketFormValues} data - Form data
     */
    const handleSubmit = async (data: TicketFormValues) => {
        try {
            setIsSubmitting(true);
            setError(null);

            // Create FormData for file upload
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (key === 'attachments' && value) {
                    Array.from(value as FileList).forEach((file) => {
                        formData.append('attachments', file);
                    });
                } else {
                    formData.append(key, value as string);
                }
            });

            // TODO: Replace with actual API call
            // await supportApi.createTicket(formData);
            
            // For now, simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            form.reset();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create ticket');
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        form,
        isSubmitting,
        error,
        handleSubmit,
    };
}; 