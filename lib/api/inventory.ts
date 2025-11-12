import { apiClient, ApiResponse } from './client'

export interface InventoryHistory {
  id: string
  productId: string
  variantId?: string
  quantityChange: number
  reason: 'purchase' | 'return' | 'adjustment' | 'restock' | 'damage'
  referenceId?: string
  createdAt: string
  note?: string
  user?: string
}

export interface InventoryHistoryPage {
  content: InventoryHistory[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export const inventoryApi = {
  getProductHistory: async (productId: string, page: number = 0, size: number = 20): Promise<ApiResponse<InventoryHistoryPage>> => {
    return apiClient<InventoryHistoryPage>(`/products/${productId}/inventory/history?page=${page}&size=${size}`)
  },
}


