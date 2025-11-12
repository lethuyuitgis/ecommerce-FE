import { apiClient, ApiResponse } from './client'

export interface Conversation {
  id: string
  customerId: string
  customerName?: string
  customerEmail?: string
  lastMessage?: string
  lastMessageAt?: string
  sellerUnreadCount?: number
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
  getConversations: async (): Promise<ApiResponse<Conversation[]>> => {
    return apiClient<Conversation[]>('/seller/messages/conversations')
  },

  getConversationMessages: async (conversationId: string, page = 0, size = 50): Promise<ApiResponse<MessagePage>> => {
    return apiClient<MessagePage>(`/seller/messages/conversations/${conversationId}?page=${page}&size=${size}`)
  },

  sendMessage: async (payload: CreateMessagePayload): Promise<ApiResponse<Message>> => {
    return apiClient<Message>('/seller/messages', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
}
