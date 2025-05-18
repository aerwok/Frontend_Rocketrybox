import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { productsApi } from '../services/api/products';
import { Product, ProductCreateRequest, ProductUpdateRequest, ProductFilters } from '../types/product';

/**
 * Hook for managing a list of products
 * Handles fetching, filtering, and pagination of products
 */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const fetchProducts = useCallback(async (filters?: ProductFilters) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await productsApi.getProducts({
        page: filters?.page || page,
        limit: filters?.limit || limit,
        search: filters?.search,
        category: filters?.category,
        status: filters?.status,
        sortBy: filters?.sortBy,
        sortOrder: filters?.sortOrder
      });

      setProducts(response.data);
      setTotal(response.total);
      setPage(response.page);
      setLimit(response.limit);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
      toast.error('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit]);

  const refreshProducts = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    isLoading,
    error,
    total,
    page,
    limit,
    totalPages,
    setPage,
    setLimit,
    fetchProducts,
    refreshProducts
  };
}

/**
 * Hook for managing a single product
 * Handles fetching, updating, and deleting a product
 */
export function useProduct(productId: string | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await productsApi.getProductById(productId);
      setProduct(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch product');
      toast.error('Failed to fetch product details');
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  const updateProduct = useCallback(async (data: ProductUpdateRequest) => {
    if (!productId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await productsApi.updateProduct(productId, data);
      setProduct(response.data);
      toast.success('Product updated successfully');
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to update product');
      toast.error('Failed to update product');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  const deleteProduct = useCallback(async () => {
    if (!productId) return;

    setIsLoading(true);
    setError(null);

    try {
      await productsApi.deleteProduct(productId);
      toast.success('Product deleted successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to delete product');
      toast.error('Failed to delete product');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  const updateStatus = useCallback(async (status: 'active' | 'inactive') => {
    if (!productId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await productsApi.updateProductStatus(productId, status);
      setProduct(response.data);
      toast.success('Product status updated successfully');
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to update product status');
      toast.error('Failed to update product status');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  const uploadImages = useCallback(async (images: File[]) => {
    if (!productId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await productsApi.uploadProductImages(productId, images);
      setProduct(response.data);
      toast.success('Images uploaded successfully');
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to upload images');
      toast.error('Failed to upload images');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  const deleteImages = useCallback(async (imageIds: string[]) => {
    if (!productId) return;

    setIsLoading(true);
    setError(null);

    try {
      await productsApi.deleteProductImages(productId, imageIds);
      toast.success('Images deleted successfully');
      // Refresh product to get updated images
      await fetchProduct();
    } catch (err: any) {
      setError(err.message || 'Failed to delete images');
      toast.error('Failed to delete images');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [productId, fetchProduct]);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId, fetchProduct]);

  return {
    product,
    isLoading,
    error,
    fetchProduct,
    updateProduct,
    deleteProduct,
    updateStatus,
    uploadImages,
    deleteImages
  };
}

/**
 * Hook for creating a new product
 * Handles product creation with loading and error states
 */
export function useCreateProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdProduct, setCreatedProduct] = useState<Product | null>(null);

  const createProduct = useCallback(async (data: ProductCreateRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await productsApi.createProduct(data);
      setCreatedProduct(response.data);
      toast.success('Product created successfully');
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to create product');
      toast.error('Failed to create product');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    createdProduct,
    createProduct
  };
}

/**
 * Hook for managing product filters
 * Handles filter state and application
 */
export function useProductFilters() {
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 10
  });

  const applyFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 10
    });
  }, []);

  return {
    filters,
    setFilters,
    applyFilters,
    resetFilters
  };
} 