import axios from 'axios';
import { Tool, ToolFilters, ToolResponse, ToolStats, ToolUpdate } from '@/types/tool';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

/**
 * Tool API Service
 * Handles all tool-related API calls
 */
export const toolApi = {
  /**
   * Get all tools with optional filters
   * @param filters ToolFilters
   * @returns Promise<ToolResponse>
   */
  getTools: async (filters?: ToolFilters): Promise<ToolResponse> => {
    const response = await axios.get(`${API_URL}/tools`, { params: filters });
    return response.data;
  },

  /**
   * Get a single tool by ID
   * @param toolId string
   * @returns Promise<Tool>
   */
  getTool: async (toolId: string): Promise<Tool> => {
    const response = await axios.get(`${API_URL}/tools/${toolId}`);
    return response.data;
  },

  /**
   * Create a new tool
   * @param tool Partial<Tool>
   * @returns Promise<Tool>
   */
  createTool: async (tool: Partial<Tool>): Promise<Tool> => {
    const response = await axios.post(`${API_URL}/tools`, tool);
    return response.data;
  },

  /**
   * Update a tool
   * @param toolId string
   * @param update ToolUpdate
   * @returns Promise<Tool>
   */
  updateTool: async (toolId: string, update: ToolUpdate): Promise<Tool> => {
    const response = await axios.patch(`${API_URL}/tools/${toolId}`, update);
    return response.data;
  },

  /**
   * Delete a tool
   * @param toolId string
   * @returns Promise<void>
   */
  deleteTool: async (toolId: string): Promise<void> => {
    await axios.delete(`${API_URL}/tools/${toolId}`);
  },

  /**
   * Get tool statistics
   * @returns Promise<ToolStats>
   */
  getToolStats: async (): Promise<ToolStats> => {
    const response = await axios.get(`${API_URL}/tools/stats`);
    return response.data;
  },

  /**
   * Enable a tool
   * @param toolId string
   * @returns Promise<Tool>
   */
  enableTool: async (toolId: string): Promise<Tool> => {
    const response = await axios.post(`${API_URL}/tools/${toolId}/enable`);
    return response.data;
  },

  /**
   * Disable a tool
   * @param toolId string
   * @returns Promise<Tool>
   */
  disableTool: async (toolId: string): Promise<Tool> => {
    const response = await axios.post(`${API_URL}/tools/${toolId}/disable`);
    return response.data;
  },
}; 