import { apiClient, ApiResponse } from './client'

export interface Promotion {
  id: string
  name: string
  description?: string
  promotionType: string
  discountValue: number
  maxDiscountAmount?: number
  minPurchaseAmount?: number
  startDate: string
  endDate: string
  quantityLimit?: number
  quantityUsed?: number
  status: string
}

export interface PromotionPage {
  content: Promotion[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export const promotionsApi = {
  getActive: async (page: number = 0, size: number = 20): Promise<ApiResponse<PromotionPage>> => {
    return apiClient<PromotionPage>(`/promotions/active?page=${page}&size=${size}`)
  },
  getSellerPromotions: async (page: number = 0, size: number = 20): Promise<ApiResponse<PromotionPage>> => {
    return apiClient<PromotionPage>(`/seller/promotions?page=${page}&size=${size}`)
  },
  getById: async (id: string): Promise<ApiResponse<Promotion>> => {
    return apiClient<Promotion>(`/seller/promotions/${id}`)
  },
  createPromotion: async (data: Partial<Promotion>): Promise<ApiResponse<Promotion>> => {
    return apiClient<Promotion>(`/seller/promotions`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  updatePromotion: async (id: string, data: Partial<Promotion>): Promise<ApiResponse<Promotion>> => {
    return apiClient<Promotion>(`/seller/promotions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  deletePromotion: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient<void>(`/seller/promotions/${id}`, {
      method: 'DELETE',
    })
  },
}

