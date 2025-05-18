import { useState, useEffect } from 'react';
import api from '../services/api';

// Define the Post interface
interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  // Add other post properties as needed
}

// Define pagination parameters
interface PaginationParams {
  page: number;
  limit: number;
}

// Define the hook's return type
interface UseGetPostsReturn {
  posts: Post[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  fetchPosts: (params: PaginationParams) => Promise<void>;
}

/**
 * Custom hook for fetching posts with pagination
 * @returns {UseGetPostsReturn} Object containing posts data, loading state, error state, pagination info, and fetch function
 */
export const useGetPosts = (): UseGetPostsReturn => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchPosts = async ({ page, limit }: PaginationParams) => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Replace with actual API endpoint when available
      const response = await api.get<{ data: Post[]; total: number }>('/posts', {
        params: { page, limit },
      });
      setPosts(response.data.data);
      setTotalPages(Math.ceil(response.data.total / limit));
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts({ page: 1, limit: 10 });
  }, []);

  return {
    posts,
    loading,
    error,
    totalPages,
    currentPage,
    fetchPosts,
  };
}; 