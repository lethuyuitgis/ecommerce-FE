import { apiClient, ApiResponse } from './client'

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

export const productStatsApi = {
  getProductStats: async (productId: string, days: number = 7): Promise<ApiResponse<ProductStats>> => {
    return apiClient<ProductStats>(`/products/${productId}/stats?days=${days}`)
  },
}


