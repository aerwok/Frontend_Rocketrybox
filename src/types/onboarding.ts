/**
 * Onboarding Types
 * Defines the structure for seller onboarding data
 */

export interface CompanyDetails {
  id: string;
  name: string;
  registrationNumber: string;
  taxId: string;
  businessType: 'individual' | 'partnership' | 'corporation' | 'llc';
  industry: string;
  website?: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  contactPerson: {
    name: string;
    email: string;
    phone: string;
    position: string;
  };
  documents: {
    registrationCertificate?: string;
    taxCertificate?: string;
    businessLicense?: string;
    otherDocuments?: string[];
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface BankDetails {
  id: string;
  companyId: string;
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  bankBranch: string;
  ifscCode: string;
  swiftCode?: string;
  accountType: 'savings' | 'checking' | 'business';
  currency: string;
  documents: {
    bankStatement?: string;
    cancelledCheque?: string;
    otherDocuments?: string[];
  };
  status: 'pending' | 'verified' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingResponse {
  company: CompanyDetails;
  bank: BankDetails;
  status: 'in_progress' | 'completed' | 'rejected';
  currentStep: 'company_details' | 'bank_details' | 'verification' | 'completed';
  nextStep?: string;
  requiredDocuments: string[];
}

export interface OnboardingError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, any>;
}

export interface OnboardingFilters {
  status?: CompanyDetails['status'] | BankDetails['status'];
  businessType?: CompanyDetails['businessType'];
  industry?: string;
  country?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
} 