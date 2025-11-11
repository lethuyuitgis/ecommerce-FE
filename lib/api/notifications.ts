import { apiClient, ApiResponse } from './client'

export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  link?: string
  imageUrl?: string
  isRead: boolean
  createdAt: string
}

export interface NotificationPage {
  content: Notification[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export const notificationsApi = {
  getNotifications: async (page: number = 0, size: number = 20): Promise<ApiResponse<NotificationPage>> => {
    return apiClient<NotificationPage>(`/notifications?page=${page}&size=${size}`)
  },

  getUnreadCount: async (): Promise<ApiResponse<number>> => {
    return apiClient<number>('/notifications/unread-count')
  },

  markAsRead: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient<void>(`/notifications/${id}/read`, {
      method: 'PUT',
    })
  },

  markAllAsRead: async (): Promise<ApiResponse<void>> => {
    return apiClient<void>('/notifications/read-all', {
      method: 'PUT',
    })
  },

  deleteNotification: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient<void>(`/notifications/${id}`, {
      method: 'DELETE',
    })
  },
}






