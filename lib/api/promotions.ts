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
  createPromotion: async (data: Partial<Promotion>): Promise<ApiResponse<Promotion>> => {
    return apiClient<Promotion>(`/seller/promotions`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}






