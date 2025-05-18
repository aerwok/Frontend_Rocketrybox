/**
 * Tool Types
 * Defines the structure for tool data and related operations
 */

export type ToolCategory = 
  | 'shipping'
  | 'billing'
  | 'analytics'
  | 'utilities'
  | 'integration';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
  url: string;
  isEnabled: boolean;
  isNew: boolean;
  isBeta: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ToolFilters {
  category?: ToolCategory;
  search?: string;
  isEnabled?: boolean;
}

export interface ToolResponse {
  tools: Tool[];
  total: number;
}

export interface ToolStats {
  total: number;
  byCategory: {
    [key in ToolCategory]: number;
  };
  enabled: number;
  new: number;
  beta: number;
}

export interface ToolUpdate {
  isEnabled?: boolean;
  name?: string;
  description?: string;
  category?: ToolCategory;
  url?: string;
} 