import { useState } from 'react';
import { useRateCalculator, usePincode, useServiceTypes } from '@/hooks/useRateCalculator';
import { RateCalculationInput } from '@/types/rate-calculator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Calculator, MapPin, Package, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Rate Calculator Page Component
 * Allows users to calculate shipping rates based on various parameters
 */
export default function RateCalculatorPage() {
  const { result, loading, error, calculateRate } = useRateCalculator();
  const { validatePincode } = usePincode();
  const { serviceTypes, loading: serviceTypesLoading } = useServiceTypes();

  const [formData, setFormData] = useState<RateCalculationInput>({
    weight: 0,
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
    },
    sourcePincode: '',
    destinationPincode: '',
    serviceType: 'standard',
    paymentMode: 'prepaid',
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('dimensions.')) {
      const dimension = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          [dimension]: parseFloat(value) || 0,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'weight' ? parseFloat(value) || 0 : value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate pincodes
    const isSourceValid = await validatePincode(formData.sourcePincode);
    const isDestinationValid = await validatePincode(formData.destinationPincode);

    if (!isSourceValid || !isDestinationValid) {
      toast.error('Please enter valid pincodes');
      return;
    }

    // Calculate rate
    await calculateRate(formData);
  };

  if (serviceTypesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Rate Calculator Form */}
        <Card>
          <CardHeader>
            <CardTitle>Rate Calculator</CardTitle>
            <CardDescription>Calculate shipping rates for your packages</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Package Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Package Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.weight}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Dimensions (cm)</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        name="dimensions.length"
                        placeholder="Length"
                        type="number"
                        min="0"
                        value={formData.dimensions.length}
                        onChange={handleInputChange}
                        required
                      />
                      <Input
                        name="dimensions.width"
                        placeholder="Width"
                        type="number"
                        min="0"
                        value={formData.dimensions.width}
                        onChange={handleInputChange}
                        required
                      />
                      <Input
                        name="dimensions.height"
                        placeholder="Height"
                        type="number"
                        min="0"
                        value={formData.dimensions.height}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Location Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sourcePincode">Source Pincode</Label>
                    <Input
                      id="sourcePincode"
                      name="sourcePincode"
                      value={formData.sourcePincode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destinationPincode">Destination Pincode</Label>
                    <Input
                      id="destinationPincode"
                      name="destinationPincode"
                      value={formData.destinationPincode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Service Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="serviceType">Service Type</Label>
                    <Select
                      value={formData.serviceType}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, serviceType: value as 'standard' | 'express' | 'priority' }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentMode">Payment Mode</Label>
                    <Select
                      value={formData.paymentMode}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMode: value as 'prepaid' | 'cod' }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prepaid">Prepaid</SelectItem>
                        <SelectItem value="cod">Cash on Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="mr-2 h-4 w-4" />
                    Calculate Rate
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Rate Calculation Result */}
        <Card>
          <CardHeader>
            <CardTitle>Rate Details</CardTitle>
            <CardDescription>Shipping rate calculation results</CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-red-500">{error}</div>
            ) : result ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Base Rate</h4>
                    <p className="text-lg font-semibold">₹{result.baseRate.toFixed(2)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Fuel Surcharge</h4>
                    <p className="text-lg font-semibold">₹{result.fuelSurcharge.toFixed(2)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Service Tax</h4>
                    <p className="text-lg font-semibold">₹{result.serviceTax.toFixed(2)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Total Amount</h4>
                    <p className="text-lg font-semibold">₹{result.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Service Type</h4>
                      <p className="text-lg font-semibold">{result.serviceType}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Payment Mode</h4>
                      <p className="text-lg font-semibold">{result.paymentMode}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Estimated Delivery</h4>
                      <p className="text-lg font-semibold">{result.estimatedDelivery}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                Enter package details and calculate rate
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 