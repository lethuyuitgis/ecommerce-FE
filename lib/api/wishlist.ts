import { apiClient, ApiResponse } from './client'
import { Product } from './products'

export const wishlistApi = {
  getWishlist: async (): Promise<ApiResponse<Product[]>> => {
    return apiClient<Product[]>('/wishlist')
  },

  addToWishlist: async (productId: string): Promise<ApiResponse<void>> => {
    return apiClient<void>('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    })
  },

  removeFromWishlist: async (productId: string): Promise<ApiResponse<void>> => {
    return apiClient<void>(`/wishlist/${productId}`, {
      method: 'DELETE',
    })
  },

  checkWishlist: async (productId: string): Promise<ApiResponse<boolean>> => {
    return apiClient<boolean>(`/wishlist/check/${productId}`)
  },
}









