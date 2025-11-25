import { apiClient, ApiResponse } from './client'

export interface ProductReview {
  id: string
  productId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title?: string
  comment?: string
  images?: string[]
  videos?: string[]
  helpfulCount: number
  createdAt: string
}

export interface CreateReviewRequest {
  orderItemId?: string
  rating: number
  title: string
  comment: string
  images?: string[]
  videos?: string[]
}

export interface PurchaseStatus {
  hasPurchased: boolean
  orderItemId?: string
  orderId?: string
  orderNumber?: string
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

  createReviewWithMedia: async (
    productId: string,
    reviewData: Omit<CreateReviewRequest, 'images' | 'videos'>,
    images?: File[],
    videos?: File[]
  ): Promise<ApiResponse<ProductReview>> => {
    const { apiClientFormData } = await import('./client')
    
    const formData = new FormData()
    formData.append('rating', reviewData.rating.toString())
    formData.append('title', reviewData.title)
    formData.append('comment', reviewData.comment)
    if (reviewData.orderItemId) {
      formData.append('orderItemId', reviewData.orderItemId)
    }

    // Upload images
    if (images && images.length > 0) {
      images.forEach((file) => {
        formData.append('images', file)
      })
    }

    // Upload videos
    if (videos && videos.length > 0) {
      videos.forEach((file) => {
        formData.append('videos', file)
      })
    }

    return apiClientFormData<ProductReview>(`/reviews/product/${productId}`, formData)
  },
}





