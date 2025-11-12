import { apiClient, ApiResponse } from './client'

export interface SellerCustomer {
  customerId: string
  fullName?: string
  email?: string
  phone?: string
  totalOrders: number
  totalSpent: number
  lastOrderAt?: string
}

export interface SellerCustomerPage {
  content: SellerCustomer[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export interface SellerCustomerDetail {
  customerId: string
  fullName?: string
  email?: string
  phone?: string
  avatarUrl?: string
  firstOrderAt?: string
  lastOrderAt?: string
  totalOrders: number
  totalSpent: number
  recentOrders: Array<{
    orderId: string
    orderNumber: string
    finalTotal: number
    status: string
    createdAt: string
  }>
}

export const sellerCustomersApi = {
  list: async (search = '', page = 0, size = 20): Promise<ApiResponse<SellerCustomerPage>> => {
    const params = new URLSearchParams()
    params.set('page', String(page))
    params.set('size', String(size))
    if (search) params.set('search', search)
    return apiClient<SellerCustomerPage>(`/seller/customers?${params.toString()}`)
  },

  detail: async (customerId: string): Promise<ApiResponse<SellerCustomerDetail>> => {
    return apiClient<SellerCustomerDetail>(`/seller/customers/${customerId}`)
  },
}
