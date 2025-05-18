import { Input } from "@/components/ui/input";
import { FileSpreadsheet, UploadCloud, Loader2 } from "lucide-react";
import { useFileUpload } from "@/hooks/useFileUpload";
import { toast } from "sonner";

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    accept?: string;
    maxSize?: number;
}

/**
 * File Upload Component
 * 
 * This component handles:
 * - File selection via click or drag-and-drop
 * - File validation (type and size)
 * - Upload progress tracking
 * - Loading and error states
 * - Success callbacks
 * 
 * @param {FileUploadProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const FileUpload = ({ 
    onFileSelect, 
    accept = ".xls,.xlsx,.csv", 
    maxSize = 5 
}: FileUploadProps) => {
    const {
        file,
        isUploading,
        error,
        progress,
        handleFileSelect,
        handleFileDrop,
        reset,
    } = useFileUpload({
        accept,
        maxSize,
        onUploadSuccess: (response) => {
            toast.success("File uploaded successfully");
            onFileSelect(file!);
        },
        onUploadError: (error) => {
            toast.error(error.message);
        },
    });

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            e.currentTarget.classList.add("border-violet-500", "bg-violet-50");
        } else if (e.type === "dragleave") {
            e.currentTarget.classList.remove("border-violet-500", "bg-violet-50");
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove("border-violet-500", "bg-violet-50");

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFileDrop(droppedFile);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    return (
        <div className="w-full">
            <div
                className="relative border-2 border-dashed rounded-lg p-6 border-gray-300 bg-gray-50"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <Input
                    type="file"
                    accept={accept}
                    onChange={handleInputChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                />
                <div className="text-center">
                    {isUploading ? (
                        <div className="flex flex-col items-center justify-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
                            <p className="text-sm text-gray-600">
                                Uploading... {progress}%
                            </p>
                        </div>
                    ) : file ? (
                        <div className="flex items-center justify-center gap-2">
                            <FileSpreadsheet className="h-8 w-8 text-violet-500" />
                            <div>
                                <p className="text-sm font-medium">
                                    {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">
                                Drag and drop your file here, or click to browse
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                                Supported formats: {accept} (Max {maxSize}MB)
                            </p>
                        </>
                    )}
                </div>
            </div>
            {error && (
                <p className="mt-2 text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
};

export default FileUpload; 