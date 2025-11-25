import { apiClient, ApiResponse } from './client'

export interface Conversation {
  id: string
  customerId?: string
  customerName?: string
  customerEmail?: string
  sellerId?: string
  sellerName?: string
  lastMessage?: string
  lastMessageAt?: string
  sellerUnreadCount?: number
  customerUnreadCount?: number
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName?: string
  content: string
  attachments?: string
  createdAt: string
  readAt?: string
}

export interface MessagePage {
  content: Message[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export interface CreateMessagePayload {
  conversationId?: string
  recipientId: string
  content: string
  attachments?: string
}

export const messagesApi = {
  // Seller endpoints
  getConversations: async (): Promise<ApiResponse<Conversation[]>> => {
    return apiClient<Conversation[]>('/seller/messages/conversations')
  },

  getConversationMessages: async (conversationId: string, page = 0, size = 50): Promise<ApiResponse<MessagePage>> => {
    return apiClient<MessagePage>(`/seller/messages/conversations/${conversationId}?page=${page}&size=${size}`)
  },

  sendMessage: async (payload: CreateMessagePayload): Promise<ApiResponse<Message>> => {
    // Try customer endpoint first, fallback to seller endpoint
    try {
      return await apiClient<Message>('/messages', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
    } catch {
      // Fallback to seller endpoint
      return await apiClient<Message>('/seller/messages', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
    }
  },

  // Customer endpoints
  getCustomerConversations: async (): Promise<ApiResponse<Conversation[]>> => {
    return apiClient<Conversation[]>('/messages/conversations')
  },

  getCustomerConversationMessages: async (conversationId: string, page = 0, size = 50): Promise<ApiResponse<MessagePage>> => {
    return apiClient<MessagePage>(`/messages/conversations/${conversationId}?page=${page}&size=${size}`)
  },
}
