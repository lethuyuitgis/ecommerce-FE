import { apiClient, ApiResponse } from './client'

export interface Banner {
  id: string
  title: string
  imageUrl: string
  linkUrl?: string
  position?: string
  displayOrder?: number
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

const unwrap = <T>(res: any): T => {
  if (res && typeof res === 'object' && !Array.isArray(res) && 'success' in res) {
    return (res.data ?? null) as T
  }
  return res as T
}

export const bannersApi = {
  list: async (position: string = 'HOME_MAIN'): Promise<Banner[]> => {
    const res = await apiClient<Banner[]>(`/banners?position=${encodeURIComponent(position)}`, {}, true)
    const data = unwrap<Banner[]>(res)
    return Array.isArray(data) ? data : []
  },
  create: async (payload: Omit<Banner, 'id'>): Promise<Banner> => {
    const res = await apiClient<Banner>(`/banners/admin`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return unwrap<Banner>(res)
  },
  update: async (id: string, patch: Partial<Banner>): Promise<Banner> => {
    const res = await apiClient<Banner>(`/banners/admin/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ id, ...patch }),
    })
    return unwrap<Banner>(res)
  },
  remove: async (id: string): Promise<void> => {
    await apiClient<void>(`/banners/admin/${id}`, { method: 'DELETE' })
  },
}
