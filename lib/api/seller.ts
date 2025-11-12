import { apiClient, ApiResponse } from './client'

export interface Seller {
  id: string
  userId: string
  shopName: string
  shopDescription?: string
  shopAvatar?: string
  shopCover?: string
  shopPhone?: string
  shopEmail?: string
  province?: string
  district?: string
  verificationStatus: string
  rating?: number
  totalProducts?: number
  totalFollowers?: number
  totalOrders?: number
}

export interface CreateSellerRequest {
  shopName: string
  shopDescription?: string
  shopPhone?: string
  shopEmail?: string
  province?: string
  district?: string
}

export interface UpdateSellerRequest {
  shopName?: string
  shopDescription?: string
  shopPhone?: string
  shopEmail?: string
  province?: string
  district?: string
  shopAvatar?: string
  shopCover?: string
}

export interface SellerProductPage {
  content: any[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export interface CrawlProductRequest {
  url: string
}

export interface CrawlMultipleProductsRequest {
  urls: string[]
}

export interface CrawledProduct {
  name: string
  description?: string
  price: number
  comparePrice?: number
  images: string[]
  category?: string
  sku?: string
  variants?: Array<{
    size?: string
    color?: string
    price?: number
    stock?: number
  }>
}

export interface CrawlMultipleProductsResponse {
  success: number
  failed: number
  results: Array<{
    url: string
    success: boolean
    product?: CrawledProduct
    error?: string
  }>
}

export interface CrawlCategoryRequest {
  category: string
  platform?: string // shopee, lazada, tiki, sendo
  limit?: number // số lượng sản phẩm cần crawl
  page?: number
}

export interface CrawlCategoryResponse {
  category: string
  platform: string
  total: number
  products: CrawledProduct[]
  errors?: string[]
}

export interface SellerOverview {
  totalRevenue: number
  revenueChange: string
  newOrders: number
  newOrdersChange: string
  productsCount: number
  productsChange: string
  views: number
  viewsChange: string
}

export const sellerApi = {
  getProfile: async (): Promise<ApiResponse<Seller>> => {
    return apiClient<Seller>('/seller/profile')
  },

  createSeller: async (data: CreateSellerRequest): Promise<ApiResponse<Seller>> => {
    return apiClient<Seller>('/seller/create', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  updateProfile: async (data: UpdateSellerRequest): Promise<ApiResponse<Seller>> => {
    return apiClient<Seller>('/seller/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Overview dashboard
  getOverview: async (): Promise<ApiResponse<SellerOverview>> => {
    // Backend should expose /api/seller/overview
    return apiClient<SellerOverview>('/seller/overview')
  },

  getProducts: async (page: number = 0, size: number = 20): Promise<ApiResponse<SellerProductPage>> => {
    return apiClient<SellerProductPage>(`/seller/products?page=${page}&size=${size}`)
  },

  crawlProduct: async (data: CrawlProductRequest): Promise<ApiResponse<CrawledProduct>> => {
    return apiClient<CrawledProduct>('/seller/products/crawl', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  crawlMultipleProducts: async (data: CrawlMultipleProductsRequest): Promise<ApiResponse<CrawlMultipleProductsResponse>> => {
    return apiClient<CrawlMultipleProductsResponse>('/seller/products/crawl/batch', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  crawlCategory: async (data: CrawlCategoryRequest): Promise<ApiResponse<CrawlCategoryResponse>> => {
    return apiClient<CrawlCategoryResponse>('/seller/products/crawl/category', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  createProduct: async (data: {
    name: string
    description?: string
    price: number
    comparePrice?: number
    categoryId?: string
    categoryName?: string
    sku?: string
    images?: string[]
    videos?: string[]
    quantity?: number
    status?: string
    shippingMethodId?: string
    variants?: Array<{
      size?: string
      color?: string
      price?: number
      stock?: number
    }>
  }): Promise<ApiResponse<any>> => {
    return apiClient<any>('/seller/products', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  importProducts: async (file: File): Promise<ApiResponse<{ success: number; failed: number; errors?: string[] }>> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const headers: HeadersInit = {}
    
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    const apiBaseUrl = typeof window !== 'undefined' ? '/api' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api')
    
    const response = await fetch(`${apiBaseUrl}/seller/products/import`, {
      method: 'POST',
      headers,
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to import products')
    }

    return data
  },
}
