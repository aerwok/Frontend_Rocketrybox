import { useState } from 'react';
import { disputeApi } from '@/services/api/dispute';

interface UseBulkDisputeUploadReturn {
    selectedFile: File | null;
    isUploading: boolean;
    error: string | null;
    setSelectedFile: (file: File | null) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleUpload: () => Promise<void>;
    handleDownloadSample: (format: 'csv' | 'excel') => Promise<void>;
}

/**
 * Custom hook for managing bulk dispute uploads
 * 
 * This hook handles:
 * - File selection and validation
 * - File upload to API
 * - Sample template downloads
 * - Loading and error states
 * 
 * @returns {UseBulkDisputeUploadReturn} Object containing upload state and methods
 */
export const useBulkDisputeUpload = (): UseBulkDisputeUploadReturn => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Handle file selection and validation
     * @param {React.ChangeEvent<HTMLInputElement>} e - File input change event
     */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            setError("File size should be less than 10MB");
            return;
        }

        // Validate file type
        const validTypes = ['.xlsx', '.xls', '.csv'];
        const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        if (!validTypes.includes(fileExtension)) {
            setError("Invalid file format. Please upload .xlsx, .xls, or .csv files");
            return;
        }

        setSelectedFile(file);
        setError(null);
    };

    /**
     * Upload selected file to API
     * TODO: Replace with actual API endpoint when ready
     */
    const handleUpload = async () => {
        if (!selectedFile) return;

        try {
            setIsUploading(true);
            setError(null);

            const formData = new FormData();
            formData.append("file", selectedFile);

            // TODO: Replace with actual API call
            // await disputeApi.uploadBulkDisputes(formData);
            
            // For now, simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload dispute report');
            throw err;
        } finally {
            setIsUploading(false);
        }
    };

    /**
     * Download sample template file
     * @param {string} format - File format ('csv' | 'excel')
     * TODO: Replace with actual API endpoint when ready
     */
    const handleDownloadSample = async (format: 'csv' | 'excel') => {
        try {
            // TODO: Replace with actual API call
            // const response = await disputeApi.downloadTemplate(format);
            // const blob = new Blob([response.data]);
            // const url = window.URL.createObjectURL(blob);
            
            // For now, use static file paths
            const url = format === 'csv' 
                ? '/docs/weight_dispute_template.csv'
                : '/docs/weight_dispute_template.xlsx';

            const link = document.createElement('a');
            link.href = url;
            link.download = `weight_dispute_template.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to download sample template');
            throw err;
        }
    };

    return {
        selectedFile,
        isUploading,
        error,
        setSelectedFile,
        handleFileChange,
        handleUpload,
        handleDownloadSample,
    };
}; 