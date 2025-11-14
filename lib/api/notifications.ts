import { apiClient, ApiResponse } from './client'

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type?: string
  linkUrl?: string
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

export interface NotificationPreference {
  id: string
  type: string
  label: string
  description: string
  emailEnabled: boolean
  pushEnabled: boolean
}

export interface NotificationSettings {
  preferences: NotificationPreference[]
}

export const notificationsApi = {
  getNotifications: async (userId: string, page: number = 0, size: number = 20): Promise<ApiResponse<NotificationPage>> => {
    const params = new URLSearchParams({ userId, page: page.toString(), size: size.toString() })
    return apiClient<NotificationPage>(`/notifications?${params.toString()}`, {}, true)
  },

  getUnreadCount: async (userId: string): Promise<ApiResponse<number>> => {
    const params = new URLSearchParams({ userId })
    return apiClient<number>(`/notifications/unread-count?${params.toString()}`, {}, true)
  },

  markAsRead: async (userId: string, id: string): Promise<ApiResponse<Notification>> => {
    const params = new URLSearchParams({ userId })
    return apiClient<Notification>(`/notifications/${id}/read?${params.toString()}`, {
      method: 'POST',
    })
  },

  markAllAsRead: async (userId: string): Promise<ApiResponse<void>> => {
    const params = new URLSearchParams({ userId })
    return apiClient<void>(`/notifications/read-all?${params.toString()}`, {
      method: 'POST',
    })
  },

  deleteNotification: async (userId: string, id: string): Promise<ApiResponse<void>> => {
    const params = new URLSearchParams({ userId })
    return apiClient<void>(`/notifications/${id}?${params.toString()}`, {
      method: 'DELETE',
    })
  },
}

export const notificationSettingsApi = {
  getPreferences: async (): Promise<ApiResponse<NotificationSettings>> => {
    return apiClient<NotificationSettings>('/seller/notification/preferences')
  },

  updatePreference: async (
    preferenceId: string,
    emailEnabled?: boolean,
    pushEnabled?: boolean
  ): Promise<ApiResponse<NotificationPreference>> => {
    return apiClient<NotificationPreference>(`/seller/notification/preferences/${preferenceId}`, {
      method: 'PUT',
      body: JSON.stringify({ emailEnabled, pushEnabled }),
    })
  },

  updatePreferences: async (preferences: NotificationPreference[]): Promise<ApiResponse<NotificationSettings>> => {
    return apiClient<NotificationSettings>('/seller/notification/preferences', {
      method: 'PUT',
      body: JSON.stringify({ preferences }),
    })
  },
}
