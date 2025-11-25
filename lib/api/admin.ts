import { apiClient, getAuthHeaders } from './client'

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

const unwrap = <T>(response: any): T => {
  if (response && typeof response === 'object' && !Array.isArray(response) && 'success' in response) {
    return (response.data ?? null) as T
  }
  return response as T
}

export const adminApi = {
  // Users
  listUsers: async (params?: { q?: string; role?: string; status?: string }): Promise<AdminUser[]> => {
    const qs = new URLSearchParams()
    if (params?.q) qs.set('q', params.q)
    if (params?.role) qs.set('role', params.role)
    if (params?.status) qs.set('status', params.status)
    const res = await apiClient(`/admin/users${qs.toString() ? `?${qs}` : ''}`, {}, true)
    return unwrap<AdminUser[]>(res)
  },
  updateUserStatus: async (id: string, status: AdminUser['status']): Promise<AdminUser> => {
    const res = await apiClient(`/admin/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
    return unwrap<AdminUser>(res)
  },
  updateUserRole: async (id: string, role: AdminUser['userType']): Promise<AdminUser> => {
    const res = await apiClient(`/admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    })
    return unwrap<AdminUser>(res)
  },

  // Sellers
  listSellers: async (params?: { q?: string; status?: string }): Promise<AdminSeller[]> => {
    const qs = new URLSearchParams()
    if (params?.q) qs.set('q', params.q)
    if (params?.status) qs.set('status', params.status)
    const res = await apiClient(`/admin/sellers${qs.toString() ? `?${qs}` : ''}`, {}, true)
    return unwrap<AdminSeller[]>(res)
  },
  updateSellerStatus: async (id: string, status: AdminSeller['status']): Promise<AdminSeller> => {
    const res = await apiClient(`/admin/sellers/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
    return unwrap<AdminSeller>(res)
  },

  // Shipments
  listShipments: async (params?: { status?: AdminShipment['status'] }): Promise<AdminShipment[]> => {
    const qs = new URLSearchParams()
    if (params?.status) qs.set('status', params.status)
    const res = await apiClient(`/admin/shipments${qs.toString() ? `?${qs}` : ''}`, {}, true)
    return unwrap<AdminShipment[]>(res)
  },
  createShipment: async (payload: Omit<AdminShipment, 'id' | 'trackingNumber' | 'createdAt' | 'updatedAt'>): Promise<AdminShipment> => {
    const res = await apiClient(`/admin/shipments`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return unwrap<AdminShipment>(res)
  },
  listAvailableForShipper: async (): Promise<AdminShipment[]> => {
    const res = await apiClient(`/shipments/available`, {}, true)
    return unwrap<AdminShipment[]>(res)
  },

  // Vouchers
  listVouchers: async (params?: { q?: string; status?: string; type?: string }): Promise<AdminVoucher[]> => {
    const qs = new URLSearchParams()
    if (params?.q) qs.set('q', params.q)
    if (params?.status) qs.set('status', params.status)
    if (params?.type) qs.set('type', params.type)
    const res = await apiClient(`/admin/vouchers${qs.toString() ? `?${qs}` : ''}`, {}, true)
    return unwrap<AdminVoucher[]>(res)
  },
  createVoucher: async (payload: Omit<AdminVoucher, 'id' | 'usedCount' | 'createdAt' | 'updatedAt'>): Promise<AdminVoucher> => {
    const res = await apiClient(`/admin/vouchers`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return unwrap<AdminVoucher>(res)
  },
  updateVoucher: async (id: string, patch: Partial<AdminVoucher>): Promise<AdminVoucher> => {
    const res = await apiClient(`/admin/vouchers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    })
    return unwrap<AdminVoucher>(res)
  },
  deleteVoucher: async (id: string): Promise<void> => {
    await apiClient(`/admin/vouchers/${id}`, { method: 'DELETE' })
  },

  // Users CRUD (create, delete)
  createUser: async (payload: { email: string; fullName: string; userType: AdminUser['userType']; status: AdminUser['status'] }): Promise<AdminUser> => {
    const res = await apiClient(`/admin/users`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return unwrap<AdminUser>(res)
  },
  deleteUser: async (id: string): Promise<void> => {
    await apiClient(`/admin/users/${id}`, { method: 'DELETE' })
  },

  // Complaints
  listComplaints: async (params?: { status?: 'OPEN' | 'IN_REVIEW' | 'RESOLVED' | 'REJECTED' }): Promise<any[]> => {
    const qs = new URLSearchParams()
    if (params?.status) qs.set('status', params.status)
    const res = await apiClient(`/admin/complaints${qs.toString() ? `?${qs}` : ''}`, {}, true)
    return unwrap<any[]>(res)
  },
  getComplaint: async (id: string): Promise<any> => {
    const res = await apiClient(`/admin/complaints/${id}`, {}, true)
    return unwrap<any>(res)
  },
  getComplaintMessages: async (id: string): Promise<any[]> => {
    const res = await apiClient(`/admin/complaints/${id}/messages`, {}, true)
    return unwrap<any[]>(res)
  },
  addComplaintMessage: async (id: string, payload: { content: string; attachments?: string }): Promise<any> => {
    const res = await apiClient(`/admin/complaints/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return unwrap<any>(res)
  },
  updateComplaintStatus: async (id: string, status: 'OPEN' | 'IN_REVIEW' | 'RESOLVED' | 'REJECTED'): Promise<any> => {
    const res = await apiClient(`/admin/complaints/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
    return unwrap<any>(res)
  },

  // System metrics
  getSystemMetrics: async (): Promise<{ startedAt: string; requestCount: number; errorCount: number; avgResponseMs: number }> => {
    const res = await apiClient(`/admin/system/metrics`, {}, true)
    return unwrap(res)
  },

  getAdminOverview: async (params?: { startDate?: string; endDate?: string }): Promise<AdminOverview> => {
    const qs = new URLSearchParams()
    if (params?.startDate) qs.set('startDate', params.startDate)
    if (params?.endDate) qs.set('endDate', params.endDate)
    const res = await apiClient(`/admin/dashboard/overview${qs.toString() ? `?${qs}` : ''}`, {}, true)
    return unwrap<AdminOverview>(res)
  },

  getSellerReportSummary: async (params?: SellerReportQuery): Promise<SellerReportSummary> => {
    const qs = new URLSearchParams()
    if (params?.period) qs.set('period', params.period)
    if (params?.startDate) qs.set('startDate', params.startDate)
    if (params?.endDate) qs.set('endDate', params.endDate)
    if (params?.reportType) qs.set('reportType', params.reportType)
    const res = await apiClient(`/seller/reports/summary${qs.toString() ? `?${qs}` : ''}`, {}, true)
    return unwrap<SellerReportSummary>(res)
  },

  exportSellerReport: async (params: SellerReportExportRequest) => {
    const qs = new URLSearchParams()
    qs.set('type', params.type ?? 'EXCEL')
    if (params.period) qs.set('period', params.period)
    if (params.startDate) qs.set('startDate', params.startDate)
    if (params.endDate) qs.set('endDate', params.endDate)
    if (params.reportType) qs.set('reportType', params.reportType)

    const { reportsApi } = await import('./reports')
    const { blob, filename: apiFilename } = await reportsApi.exportReport({
      type: params.type,
      period: params.period,
      startDate: params.startDate,
      endDate: params.endDate,
      reportType: params.reportType,
    })
    const filename = params.fileNameHint || apiFilename
    return { blob, filename }
  },
}

export type AdminOverview = {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  activeSellers: number
  startDate: string
  endDate: string
  topSellers: Array<{
    sellerId: string
    shopName: string
    orders: number
    revenue: number
  }>
}

export type SellerReportQuery = {
  startDate?: string
  endDate?: string
  period?: '7days' | '30days' | '90days' | 'year' | 'custom'
  reportType?: 'orders' | 'inventory' | 'products' | 'all'
}

export type SellerReportExportRequest = SellerReportQuery & {
  type?: 'EXCEL' | 'PDF'
  fileNameHint?: string
}

export type SellerReportSummary = {
  totalRevenue: number
  totalOrders: number
  completedOrders: number
  totalProducts: number
  activeProducts: number
  orders: SellerOrderSummary[]
  products: SellerProductSummary[]
  revenueSeries: RevenuePoint[]
  statusBreakdown: Record<string, number>
  topCustomers: SellerCustomerSummary[]
  startDate: string
  endDate: string
}

export type RevenuePoint = {
  date: string
  revenue: number
  profit?: number
  orders?: number
}

export type SellerOrderSummary = {
  orderNumber: string
  customerName: string
  status: string
  finalTotal: number
  createdAt: string
}

export type SellerProductSummary = {
  name: string
  price: number
  quantity: number
  status: string
  category?: string | null
}

export type SellerCustomerSummary = {
  customerId: string
  customerName: string
  orderCount: number
  totalSpent: number
  lastOrderAt?: string | null
}


