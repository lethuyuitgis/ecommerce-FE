import { apiClient, ApiResponse } from './client'

export interface PaymentMethod {
  id: string
  name: string
  code?: string
  enabled?: boolean
  isActive?: boolean
  icon?: string
  description?: string
  requiresRedirect?: boolean
}

export interface BankInfo {
  bankName: string
  accountNumber: string
  accountHolder: string
  branch?: string
}

export interface PaymentSettings {
  paymentMethods: PaymentMethod[]
  bankInfo?: BankInfo
}

export interface PaymentRequest {
  orderId: string
  methodId: string
  amount: number
}

export interface PaymentResponse {
  paymentId: string
  status: string
  transactionId?: string
  paymentUrl?: string
  message: string
}

export interface PaymentDetail {
  id: string
  orderId: string
  userId: string
  methodId: string
  methodName: string
  amount: number
  status: string
  createdAt: string
  completedAt?: string
}

export const paymentApi = {
  getMethods: async (): Promise<ApiResponse<PaymentMethod[]>> => {
    return apiClient<PaymentMethod[]>('/payment/methods')
  },

  processPayment: async (request: PaymentRequest): Promise<ApiResponse<PaymentResponse>> => {
    return apiClient<PaymentResponse>('/payment/process', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  },

  getPayment: async (paymentId: string): Promise<ApiResponse<PaymentDetail>> => {
    return apiClient<PaymentDetail>(`/payment/${paymentId}`)
  },

  // VNPay callback - called by VNPay after payment
  vnpayCallback: async (params: Record<string, string>): Promise<ApiResponse<PaymentResponse>> => {
    const queryParams = new URLSearchParams(params)
    return apiClient<PaymentResponse>(`/payment/vnpay/callback?${queryParams.toString()}`)
  },

  // Seller payment settings
  getSettings: async (): Promise<ApiResponse<PaymentSettings>> => {
    return apiClient<PaymentSettings>('/seller/payment/settings')
  },

  updatePaymentMethod: async (methodId: string, enabled: boolean): Promise<ApiResponse<PaymentMethod>> => {
    return apiClient<PaymentMethod>(`/seller/payment/methods/${methodId}`, {
      method: 'PUT',
      body: JSON.stringify({ enabled }),
    })
  },

  updateBankInfo: async (bankInfo: BankInfo): Promise<ApiResponse<BankInfo>> => {
    return apiClient<BankInfo>('/seller/payment/bank-info', {
      method: 'PUT',
      body: JSON.stringify(bankInfo),
    })
  },
}


