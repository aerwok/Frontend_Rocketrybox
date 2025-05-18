import api from './index';
import { MenuItem, ApiResponse } from '@/types/api';

interface RouteHeader {
    title: string;
    description: string;
}

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'super_admin';
    department: string;
    employeeId: string;
    phoneNumber: string;
    address: string;
    dateOfJoining: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AdminStats {
    totalUsers: number;
    activeUsers: number;
    totalDepartments: number;
    recentActivity: {
        id: string;
        type: string;
        description: string;
        timestamp: string;
    }[];
}

export interface Department {
    id: string;
    name: string;
    description: string;
    headCount: number;
    createdAt: string;
}

/**
 * Admin API service for handling admin-related API calls
 */
export const adminApi = {
  /**
   * Fetch admin menu items
   * @returns {Promise<MenuItem[]>} Array of menu items with permissions
   */
  getMenuItems: async (): Promise<MenuItem[]> => {
    const response = await api.get<MenuItem[]>('/admin/menu');
    return response.data;
  },

  /**
   * Check user permissions for menu items
   * @param {string[]} permissions - Array of permission strings to check
   * @returns {Promise<boolean>} Whether user has all required permissions
   */
  checkPermissions: async (permissions: string[]): Promise<boolean> => {
    const response = await api.post<{ hasPermissions: boolean }>('/admin/check-permissions', {
      permissions,
    });
    return response.data.hasPermissions;
  },

  /**
   * Get header information for a specific escalation route
   * @param {string} route - The current route path
   * @returns {Promise<ApiResponse<RouteHeader>>} The header information
   */
  getEscalationHeader: async (route: string): Promise<ApiResponse<RouteHeader>> => {
    const response = await api.get(`/admin/escalations/${route}/header`);
    return response.data;
  },

  /**
   * Update header information for a specific escalation route
   * @param {string} route - The route path to update
   * @param {RouteHeader} header - The new header information
   * @returns {Promise<ApiResponse<RouteHeader>>} The updated header information
   */
  updateEscalationHeader: async (route: string, header: RouteHeader): Promise<ApiResponse<RouteHeader>> => {
    const response = await api.put(`/admin/escalations/${route}/header`, header);
    return response.data;
  },

  /**
   * Get all admin users
   * @returns {Promise<AdminUser[]>} List of admin users
   */
  getUsers: (): Promise<AdminUser[]> => {
    return api.get('/admin/users');
  },

  /**
   * Get admin user by ID
   * @param {string} id - User ID
   * @returns {Promise<AdminUser>} Admin user data
   */
  getUser: (id: string): Promise<AdminUser> => {
    return api.get(`/admin/users/${id}`);
  },

  /**
   * Create new admin user
   * @param {Omit<AdminUser, 'id' | 'createdAt' | 'updatedAt'>} data - User data
   * @returns {Promise<AdminUser>} Created user data
   */
  createUser: (data: Omit<AdminUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<AdminUser> => {
    return api.post('/admin/users', data);
  },

  /**
   * Update admin user
   * @param {string} id - User ID
   * @param {Partial<AdminUser>} data - Updated user data
   * @returns {Promise<AdminUser>} Updated user data
   */
  updateUser: (id: string, data: Partial<AdminUser>): Promise<AdminUser> => {
    return api.put(`/admin/users/${id}`, data);
  },

  /**
   * Delete admin user
   * @param {string} id - User ID
   * @returns {Promise<void>}
   */
  deleteUser: (id: string): Promise<void> => {
    return api.delete(`/admin/users/${id}`);
  },

  /**
   * Get admin dashboard statistics
   * @returns {Promise<AdminStats>} Admin statistics
   */
  getStats: (): Promise<AdminStats> => {
    return api.get('/admin/stats');
  },

  /**
   * Get all departments
   * @returns {Promise<Department[]>} List of departments
   */
  getDepartments: (): Promise<Department[]> => {
    return api.get('/admin/departments');
  },

  /**
   * Get department by ID
   * @param {string} id - Department ID
   * @returns {Promise<Department>} Department data
   */
  getDepartment: (id: string): Promise<Department> => {
    return api.get(`/admin/departments/${id}`);
  },

  /**
   * Create new department
   * @param {Omit<Department, 'id' | 'createdAt'>} data - Department data
   * @returns {Promise<Department>} Created department data
   */
  createDepartment: (data: Omit<Department, 'id' | 'createdAt'>): Promise<Department> => {
    return api.post('/admin/departments', data);
  },

  /**
   * Update department
   * @param {string} id - Department ID
   * @param {Partial<Department>} data - Updated department data
   * @returns {Promise<Department>} Updated department data
   */
  updateDepartment: (id: string, data: Partial<Department>): Promise<Department> => {
    return api.put(`/admin/departments/${id}`, data);
  },

  /**
   * Delete department
   * @param {string} id - Department ID
   * @returns {Promise<void>}
   */
  deleteDepartment: (id: string): Promise<void> => {
    return api.delete(`/admin/departments/${id}`);
  },
}; 