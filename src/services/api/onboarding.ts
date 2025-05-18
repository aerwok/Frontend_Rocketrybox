import axios from 'axios';
import { 
  CompanyDetails, 
  BankDetails, 
  OnboardingResponse, 
  OnboardingFilters 
} from '@/types/onboarding';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

/**
 * Onboarding API Service
 * Handles all onboarding-related API calls
 */
export const onboardingApi = {
  /**
   * Get onboarding status and progress
   * @returns Promise<OnboardingResponse>
   */
  getOnboardingStatus: async (): Promise<OnboardingResponse> => {
    const response = await axios.get(`${API_URL}/onboarding/status`);
    return response.data;
  },

  /**
   * Get company details
   * @returns Promise<CompanyDetails>
   */
  getCompanyDetails: async (): Promise<CompanyDetails> => {
    const response = await axios.get(`${API_URL}/onboarding/company`);
    return response.data;
  },

  /**
   * Update company details
   * @param details Partial<CompanyDetails>
   * @returns Promise<CompanyDetails>
   */
  updateCompanyDetails: async (details: Partial<CompanyDetails>): Promise<CompanyDetails> => {
    const response = await axios.patch(`${API_URL}/onboarding/company`, details);
    return response.data;
  },

  /**
   * Upload company documents
   * @param files File[]
   * @param type 'registrationCertificate' | 'taxCertificate' | 'businessLicense' | 'other'
   * @returns Promise<string[]>
   */
  uploadCompanyDocuments: async (
    files: File[], 
    type: 'registrationCertificate' | 'taxCertificate' | 'businessLicense' | 'other'
  ): Promise<string[]> => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('type', type);
    
    const response = await axios.post(`${API_URL}/onboarding/company/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Get bank details
   * @returns Promise<BankDetails>
   */
  getBankDetails: async (): Promise<BankDetails> => {
    const response = await axios.get(`${API_URL}/onboarding/bank`);
    return response.data;
  },

  /**
   * Update bank details
   * @param details Partial<BankDetails>
   * @returns Promise<BankDetails>
   */
  updateBankDetails: async (details: Partial<BankDetails>): Promise<BankDetails> => {
    const response = await axios.patch(`${API_URL}/onboarding/bank`, details);
    return response.data;
  },

  /**
   * Upload bank documents
   * @param files File[]
   * @param type 'bankStatement' | 'cancelledCheque' | 'other'
   * @returns Promise<string[]>
   */
  uploadBankDocuments: async (
    files: File[], 
    type: 'bankStatement' | 'cancelledCheque' | 'other'
  ): Promise<string[]> => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('type', type);
    
    const response = await axios.post(`${API_URL}/onboarding/bank/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Submit onboarding for verification
   * @returns Promise<OnboardingResponse>
   */
  submitOnboarding: async (): Promise<OnboardingResponse> => {
    const response = await axios.post(`${API_URL}/onboarding/submit`);
    return response.data;
  },

  /**
   * Get onboarding history with filters
   * @param filters OnboardingFilters
   * @returns Promise<{ company: CompanyDetails[]; bank: BankDetails[] }>
   */
  getOnboardingHistory: async (
    filters?: OnboardingFilters
  ): Promise<{ company: CompanyDetails[]; bank: BankDetails[] }> => {
    const response = await axios.get(`${API_URL}/onboarding/history`, { params: filters });
    return response.data;
  },
}; 