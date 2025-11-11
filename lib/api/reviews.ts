import { apiClient, ApiResponse } from './client'

export interface ProductReview {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number
  title?: string
  comment?: string
  helpfulCount: number
  createdAt: string
}

export interface CreateReviewRequest {
  orderItemId?: string
  rating: number
  title: string
  comment: string
}

export interface ReviewPage {
  content: ProductReview[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export const reviewsApi = {
  getProductReviews: async (productId: string, page: number = 0, size: number = 20): Promise<ApiResponse<ReviewPage>> => {
    return apiClient<ReviewPage>(`/reviews/product/${productId}?page=${page}&size=${size}`)
  },

  createReview: async (productId: string, data: CreateReviewRequest): Promise<ApiResponse<ProductReview>> => {
    return apiClient<ProductReview>(`/reviews/product/${productId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}
