import axios from 'axios';
import { Product, ProductCreateRequest, ProductUpdateRequest, ProductFilters } from '../../types/product';

/**
 * Products API Service
 * Handles all API calls related to managing products.
 * Replace endpoint URLs with actual backend endpoints when available.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const productsApi = {
  /**
   * Fetch a list of products with optional filtering and pagination
   * @param params - Filter and pagination parameters
   * @returns Promise with products data and pagination info
   */
  getProducts: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    data: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> => {
    const response = await axios.get(`${API_BASE_URL}/v1/seller/products`, { params });
    return response.data;
  },

  /**
   * Fetch a single product by ID
   * @param productId - The ID of the product to fetch
   * @returns Promise with product data
   */
  getProductById: async (productId: string): Promise<{ data: Product }> => {
    const response = await axios.get(`${API_BASE_URL}/v1/seller/products/${productId}`);
    return response.data;
  },

  /**
   * Create a new product
   * @param data - The product data to create
   * @returns Promise with created product data
   */
  createProduct: async (data: ProductCreateRequest): Promise<{ data: Product }> => {
    const response = await axios.post(`${API_BASE_URL}/v1/seller/products`, data);
    return response.data;
  },

  /**
   * Update an existing product
   * @param productId - The ID of the product to update
   * @param data - The updated product data
   * @returns Promise with updated product data
   */
  updateProduct: async (productId: string, data: ProductUpdateRequest): Promise<{ data: Product }> => {
    const response = await axios.patch(`${API_BASE_URL}/v1/seller/products/${productId}`, data);
    return response.data;
  },

  /**
   * Delete a product
   * @param productId - The ID of the product to delete
   * @returns Promise with success message
   */
  deleteProduct: async (productId: string): Promise<{ message: string }> => {
    const response = await axios.delete(`${API_BASE_URL}/v1/seller/products/${productId}`);
    return response.data;
  },

  /**
   * Update product status (active/inactive)
   * @param productId - The ID of the product
   * @param status - The new status
   * @returns Promise with updated product data
   */
  updateProductStatus: async (productId: string, status: 'active' | 'inactive'): Promise<{ data: Product }> => {
    const response = await axios.patch(`${API_BASE_URL}/v1/seller/products/${productId}/status`, { status });
    return response.data;
  },

  /**
   * Upload product images
   * @param productId - The ID of the product
   * @param images - Array of image files
   * @returns Promise with updated product data including image URLs
   */
  uploadProductImages: async (productId: string, images: File[]): Promise<{ data: Product }> => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image);
    });
    const response = await axios.post(`${API_BASE_URL}/v1/seller/products/${productId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Delete product images
   * @param productId - The ID of the product
   * @param imageIds - Array of image IDs to delete
   * @returns Promise with success message
   */
  deleteProductImages: async (productId: string, imageIds: string[]): Promise<{ message: string }> => {
    const response = await axios.delete(`${API_BASE_URL}/v1/seller/products/${productId}/images`, {
      data: { imageIds },
    });
    return response.data;
  }
}; 