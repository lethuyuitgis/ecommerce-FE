import { apiClient, ApiResponse } from './client'

export interface ShippingMethod {
  id: string
  code: string
  name: string
  description?: string
  fee?: number
  baseFee?: number
  estimatedDays?: number
  isActive?: boolean
}

export interface ShippingSettings {
  freeShippingEnabled: boolean
  minOrderValue?: number
}

export const shippingApi = {
  getMethods: async (): Promise<ApiResponse<ShippingMethod[]>> => {
    // Backend mapping: /api/shipping/methods
    return apiClient<ShippingMethod[]>('/shipping/methods')
  },

  getShippingMethods: async (): Promise<ApiResponse<ShippingMethod[]>> => {
    return apiClient<ShippingMethod[]>('/seller/shipping/methods')
  },

  updateShippingMethodActive: async (methodId: string, isActive: boolean): Promise<ApiResponse<ShippingMethod>> => {
    return apiClient<ShippingMethod>(`/seller/shipping/methods/${methodId}/toggle`, {
      method: 'PUT',
      body: JSON.stringify({ isActive }),
    })
  },

  saveShippingSettings: async (settings: ShippingSettings): Promise<ApiResponse<ShippingSettings>> => {
    return apiClient<ShippingSettings>('/seller/shipping/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    })
  },

  getShippingSettings: async (): Promise<ApiResponse<ShippingSettings>> => {
    return apiClient<ShippingSettings>('/seller/shipping/settings')
  },
}
