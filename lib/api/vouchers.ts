import { apiClient, ApiResponse } from './client'

export interface Voucher {
  id: string
  code: string
  name: string
  description?: string
  discountType: string // PERCENTAGE, FIXED_AMOUNT
  discountValue: number
  maxDiscountAmount?: number
  minPurchaseAmount?: number
  startDate: string
  endDate: string
  usageLimit?: number
  usageCount?: number
  status: string
  applicableTo?: string[] // productIds, categoryIds
}

export interface VoucherPage {
  content: Voucher[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export interface ValidateVoucherRequest {
  code: string
  subtotal: number
  items?: Array<{
    productId: string
    quantity: number
  }>
}

export interface ValidateVoucherResponse {
  valid: boolean
  voucher?: Voucher
  discountAmount: number
  message?: string
}

export const vouchersApi = {
  getAvailable: async (subtotal?: number): Promise<ApiResponse<Voucher[]>> => {
    let url = '/vouchers/available'
    if (subtotal) {
      url += `?subtotal=${subtotal}`
    }
    return apiClient<Voucher[]>(url)
  },

  validate: async (data: ValidateVoucherRequest): Promise<ApiResponse<ValidateVoucherResponse>> => {
    return apiClient<ValidateVoucherResponse>('/vouchers/validate', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  getSellerVouchers: async (page: number = 0, size: number = 20): Promise<ApiResponse<VoucherPage>> => {
    return apiClient<VoucherPage>(`/seller/vouchers?page=${page}&size=${size}`)
  },
}


