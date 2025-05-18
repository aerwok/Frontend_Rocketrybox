import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { onboardingApi } from '@/services/api/onboarding';
import { 
  CompanyDetails, 
  BankDetails, 
  OnboardingResponse, 
  OnboardingFilters 
} from '@/types/onboarding';

/**
 * Hook for managing onboarding status and progress
 */
export const useOnboardingStatus = () => {
  const [status, setStatus] = useState<OnboardingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await onboardingApi.getOnboardingStatus();
      setStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch onboarding status');
      toast.error('Failed to fetch onboarding status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return {
    status,
    loading,
    error,
    refetch: fetchStatus,
  };
};

/**
 * Hook for managing company details
 */
export const useCompanyDetails = () => {
  const [details, setDetails] = useState<CompanyDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await onboardingApi.getCompanyDetails();
      setDetails(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch company details');
      toast.error('Failed to fetch company details');
    } finally {
      setLoading(false);
    }
  };

  const updateDetails = async (newDetails: Partial<CompanyDetails>) => {
    try {
      setLoading(true);
      setError(null);
      const updated = await onboardingApi.updateCompanyDetails(newDetails);
      setDetails(updated);
      toast.success('Company details updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update company details');
      toast.error('Failed to update company details');
    } finally {
      setLoading(false);
    }
  };

  const uploadDocuments = async (
    files: File[], 
    type: 'registrationCertificate' | 'taxCertificate' | 'businessLicense' | 'other'
  ) => {
    try {
      setLoading(true);
      setError(null);
      const uploadedFiles = await onboardingApi.uploadCompanyDocuments(files, type);
      setDetails(prev => {
        if (!prev) return null;
        return {
          ...prev,
          documents: {
            ...prev.documents,
            [type]: uploadedFiles[0],
          },
        };
      });
      toast.success('Documents uploaded successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload documents');
      toast.error('Failed to upload documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  return {
    details,
    loading,
    error,
    updateDetails,
    uploadDocuments,
    refetch: fetchDetails,
  };
};

/**
 * Hook for managing bank details
 */
export const useBankDetails = () => {
  const [details, setDetails] = useState<BankDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await onboardingApi.getBankDetails();
      setDetails(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bank details');
      toast.error('Failed to fetch bank details');
    } finally {
      setLoading(false);
    }
  };

  const updateDetails = async (newDetails: Partial<BankDetails>) => {
    try {
      setLoading(true);
      setError(null);
      const updated = await onboardingApi.updateBankDetails(newDetails);
      setDetails(updated);
      toast.success('Bank details updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update bank details');
      toast.error('Failed to update bank details');
    } finally {
      setLoading(false);
    }
  };

  const uploadDocuments = async (
    files: File[], 
    type: 'bankStatement' | 'cancelledCheque' | 'other'
  ) => {
    try {
      setLoading(true);
      setError(null);
      const uploadedFiles = await onboardingApi.uploadBankDocuments(files, type);
      setDetails(prev => {
        if (!prev) return null;
        return {
          ...prev,
          documents: {
            ...prev.documents,
            [type]: uploadedFiles[0],
          },
        };
      });
      toast.success('Documents uploaded successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload documents');
      toast.error('Failed to upload documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  return {
    details,
    loading,
    error,
    updateDetails,
    uploadDocuments,
    refetch: fetchDetails,
  };
};

/**
 * Hook for managing onboarding submission
 */
export const useOnboardingSubmission = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitOnboarding = async () => {
    try {
      setLoading(true);
      setError(null);
      await onboardingApi.submitOnboarding();
      toast.success('Onboarding submitted successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit onboarding');
      toast.error('Failed to submit onboarding');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    submitOnboarding,
  };
};

/**
 * Hook for managing onboarding history
 */
export const useOnboardingHistory = (filters?: OnboardingFilters) => {
  const [history, setHistory] = useState<{ company: CompanyDetails[]; bank: BankDetails[] }>({ company: [], bank: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await onboardingApi.getOnboardingHistory(filters);
      setHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch onboarding history');
      toast.error('Failed to fetch onboarding history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [filters]);

  return {
    history,
    loading,
    error,
    refetch: fetchHistory,
  };
}; 