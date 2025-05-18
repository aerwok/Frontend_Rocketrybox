import { useState } from 'react';
import { useTracking, getStatusColor } from '@/hooks/useTracking';
import { TrackingStatus, TrackingEvent } from '@/services/api/tracking';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Tracking Timeline Component
 * Displays tracking events in a vertical timeline
 */
const TrackingTimeline = ({ events }: { events: TrackingEvent[] }) => {
    return (
        <div className="space-y-4">
            {events.map((event, index) => (
                <div key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(event.status)}`} />
                        {index !== events.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-200" />
                        )}
                    </div>
                    <div className="flex-1 pb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-medium">{event.status}</p>
                                <p className="text-sm text-gray-600">{event.location}</p>
                            </div>
                            <p className="text-sm text-gray-500">
                                {new Date(event.timestamp).toLocaleString()}
                            </p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

/**
 * Track Order Page Component
 * 
 * Features:
 * - AWB number input
 * - Tracking information display
 * - Tracking timeline
 * - Loading states
 * - Error handling
 */
const TrackOrderPage = () => {
    const [awbNumber, setAwbNumber] = useState('');
    const { trackingInfo, isLoading, error, getTrackingInfo } = useTracking();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!awbNumber.trim()) {
            toast.error('Please enter an AWB number');
            return;
        }
        await getTrackingInfo(awbNumber);
    };

    return (
        <div className="container mx-auto py-6">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Track Your Order</h1>

                <form onSubmit={handleSubmit} className="mb-8">
                    <div className="flex gap-2">
                        <Input
                            type="text"
                            placeholder="Enter AWB Number"
                            value={awbNumber}
                            onChange={(e) => setAwbNumber(e.target.value)}
                            disabled={isLoading}
                        />
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Search className="w-4 h-4" />
                            )}
                        </Button>
                    </div>
                </form>

                {isLoading && (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                )}

                {error && (
                    <div className="text-center py-8">
                        <p className="text-red-500">{error}</p>
                        <Button
                            onClick={() => getTrackingInfo(awbNumber)}
                            className="mt-4"
                        >
                            Retry
                        </Button>
                    </div>
                )}

                {trackingInfo && !isLoading && !error && (
                    <div className="space-y-6">
                        <Card className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-lg font-semibold mb-1">
                                        AWB: {trackingInfo.awbNumber}
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        Current Location: {trackingInfo.currentLocation}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(trackingInfo.status)}`}>
                                    {trackingInfo.status}
                                </span>
                            </div>
                            {trackingInfo.estimatedDelivery && (
                                <p className="text-sm text-gray-600">
                                    Estimated Delivery: {new Date(trackingInfo.estimatedDelivery).toLocaleDateString()}
                                </p>
                            )}
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Tracking Timeline</h3>
                            <TrackingTimeline events={trackingInfo.events} />
                        </Card>
                    </div>
                )}

                {!trackingInfo && !isLoading && !error && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Enter an AWB number to track your order</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrderPage; 