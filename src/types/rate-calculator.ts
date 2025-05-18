/**
 * Rate Calculator Types
 * Defines the structure for rate calculation data and related operations
 */

export interface RateCalculationInput {
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  sourcePincode: string;
  destinationPincode: string;
  serviceType: 'standard' | 'express' | 'priority';
  paymentMode: 'prepaid' | 'cod';
  declaredValue?: number;
}

export interface RateCalculationResult {
  baseRate: number;
  fuelSurcharge: number;
  serviceTax: number;
  totalAmount: number;
  estimatedDelivery: string;
  serviceType: string;
  paymentMode: string;
}

export interface PincodeDetails {
  pincode: string;
  city: string;
  state: string;
  country: string;
}

export interface ServiceType {
  id: string;
  name: string;
  description: string;
  baseRate: number;
  fuelSurchargePercentage: number;
  serviceTaxPercentage: number;
  estimatedDeliveryDays: number;
} 