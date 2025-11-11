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
    return apiClient<ShippingMethod[]>('/shipping-methods')
  },
}
