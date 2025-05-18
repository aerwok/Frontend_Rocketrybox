import { useState } from 'react';
import { useBulkOrders, useBulkOrderTemplates, useBulkOrderProgress } from '../../../../hooks/useBulkOrders';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../../../../components/ui/alert';
import { Progress } from '../../../../components/ui/progress';
import { Loader2, Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { BulkOrder } from '../../../../types/bulk-order';

/**
 * Bulk Order Upload Component
 * Handles file upload and template selection
 */
const BulkOrderUpload = () => {
    const { createBulkOrder, isLoading } = useBulkOrders();
    const { templates, isLoading: templatesLoading } = useBulkOrderTemplates();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile || !selectedTemplate) return;

        try {
            await createBulkOrder({
                file: selectedFile,
                templateId: selectedTemplate
            });
            setSelectedFile(null);
            setSelectedTemplate('');
        } catch (err) {
            // Error is handled by the hook
            console.error('Failed to create bulk order:', err);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Upload Bulk Orders</CardTitle>
                <CardDescription>Upload a CSV file to create multiple orders</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Select Template</label>
                        <select
                            value={selectedTemplate}
                            onChange={(e) => setSelectedTemplate(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            required
                            disabled={templatesLoading}
                        >
                            <option value="">Select a template</option>
                            {templates.map((template) => (
                                <option key={template.id} value={template.id}>
                                    {template.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Upload File</label>
                        <div className="border-2 border-dashed rounded-md p-4">
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-upload"
                                required
                            />
                            <label
                                htmlFor="file-upload"
                                className="flex flex-col items-center cursor-pointer"
                            >
                                <Upload className="h-8 w-8 text-gray-400" />
                                <span className="mt-2 text-sm text-gray-600">
                                    {selectedFile ? selectedFile.name : 'Click to upload CSV file'}
                                </span>
                            </label>
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading || !selectedFile || !selectedTemplate}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            'Upload Orders'
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

/**
 * Bulk Order List Component
 * Displays list of bulk orders with progress
 */
const BulkOrderList = () => {
    const { orders, isLoading, error, cancelBulkOrder } = useBulkOrders();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    if (orders.length === 0) {
        return (
            <Alert>
                <AlertTitle>No Orders</AlertTitle>
                <AlertDescription>No bulk orders found</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <BulkOrderItem
                    key={order.id}
                    order={order}
                    onCancel={() => cancelBulkOrder(order.id)}
                />
            ))}
        </div>
    );
};

/**
 * Bulk Order Item Component
 * Displays individual bulk order with progress
 */
const BulkOrderItem = ({ order, onCancel }: { order: BulkOrder; onCancel: () => void }) => {
    const { progress, isLoading } = useBulkOrderProgress(order.id);

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{order.metadata.fileName}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                            {format(new Date(order.metadata.startTime), 'PPP')}
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        {order.status === 'processing' && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onCancel}
                                disabled={isLoading}
                            >
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                            </Button>
                        )}
                        {order.status === 'completed' && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        {order.status === 'failed' && (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                    </div>
                </div>
                <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{progress?.progress || order.progress}%</span>
                    </div>
                    <Progress value={progress?.progress || order.progress} />
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>
                            {progress?.completedOrders || order.completedOrders} completed
                        </span>
                        <span>
                            {progress?.failedOrders || order.failedOrders} failed
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

/**
 * Bulk Orders Page Component
 * Main component for the bulk orders dashboard
 */
export default function BulkOrdersPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Bulk Orders</h1>
            <div className="grid gap-8 md:grid-cols-2">
                <BulkOrderUpload />
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Recent Orders</h2>
                    <BulkOrderList />
                </div>
            </div>
        </div>
    );
}
