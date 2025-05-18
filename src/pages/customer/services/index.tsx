import { useEffect } from 'react';
import { useServices, useServiceBookings } from '@/hooks/useServices';
import { Service } from '@/services/api/services';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Service Card Component
 * Displays individual service information
 */
const ServiceCard = ({ service }: { service: Service }) => {
    const { createBooking } = useServiceBookings();

    const handleBook = async () => {
        try {
            await createBooking({
                serviceId: service.id,
                scheduledDate: new Date().toISOString(), // This should be replaced with a date picker
                notes: ''
            });
        } catch (error) {
            // Error is handled in the hook
        }
    };

    return (
        <Card className="p-4">
            {service.image && (
                <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                />
            )}
            <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
            <p className="text-gray-600 mb-4">{service.description}</p>
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-lg font-bold">₹{service.price}</p>
                    <p className="text-sm text-gray-500">{service.duration} minutes</p>
                </div>
                <Button onClick={handleBook}>Book Now</Button>
            </div>
        </Card>
    );
};

/**
 * Category List Component
 * Displays service categories for filtering
 */
const CategoryList = () => {
    const { categories, selectedCategory, selectCategory } = useServices();

    return (
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
            <Button
                variant={selectedCategory === null ? 'primary' : 'outline'}
                onClick={() => selectCategory(null)}
            >
                All
            </Button>
            {categories.map((category) => (
                <Button
                    key={category.id}
                    variant={selectedCategory?.id === category.id ? 'primary' : 'outline'}
                    onClick={() => selectCategory(category)}
                >
                    {category.name}
                </Button>
            ))}
        </div>
    );
};

/**
 * Services Page Component
 * 
 * Displays:
 * - Service categories for filtering
 * - List of available services
 * - Loading states
 * - Error handling
 */
const ServicesPage = () => {
    const { services, isLoading, error, getServices, getCategories } = useServices();

    useEffect(() => {
        getServices();
        getCategories();
    }, [getServices, getCategories]);

    if (isLoading) {
        return (
            <div className="container mx-auto py-6 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-6 text-center">
                <p className="text-red-500">{error}</p>
                <Button
                    onClick={() => {
                        getServices();
                        getCategories();
                    }}
                    className="mt-4"
                >
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-bold mb-6">Our Services</h1>
            <CategoryList />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                ))}
            </div>
            {services.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No services found</p>
                </div>
            )}
        </div>
    );
};

export default ServicesPage; 