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
  // Variant options
  size?: string
  color?: string
  [key: string]: any
}

export interface AddToCartRequest {
  productId: string
  variantId?: string | null
  quantity: number
  size?: string
  color?: string
  [key: string]: any
}

export const cartApi = {
  getCart: async (): Promise<ApiResponse<CartItem[]>> => {
    return apiClient<CartItem[]>('/cart')
  },

  addToCart: async (
    productId: string,
    variantId: string | null = null,
    quantity: number = 1,
    options?: { size?: string; color?: string; [key: string]: any }
  ): Promise<ApiResponse<CartItem>> => {
    const payload: AddToCartRequest = {
      productId,
      variantId: variantId || undefined,
      quantity,
    }
    
    if (options?.size) {
      payload.size = options.size
    }
    if (options?.color) {
      payload.color = options.color
    }
    
    return apiClient<CartItem>('/cart/add', {
      method: 'POST',
      body: JSON.stringify(payload),
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






