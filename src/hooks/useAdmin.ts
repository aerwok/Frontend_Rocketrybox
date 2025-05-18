import { useState, useCallback } from 'react';
import { adminApi, AdminUser, AdminStats, Department } from '@/services/api/admin';

interface UseAdminReturn {
    // Users
    users: AdminUser[];
    user: AdminUser | null;
    isLoadingUsers: boolean;
    userError: string | null;
    fetchUsers: () => Promise<void>;
    fetchUser: (id: string) => Promise<void>;
    createUser: (data: Omit<AdminUser, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateUser: (id: string, data: Partial<AdminUser>) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;

    // Stats
    stats: AdminStats | null;
    isLoadingStats: boolean;
    statsError: string | null;
    fetchStats: () => Promise<void>;

    // Departments
    departments: Department[];
    department: Department | null;
    isLoadingDepartments: boolean;
    departmentError: string | null;
    fetchDepartments: () => Promise<void>;
    fetchDepartment: (id: string) => Promise<void>;
    createDepartment: (data: Omit<Department, 'id' | 'createdAt'>) => Promise<void>;
    updateDepartment: (id: string, data: Partial<Department>) => Promise<void>;
    deleteDepartment: (id: string) => Promise<void>;
}

/**
 * useAdmin Hook
 * 
 * Manages admin state and operations:
 * - User management (CRUD)
 * - Department management (CRUD)
 * - Admin statistics
 * - Loading and error states
 * 
 * @returns {UseAdminReturn} Admin state and operations
 */
export const useAdmin = (): UseAdminReturn => {
    // User state
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [user, setUser] = useState<AdminUser | null>(null);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [userError, setUserError] = useState<string | null>(null);

    // Stats state
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [isLoadingStats, setIsLoadingStats] = useState(false);
    const [statsError, setStatsError] = useState<string | null>(null);

    // Department state
    const [departments, setDepartments] = useState<Department[]>([]);
    const [department, setDepartment] = useState<Department | null>(null);
    const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
    const [departmentError, setDepartmentError] = useState<string | null>(null);

    /**
     * Fetch all users
     */
    const fetchUsers = useCallback(async () => {
        try {
            setIsLoadingUsers(true);
            setUserError(null);
            const data = await adminApi.getUsers();
            setUsers(data);
        } catch (err) {
            setUserError(err instanceof Error ? err.message : 'Failed to fetch users');
            throw err;
        } finally {
            setIsLoadingUsers(false);
        }
    }, []);

    /**
     * Fetch user by ID
     * @param {string} id - User ID
     */
    const fetchUser = useCallback(async (id: string) => {
        try {
            setIsLoadingUsers(true);
            setUserError(null);
            const data = await adminApi.getUser(id);
            setUser(data);
        } catch (err) {
            setUserError(err instanceof Error ? err.message : 'Failed to fetch user');
            throw err;
        } finally {
            setIsLoadingUsers(false);
        }
    }, []);

    /**
     * Create new user
     * @param {Omit<AdminUser, 'id' | 'createdAt' | 'updatedAt'>} data - User data
     */
    const createUser = useCallback(async (data: Omit<AdminUser, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            setIsLoadingUsers(true);
            setUserError(null);
            const newUser = await adminApi.createUser(data);
            setUsers(prev => [...prev, newUser]);
        } catch (err) {
            setUserError(err instanceof Error ? err.message : 'Failed to create user');
            throw err;
        } finally {
            setIsLoadingUsers(false);
        }
    }, []);

    /**
     * Update user
     * @param {string} id - User ID
     * @param {Partial<AdminUser>} data - Updated user data
     */
    const updateUser = useCallback(async (id: string, data: Partial<AdminUser>) => {
        try {
            setIsLoadingUsers(true);
            setUserError(null);
            const updatedUser = await adminApi.updateUser(id, data);
            setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
            if (user?.id === id) {
                setUser(updatedUser);
            }
        } catch (err) {
            setUserError(err instanceof Error ? err.message : 'Failed to update user');
            throw err;
        } finally {
            setIsLoadingUsers(false);
        }
    }, [user]);

    /**
     * Delete user
     * @param {string} id - User ID
     */
    const deleteUser = useCallback(async (id: string) => {
        try {
            setIsLoadingUsers(true);
            setUserError(null);
            await adminApi.deleteUser(id);
            setUsers(prev => prev.filter(user => user.id !== id));
            if (user?.id === id) {
                setUser(null);
            }
        } catch (err) {
            setUserError(err instanceof Error ? err.message : 'Failed to delete user');
            throw err;
        } finally {
            setIsLoadingUsers(false);
        }
    }, [user]);

    /**
     * Fetch admin statistics
     */
    const fetchStats = useCallback(async () => {
        try {
            setIsLoadingStats(true);
            setStatsError(null);
            const data = await adminApi.getStats();
            setStats(data);
        } catch (err) {
            setStatsError(err instanceof Error ? err.message : 'Failed to fetch stats');
            throw err;
        } finally {
            setIsLoadingStats(false);
        }
    }, []);

    /**
     * Fetch all departments
     */
    const fetchDepartments = useCallback(async () => {
        try {
            setIsLoadingDepartments(true);
            setDepartmentError(null);
            const data = await adminApi.getDepartments();
            setDepartments(data);
        } catch (err) {
            setDepartmentError(err instanceof Error ? err.message : 'Failed to fetch departments');
            throw err;
        } finally {
            setIsLoadingDepartments(false);
        }
    }, []);

    /**
     * Fetch department by ID
     * @param {string} id - Department ID
     */
    const fetchDepartment = useCallback(async (id: string) => {
        try {
            setIsLoadingDepartments(true);
            setDepartmentError(null);
            const data = await adminApi.getDepartment(id);
            setDepartment(data);
        } catch (err) {
            setDepartmentError(err instanceof Error ? err.message : 'Failed to fetch department');
            throw err;
        } finally {
            setIsLoadingDepartments(false);
        }
    }, []);

    /**
     * Create new department
     * @param {Omit<Department, 'id' | 'createdAt'>} data - Department data
     */
    const createDepartment = useCallback(async (data: Omit<Department, 'id' | 'createdAt'>) => {
        try {
            setIsLoadingDepartments(true);
            setDepartmentError(null);
            const newDepartment = await adminApi.createDepartment(data);
            setDepartments(prev => [...prev, newDepartment]);
        } catch (err) {
            setDepartmentError(err instanceof Error ? err.message : 'Failed to create department');
            throw err;
        } finally {
            setIsLoadingDepartments(false);
        }
    }, []);

    /**
     * Update department
     * @param {string} id - Department ID
     * @param {Partial<Department>} data - Updated department data
     */
    const updateDepartment = useCallback(async (id: string, data: Partial<Department>) => {
        try {
            setIsLoadingDepartments(true);
            setDepartmentError(null);
            const updatedDepartment = await adminApi.updateDepartment(id, data);
            setDepartments(prev => prev.map(dept => dept.id === id ? updatedDepartment : dept));
            if (department?.id === id) {
                setDepartment(updatedDepartment);
            }
        } catch (err) {
            setDepartmentError(err instanceof Error ? err.message : 'Failed to update department');
            throw err;
        } finally {
            setIsLoadingDepartments(false);
        }
    }, [department]);

    /**
     * Delete department
     * @param {string} id - Department ID
     */
    const deleteDepartment = useCallback(async (id: string) => {
        try {
            setIsLoadingDepartments(true);
            setDepartmentError(null);
            await adminApi.deleteDepartment(id);
            setDepartments(prev => prev.filter(dept => dept.id !== id));
            if (department?.id === id) {
                setDepartment(null);
            }
        } catch (err) {
            setDepartmentError(err instanceof Error ? err.message : 'Failed to delete department');
            throw err;
        } finally {
            setIsLoadingDepartments(false);
        }
    }, [department]);

    return {
        // Users
        users,
        user,
        isLoadingUsers,
        userError,
        fetchUsers,
        fetchUser,
        createUser,
        updateUser,
        deleteUser,

        // Stats
        stats,
        isLoadingStats,
        statsError,
        fetchStats,

        // Departments
        departments,
        department,
        isLoadingDepartments,
        departmentError,
        fetchDepartments,
        fetchDepartment,
        createDepartment,
        updateDepartment,
        deleteDepartment,
    };
}; 