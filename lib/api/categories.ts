import { apiClient, ApiResponse } from './client'

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  coverImage?: string
  parentId?: string
  displayOrder?: number
  isActive?: boolean
  children?: Category[]
  subcategories?: string[]
}

export const categoriesApi = {
  getAll: async (): Promise<ApiResponse<Category[]>> => {
    return apiClient<Category[]>('/categories')
  },

  getBySlug: async (slug: string): Promise<ApiResponse<Category>> => {
    return apiClient<Category>(`/categories/${slug}`)
  },

  create: async (data: Partial<Category>): Promise<ApiResponse<Category>> => {
    return apiClient<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (id: string, data: Partial<Category>): Promise<ApiResponse<Category>> => {
    return apiClient<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient<void>(`/categories/${id}`, {
      method: 'DELETE',
    })
  },

  toggleActive: async (id: string, active: boolean): Promise<ApiResponse<Category>> => {
    return apiClient<Category>(`/categories/${id}/toggle-active`, {
      method: 'PUT',
      body: JSON.stringify({ active }),
    })
  },
}

