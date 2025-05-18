import { api } from './index';

/**
 * Upload API service
 * 
 * This service handles all file upload-related API calls:
 * - File uploads with progress tracking
 * - File validation
 * - Upload status checks
 * 
 * TODO: Replace placeholder endpoints with actual API endpoints when ready
 */
export const uploadApi = {
    /**
     * Upload a file with progress tracking
     * @param {FormData} formData - Form data containing the file
     * @param {function} onProgress - Progress callback function
     * @returns {Promise<any>} Upload response
     */
    uploadFile: (formData: FormData, onProgress?: (progress: number) => void) => {
        return api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    onProgress?.(progress);
                }
            },
        });
    },

    /**
     * Validate file before upload
     * @param {FormData} formData - Form data containing the file
     * @returns {Promise<{ isValid: boolean; errors: string[] }>}
     */
    validateFile: (formData: FormData) => {
        return api.post('/upload/validate', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    /**
     * Get upload status
     * @param {string} uploadId - Upload identifier
     * @returns {Promise<{ status: string; progress: number }>}
     */
    getUploadStatus: (uploadId: string) => {
        return api.get(`/upload/status/${uploadId}`);
    },
}; 