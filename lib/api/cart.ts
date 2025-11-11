import { apiClient, ApiResponse } from './client'

export interface CartItem {
  id: string
  productId: string
  productName: string
  productPrice: number
  productImage?: string
  variantId?: string
  variantName?: string
  variantPrice?: number
  quantity: number
  availableQuantity: number
}

export const cartApi = {
  getCart: async (): Promise<ApiResponse<CartItem[]>> => {
    return apiClient<CartItem[]>('/cart')
  },

  addToCart: async (productId: string, variantId: string | null, quantity: number = 1): Promise<ApiResponse<CartItem>> => {
    return apiClient<CartItem>('/cart/add', {
      method: 'POST',
      body: JSON.stringify({
        productId,
        variantId,
        quantity,
      }),
    })
  },

  updateCartItem: async (cartItemId: string, quantity: number): Promise<ApiResponse<CartItem>> => {
    return apiClient<CartItem>(`/cart/${cartItemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    })
  },

  removeFromCart: async (cartItemId: string): Promise<ApiResponse<void>> => {
    return apiClient<void>(`/cart/${cartItemId}`, {
      method: 'DELETE',
    })
  },

  clearCart: async (): Promise<ApiResponse<void>> => {
    return apiClient<void>('/cart', {
      method: 'DELETE',
    })
  },
}
