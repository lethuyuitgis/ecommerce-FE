import { apiClient, ApiResponse } from './client'

export interface ShippingMethod {
  id: string
  code: string
  name: string
  fee: number
  estimatedDays?: number
  isActive?: boolean
}

export const shippingApi = {
  getMethods: async (): Promise<ApiResponse<ShippingMethod[]>> => {
    // Backend mapping: /api/shipping/methods
    return apiClient<ShippingMethod[]>('/shipping/methods')
  },
}

