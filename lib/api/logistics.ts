import { apiClient, ApiResponse } from './client'

export interface ShippingHub {
  id: string
  name: string
  code: string
  province: string
  district: string
  address: string
  contactPhone: string
  isActive: boolean
  hubType: 'WAREHOUSE' | 'SORTING_CENTER' | 'LOCAL_STATION'
}

export interface TrackingUpdate {
  id: string
  status: string
  location: string
  description: string
  timestamp: string
}

export const logisticsApi = {
  getHubs: async (): Promise<ApiResponse<ShippingHub[]>> => {
    return apiClient('/admin/logistics/hubs', {}, true)
  },

  addTracking: async (shipmentId: string, payload: { status: string; location: string; description?: string }): Promise<ApiResponse<string>> => {
    const qs = new URLSearchParams()
    qs.set('status', payload.status)
    qs.set('location', payload.location)
    if (payload.description) qs.set('description', payload.description)
    
    return apiClient(`/admin/logistics/shipments/${shipmentId}/tracking?${qs.toString()}`, {
      method: 'POST'
    })
  },

  assignToHub: async (shipmentId: string, hubId: string): Promise<ApiResponse<string>> => {
    return apiClient(`/admin/logistics/shipments/${shipmentId}/assign-hub?hubId=${hubId}`, {
      method: 'POST'
    })
  },

  getHistory: async (shipmentId: string): Promise<ApiResponse<TrackingUpdate[]>> => {
    return apiClient(`/admin/logistics/shipments/${shipmentId}/history`, {}, true)
  },

  updateCodStatus: async (shipmentId: string, status: string): Promise<ApiResponse<string>> => {
    return apiClient(`/admin/logistics/shipments/${shipmentId}/cod-status?status=${status}`, {
      method: 'PATCH'
    })
  }
}
