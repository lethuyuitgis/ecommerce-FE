"use client"

import { apiClient } from "./client"

export interface Complaint {
  id: string
  orderId?: string
  productId?: string
  sellerId?: string
  category?: string
  title?: string
  description?: string
  status?: string
  desiredResolution?: string
  createdAt?: string
  updatedAt?: string
}

export interface ComplaintMessage {
  id: string
  complaintId: string
  senderId: string
  senderType: "CUSTOMER" | "ADMIN" | string
  content: string
  attachments?: string | null
  createdAt?: string
}

const unwrap = <T>(response: any): T => {
  if (response && typeof response === "object" && !Array.isArray(response) && "success" in response) {
    return (response.data ?? null) as T
  }
  return response as T
}

export const complaintsApi = {
  list: async (): Promise<Complaint[]> => {
    const res = await apiClient("/complaints", {}, true)
    return unwrap<Complaint[]>(res)
  },

  getById: async (id: string): Promise<Complaint> => {
    const res = await apiClient(`/complaints/${id}`, {}, true)
    return unwrap<Complaint>(res)
  },

  getMessages: async (id: string): Promise<ComplaintMessage[]> => {
    const res = await apiClient(`/complaints/${id}/messages`, {}, true)
    return unwrap<ComplaintMessage[]>(res)
  },

  addMessage: async (id: string, payload: { content: string; attachments?: string }): Promise<ComplaintMessage> => {
    const res = await apiClient(`/complaints/${id}/messages`, {
      method: "POST",
      body: JSON.stringify(payload),
    })
    return unwrap<ComplaintMessage>(res)
  },

  cancel: async (id: string): Promise<Complaint> => {
    const res = await apiClient(`/complaints/${id}/cancel`, {
      method: "POST",
    })
    return unwrap<Complaint>(res)
  },
}


