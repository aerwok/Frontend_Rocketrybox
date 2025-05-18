import { BaseEntity } from './api';

/**
 * Product Status Enum
 * Represents the possible states of a product
 */
export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft',
  ARCHIVED = 'archived'
}

/**
 * Product Category Interface
 * Represents a product category
 */
export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  description?: string;
  imageUrl?: string;
}

/**
 * Product Image Interface
 * Represents a product image
 */
export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
  order: number;
}

/**
 * Product Variant Interface
 * Represents a product variant
 */
export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  inventory: number;
  attributes: Record<string, string>;
  images?: ProductImage[];
}

/**
 * Product Interface
 * Represents a complete product
 */
export interface Product extends BaseEntity {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  inventory: number;
  status: ProductStatus;
  categoryId: string;
  category?: ProductCategory;
  images: ProductImage[];
  variants?: ProductVariant[];
  attributes: Record<string, string>;
  metadata?: Record<string, unknown>;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  tags?: string[];
}

/**
 * Product Create Request Interface
 * Represents the request body for creating a product
 */
export interface ProductCreateRequest {
  name: string;
  description: string;
  shortDescription?: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  inventory: number;
  categoryId: string;
  attributes?: Record<string, string>;
  metadata?: Record<string, unknown>;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  tags?: string[];
}

/**
 * Product Update Request Interface
 * Represents the request body for updating a product
 */
export interface ProductUpdateRequest extends Partial<ProductCreateRequest> {
  status?: ProductStatus;
}

/**
 * Product Filters Interface
 * Represents the filters that can be applied to product list
 */
export interface ProductFilters {
  search?: string;
  category?: string;
  status?: ProductStatus;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  tags?: string[];
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Product List Response Interface
 * Represents the response from the products list endpoint
 */
export interface ProductListResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Product Response Interface
 * Represents the response from a single product endpoint
 */
export interface ProductResponse {
  data: Product;
  message: string;
} 