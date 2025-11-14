import { apiClient, ApiResponse } from './client'

export type AdminUser = {
  id: string
  email: string
  fullName: string
  userType: 'CUSTOMER' | 'SELLER' | 'SHIPPER' | 'ADMIN'
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING'
  createdAt: string
}

export type AdminSeller = {
  id: string
  userId: string
  shopName: string
  slug: string
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'SUSPENDED'
  createdAt: string
}

export type AdminShipment = {
  id: string
  orderId: string
  sellerId: string
  shipperId?: string | null
  trackingNumber: string
  status:
    | 'READY_FOR_PICKUP'
    | 'PICKED_UP'
    | 'IN_TRANSIT'
    | 'ARRIVED_HUB'
    | 'OUT_FOR_DELIVERY'
    | 'DELIVERED'
    | 'FAILED'
    | 'CANCELLED'
  pickupAddress: any
  deliveryAddress: any
  packageWeight?: number
  packageSize?: string
  codAmount?: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export type AdminVoucher = {
  id: string
  code: string
  description?: string
  type: 'PERCENTAGE' | 'FIXED' | 'FREESHIP'
  value: number
  maxDiscount?: number | null
  minOrderValue?: number | null
  usageLimit: number
  usedCount: number
  startDate?: string | null
  endDate?: string | null
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'SCHEDULED'
  createdAt: string
  updatedAt: string
}

export const adminApi = {
  // Users
  listUsers: async (params?: { q?: string; role?: string; status?: string }): Promise<ApiResponse<AdminUser[]>> => {
    const qs = new URLSearchParams()
    if (params?.q) qs.set('q', params.q)
    if (params?.role) qs.set('role', params.role)
    if (params?.status) qs.set('status', params.status)
    return apiClient(`/admin/users${qs.toString() ? `?${qs}` : ''}`, {}, true)
  },
  updateUserStatus: async (id: string, status: AdminUser['status']): Promise<ApiResponse<AdminUser>> => {
    return apiClient(`/admin/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  },
  updateUserRole: async (id: string, role: AdminUser['userType']): Promise<ApiResponse<AdminUser>> => {
    return apiClient(`/admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    })
  },

  // Sellers
  listSellers: async (params?: { q?: string; status?: string }): Promise<ApiResponse<AdminSeller[]>> => {
    const qs = new URLSearchParams()
    if (params?.q) qs.set('q', params.q)
    if (params?.status) qs.set('status', params.status)
    return apiClient(`/admin/sellers${qs.toString() ? `?${qs}` : ''}`, {}, true)
  },
  updateSellerStatus: async (id: string, status: AdminSeller['status']): Promise<ApiResponse<AdminSeller>> => {
    return apiClient(`/admin/sellers/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  },

  // Shipments
  listShipments: async (params?: { status?: AdminShipment['status'] }): Promise<ApiResponse<AdminShipment[]>> => {
    const qs = new URLSearchParams()
    if (params?.status) qs.set('status', params.status)
    return apiClient(`/admin/shipments${qs.toString() ? `?${qs}` : ''}`, {}, true)
  },
  createShipment: async (payload: Omit<AdminShipment, 'id' | 'trackingNumber' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<AdminShipment>> => {
    return apiClient(`/admin/shipments`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  listAvailableForShipper: async (): Promise<ApiResponse<AdminShipment[]>> => {
    return apiClient(`/shipments/available`, {}, true)
  },

  // Vouchers
  listVouchers: async (params?: { q?: string; status?: string; type?: string }): Promise<ApiResponse<AdminVoucher[]>> => {
    const qs = new URLSearchParams()
    if (params?.q) qs.set('q', params.q)
    if (params?.status) qs.set('status', params.status)
    if (params?.type) qs.set('type', params.type)
    return apiClient(`/admin/vouchers${qs.toString() ? `?${qs}` : ''}`, {}, true)
  },
  createVoucher: async (payload: Omit<AdminVoucher, 'id' | 'usedCount' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<AdminVoucher>> => {
    return apiClient(`/admin/vouchers`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  updateVoucher: async (id: string, patch: Partial<AdminVoucher>): Promise<ApiResponse<AdminVoucher>> => {
    return apiClient(`/admin/vouchers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    })
  },
  deleteVoucher: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient(`/admin/vouchers/${id}`, { method: 'DELETE' })
  },

  // Users CRUD (create, delete)
  createUser: async (payload: { email: string; fullName: string; userType: AdminUser['userType']; status: AdminUser['status'] }): Promise<ApiResponse<AdminUser>> => {
    return apiClient(`/admin/users`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  deleteUser: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient(`/admin/users/${id}`, { method: 'DELETE' })
  },

  // Complaints
  listComplaints: async (params?: { status?: 'OPEN' | 'IN_REVIEW' | 'RESOLVED' | 'REJECTED' }): Promise<ApiResponse<any[]>> => {
    const qs = new URLSearchParams()
    if (params?.status) qs.set('status', params.status)
    return apiClient(`/admin/complaints${qs.toString() ? `?${qs}` : ''}`, {}, true)
  },
  updateComplaintStatus: async (id: string, status: 'OPEN' | 'IN_REVIEW' | 'RESOLVED' | 'REJECTED'): Promise<ApiResponse<any>> => {
    return apiClient(`/admin/complaints/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  },

  // System metrics
  getSystemMetrics: async (): Promise<ApiResponse<{ startedAt: string; requestCount: number; errorCount: number; avgResponseMs: number }>> => {
    return apiClient(`/admin/system/metrics`, {}, true)
  },
}


