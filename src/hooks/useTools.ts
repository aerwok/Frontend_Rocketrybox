import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { toolApi } from '@/services/api/tool';
import { Tool, ToolFilters, ToolStats, ToolUpdate } from '@/types/tool';

/**
 * Hook for managing tools list with filters
 */
export const useTools = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ToolFilters>({
    category: undefined,
    search: undefined,
    isEnabled: undefined,
  });

  const fetchTools = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await toolApi.getTools(filters);
      setTools(response.tools);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tools');
      toast.error('Failed to fetch tools');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, [filters]);

  const updateFilters = (newFilters: Partial<ToolFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return {
    tools,
    loading,
    error,
    filters,
    updateFilters,
    refetch: fetchTools,
  };
};

/**
 * Hook for managing a single tool
 */
export const useTool = (toolId: string) => {
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTool = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await toolApi.getTool(toolId);
      setTool(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tool');
      toast.error('Failed to fetch tool');
    } finally {
      setLoading(false);
    }
  };

  const updateTool = async (update: ToolUpdate) => {
    try {
      setLoading(true);
      const updated = await toolApi.updateTool(toolId, update);
      setTool(updated);
      toast.success('Tool updated successfully');
    } catch (err) {
      toast.error('Failed to update tool');
    } finally {
      setLoading(false);
    }
  };

  const enableTool = async () => {
    try {
      setLoading(true);
      const enabled = await toolApi.enableTool(toolId);
      setTool(enabled);
      toast.success('Tool enabled successfully');
    } catch (err) {
      toast.error('Failed to enable tool');
    } finally {
      setLoading(false);
    }
  };

  const disableTool = async () => {
    try {
      setLoading(true);
      const disabled = await toolApi.disableTool(toolId);
      setTool(disabled);
      toast.success('Tool disabled successfully');
    } catch (err) {
      toast.error('Failed to disable tool');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (toolId) {
      fetchTool();
    }
  }, [toolId]);

  return {
    tool,
    loading,
    error,
    updateTool,
    enableTool,
    disableTool,
    refetch: fetchTool,
  };
};

/**
 * Hook for managing tool creation
 */
export const useToolCreation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTool = async (tool: Partial<Tool>) => {
    try {
      setLoading(true);
      setError(null);
      const created = await toolApi.createTool(tool);
      toast.success('Tool created successfully');
      return created;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create tool');
      toast.error('Failed to create tool');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createTool,
  };
};

/**
 * Hook for managing tool statistics
 */
export const useToolStats = () => {
  const [stats, setStats] = useState<ToolStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await toolApi.getToolStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tool statistics');
      toast.error('Failed to fetch tool statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}; 