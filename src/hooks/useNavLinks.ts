import { useState, useEffect } from 'react';
import { adminApi } from '../services/api/admin';
import { NavLink } from '../types/api';

// Define the hook's return type
interface UseNavLinksReturn {
  navLinks: NavLink[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching and managing navigation links
 * @returns {UseNavLinksReturn} Object containing navigation links, loading state, error state, and refetch function
 */
export const useNavLinks = (): UseNavLinksReturn => {
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNavLinks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Uncomment when API is ready
      // const links = await adminApi.getNavLinks();
      // setNavLinks(links);

      // Temporary static nav links until API is ready
      const staticNavLinks: NavLink[] = [
        { to: "/admin/dashboard", label: "Dashboard" },
        { to: "/admin/dashboard/users", label: "Users" },
        { to: "/admin/dashboard/partners", label: "Partners" },
        { to: "/admin/dashboard/orders", label: "Orders" },
        { to: "/admin/dashboard/reports", label: "Reports" },
        { to: "/admin/dashboard/settings", label: "Settings" },
      ];

      setNavLinks(staticNavLinks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching navigation links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNavLinks();
  }, []);

  return {
    navLinks,
    loading,
    error,
    refetch: fetchNavLinks,
  };
}; 