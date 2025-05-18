import { useEffect } from 'react';
import { useBilling, useBillingHistory } from '../../../../hooks/useBilling';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Alert, AlertDescription } from '../../../../components/ui/alert';
import { Loader2, Download, CreditCard, Calendar, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

/**
 * Billing Summary Component
 * Displays current plan, subscription details, and payment methods
 */
const BillingSummary = () => {
    const { summary, isLoading, error, cancelSubscription } = useBilling();

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
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    if (!summary) {
        return (
            <Alert>
                <AlertDescription>No billing information available</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Current Plan</CardTitle>
                    <CardDescription>{summary.currentPlan.name}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Next Billing Date</span>
                            <span className="font-medium">
                                {format(new Date(summary.nextBillingDate), 'PPP')}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Total Amount</span>
                            <span className="font-medium">${summary.totalAmount}</span>
                        </div>
                        <Button
                            variant="destructive"
                            onClick={cancelSubscription}
                            className="w-full"
                        >
                            Cancel Subscription
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage your payment methods</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {summary.paymentMethods.map((method) => (
                            <div
                                key={method.id}
                                className="flex items-center justify-between p-4 border rounded-lg"
                            >
                                <div className="flex items-center space-x-4">
                                    <CreditCard className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="font-medium">
                                            {method.type === 'credit_card'
                                                ? `${method.details.brand} ending in ${method.details.last4}`
                                                : method.type}
                                        </p>
                                        {method.isDefault && (
                                            <span className="text-sm text-green-600">Default</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <Button variant="outline" className="w-full">
                            Add Payment Method
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

/**
 * Billing History Component
 * Displays invoice history with download functionality
 */
const BillingHistory = () => {
    const { history, isLoading, error, fetchHistory, downloadInvoice } = useBillingHistory();

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

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
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    if (!history || history.invoices.length === 0) {
        return (
            <Alert>
                <AlertDescription>No billing history available</AlertDescription>
            </Alert>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>View and download your invoices</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {history.invoices.map((invoice) => (
                        <div
                            key={invoice.id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                        >
                            <div className="space-y-1">
                                <p className="font-medium">Invoice #{invoice.id}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        {format(new Date(invoice.dueDate), 'PPP')}
                                    </div>
                                    <div className="flex items-center">
                                        <DollarSign className="h-4 w-4 mr-1" />
                                        ${invoice.amount}
                                    </div>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => downloadInvoice(invoice.id)}
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

/**
 * Billing Page Component
 * Main component for the billing dashboard
 */
export default function BillingPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Billing & Subscription</h1>
            <div className="grid gap-8 md:grid-cols-2">
                <BillingSummary />
                <BillingHistory />
            </div>
        </div>
    );
} 