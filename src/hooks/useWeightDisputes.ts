import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { weightDisputeApi } from '@/services/api/weight-dispute';
import { 
  WeightDispute, 
  WeightDisputeFilters, 
  WeightDisputeUpdate,
  WeightDisputeComment 
} from '@/types/weight-dispute';

/**
 * Hook for managing weight disputes list with filters
 */
export const useWeightDisputes = () => {
  const [disputes, setDisputes] = useState<WeightDispute[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<WeightDisputeFilters>({
    status: undefined,
    type: undefined,
    priority: undefined,
    carrier: undefined,
    search: undefined,
    startDate: undefined,
    endDate: undefined,
  });

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await weightDisputeApi.getDisputes(filters);
      setDisputes(response.disputes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch disputes');
      toast.error('Failed to fetch disputes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, [filters]);

  const updateFilters = (newFilters: Partial<WeightDisputeFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return {
    disputes,
    loading,
    error,
    filters,
    updateFilters,
    refetch: fetchDisputes,
  };
};

/**
 * Hook for managing a single weight dispute
 */
export const useWeightDispute = (disputeId: string) => {
  const [dispute, setDispute] = useState<WeightDispute | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<WeightDisputeComment[]>([]);

  const fetchDispute = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await weightDisputeApi.getDispute(disputeId);
      setDispute(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dispute');
      toast.error('Failed to fetch dispute');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const data = await weightDisputeApi.getComments(disputeId);
      setComments(data);
    } catch (err) {
      toast.error('Failed to fetch comments');
    }
  };

  const updateDispute = async (update: WeightDisputeUpdate) => {
    try {
      setLoading(true);
      const updated = await weightDisputeApi.updateDispute(disputeId, update);
      setDispute(updated);
      toast.success('Dispute updated successfully');
    } catch (err) {
      toast.error('Failed to update dispute');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (comment: Partial<WeightDisputeComment>) => {
    try {
      const newComment = await weightDisputeApi.addComment(disputeId, comment);
      setComments(prev => [...prev, newComment]);
      toast.success('Comment added successfully');
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  const uploadEvidence = async (files: File[]) => {
    try {
      const uploadedFiles = await weightDisputeApi.uploadEvidence(disputeId, files);
      setDispute(prev => {
        if (!prev) return null;
        return {
          ...prev,
          evidence: {
            ...prev.evidence,
            images: [...prev.evidence.images, ...uploadedFiles],
          },
        };
      });
      toast.success('Evidence uploaded successfully');
    } catch (err) {
      toast.error('Failed to upload evidence');
    }
  };

  const updateStatus = async (status: WeightDispute['status']) => {
    try {
      setLoading(true);
      const updated = await weightDisputeApi.updateStatus(disputeId, status);
      setDispute(updated);
      toast.success('Status updated successfully');
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const updatePriority = async (priority: WeightDispute['priority']) => {
    try {
      setLoading(true);
      const updated = await weightDisputeApi.updatePriority(disputeId, priority);
      setDispute(updated);
      toast.success('Priority updated successfully');
    } catch (err) {
      toast.error('Failed to update priority');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (disputeId) {
      fetchDispute();
      fetchComments();
    }
  }, [disputeId]);

  return {
    dispute,
    comments,
    loading,
    error,
    updateDispute,
    addComment,
    uploadEvidence,
    updateStatus,
    updatePriority,
    refetch: fetchDispute,
  };
};

/**
 * Hook for managing weight dispute creation
 */
export const useWeightDisputeCreation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDispute = async (dispute: Partial<WeightDispute>) => {
    try {
      setLoading(true);
      setError(null);
      const created = await weightDisputeApi.createDispute(dispute);
      toast.success('Dispute created successfully');
      return created;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create dispute');
      toast.error('Failed to create dispute');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createDispute,
  };
}; 