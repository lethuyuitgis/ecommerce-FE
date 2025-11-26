import { apiClient, ApiResponse, apiClientFormData } from './client'
import { apiClientBlob } from './client-blob'

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
    return apiClientFormData<{ success: number; failed: number; errors?: string[] }>('/seller/products/import', formData)
  },

  exportProducts: async (): Promise<{ blob: Blob; filename: string }> => {
    const { blob, headers } = await apiClientBlob('/seller/products/export')
    const disposition = headers.get('Content-Disposition') || headers.get('content-disposition')
    let filename = `products_${new Date().toISOString().split('T')[0]}.xlsx`
    if (disposition) {
      const match = disposition.match(/filename="?([^"]+)"?/)
      if (match && match[1]) {
        filename = match[1]
      }
    }
    return { blob, filename }
  },

  getBusinessHours: async (): Promise<ApiResponse<Record<string, { open: string; close: string }>>> => {
    return apiClient<Record<string, { open: string; close: string }>>('/seller/business-hours')
  },

  updateBusinessHours: async (hours: Record<string, { open: string; close: string }>): Promise<ApiResponse<Record<string, { open: string; close: string }>>> => {
    return apiClient<Record<string, { open: string; close: string }>>('/seller/business-hours', {
      method: 'PUT',
      body: JSON.stringify(hours),
    })
  },
}
