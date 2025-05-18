import { useState, useEffect } from 'react';
import api from '../services/api';

// Define the User interface
interface User {
  id: string;
  name: string;
  email: string;
  // Add other user properties as needed
}

// Define the hook's return type
interface UseFetchUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching users from the API
 * @returns {UseFetchUsersReturn} Object containing users data, loading state, error state, and refetch function
 */
export const useFetchUsers = (): UseFetchUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Replace with actual API endpoint when available
      const response = await api.get<User[]>('/users');
      setUsers(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
  };
}; 