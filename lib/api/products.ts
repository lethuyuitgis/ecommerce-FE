import { apiClient, ApiResponse } from './client'

export interface Product {
  id: string
  name: string
  description?: string
  sku?: string
  price: number
  comparePrice?: number
  quantity: number
  minOrder?: number
  status: string
  rating?: number
  totalReviews?: number
  totalSold?: number
  totalViews?: number
  isFeatured?: boolean
  flashSaleEnabled?: boolean
  flashSalePrice?: number
  flashSaleStart?: string
  flashSaleEnd?: string
  flashSaleStock?: number
  flashSaleSold?: number
  categoryId?: string
  categoryName?: string
  sellerId?: string
  sellerName?: string
  // Image fields - support multiple formats from backend
  images?: string[]
  primaryImage?: string
  // Alternative field names from backend
  imageUrl?: string
  imageUrls?: string[]
  productImages?: Array<{
    id?: string
    imageUrl?: string
    url?: string
    image_url?: string
    isPrimary?: boolean
    is_primary?: boolean
    displayOrder?: number
  }>
  // Product variants
  variants?: {
    sizes?: string[]
    colors?: string[]
    [key: string]: any
  }
}

export interface ProductPage {
  content: Product[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export const productsApi = {
  getAll: async (page: number = 0, size: number = 20, sortBy: string = 'createdAt', direction: string = 'DESC'): Promise<ApiResponse<ProductPage>> => {
    return apiClient<ProductPage>(`/products?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`)
  },

  getFeatured: async (page: number = 0, size: number = 20): Promise<ApiResponse<ProductPage>> => {
    return apiClient<ProductPage>(`/products/featured?page=${page}&size=${size}`)
  },

  getById: async (id: string): Promise<ApiResponse<Product>> => {
    return apiClient<Product>(`/products/${id}`)
  },

  getByCategory: async (
    slug: string, 
    page: number = 0, 
    size: number = 20,
    filters?: {
      minPrice?: number
      maxPrice?: number
      minRating?: number
      subcategory?: string
    }
  ): Promise<ApiResponse<ProductPage>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    })
    
    if (filters?.minPrice != null) {
      params.append('minPrice', filters.minPrice.toString())
    }
    if (filters?.maxPrice != null) {
      params.append('maxPrice', filters.maxPrice.toString())
    }
    if (filters?.minRating != null) {
      params.append('minRating', filters.minRating.toString())
    }
    if (filters?.subcategory) {
      params.append('subcategory', filters.subcategory)
    }
    
    return apiClient<ProductPage>(`/products/category/${slug}?${params.toString()}`)
  },

  search: async (keyword: string, page: number = 0, size: number = 20): Promise<ApiResponse<ProductPage>> => {
    return apiClient<ProductPage>(`/products/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`)
  },

  // Seller management endpoints
  getSellerProducts: async (page: number = 0, size: number = 20, params?: { q?: string; categoryId?: string; status?: string }): Promise<ApiResponse<ProductPage>> => {
    const query = new URLSearchParams()
    query.set('page', String(page))
    query.set('size', String(size))
    if (params?.q) query.set('q', params.q)
    if (params?.categoryId) query.set('categoryId', params.categoryId)
    if (params?.status) query.set('status', params.status)
    return apiClient<ProductPage>(`/seller/products?${query.toString()}`)
  },

  createProduct: async (data: Partial<Product>): Promise<ApiResponse<Product>> => {
    return apiClient<Product>(`/seller/products`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  updateProduct: async (id: string, data: Partial<Product>): Promise<ApiResponse<Product>> => {
    return apiClient<Product>(`/seller/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  deleteProduct: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient<void>(`/seller/products/${id}`, {
      method: 'DELETE',
    })
  },

  getStats: async (id: string, days: number = 7): Promise<ApiResponse<ProductStats>> => {
    return apiClient<ProductStats>(`/products/${id}/stats?days=${days}`)
  },

  setFeatured: async (id: string, featured: boolean): Promise<ApiResponse<Product>> => {
    return apiClient<Product>(`/seller/products/${id}/featured`, {
      method: 'POST',
      body: JSON.stringify({ featured }),
    })
  },

  setFlashSale: async (id: string, enabled: boolean, flashPrice?: number): Promise<ApiResponse<Product>> => {
    return apiClient<Product>(`/seller/products/${id}/flash-sale`, {
      method: 'POST',
      body: JSON.stringify({ 
        enabled,
        flashPrice: flashPrice || undefined,
      }),
    })
  },
}

export interface ProductStats {
  salesData: Array<{
    date: string
    sales: number
    revenue: number
  }>
  viewsData: Array<{
    date: string
    views: number
  }>
}
