import { apiClient, ApiResponse } from './client'

export interface PaymentMethod {
  id: string
  name: string
  code: string
  enabled: boolean
  icon?: string
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

export const paymentApi = {
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


