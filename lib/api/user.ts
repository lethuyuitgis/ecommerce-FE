import { apiClient, ApiResponse } from './client'

export interface User {
  id: string
  email: string
  fullName: string
  phone?: string
  avatarUrl?: string
  userType: string
  gender?: string
  birthDate?: string
}

export interface UserAddress {
  id: string
  addressType?: string
  fullName: string
  phone: string
  province?: string
  city: string
  district: string
  ward: string
  street?: string
  address: string
  email?: string
  isDefault: boolean
}

export const userApi = {
  getProfile: async (): Promise<ApiResponse<User>> => {
    return apiClient<User>('/users/profile')
  },

  updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    return apiClient<User>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  getAddresses: async (): Promise<ApiResponse<UserAddress[]>> => {
    return apiClient<UserAddress[]>('/users/addresses')
  },

  addAddress: async (data: Omit<UserAddress, 'id'>): Promise<ApiResponse<UserAddress>> => {
    return apiClient<UserAddress>('/users/addresses', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  updateAddress: async (addressId: string, data: Partial<UserAddress>): Promise<ApiResponse<UserAddress>> => {
    return apiClient<UserAddress>(`/users/addresses/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  deleteAddress: async (addressId: string): Promise<ApiResponse<void>> => {
    return apiClient<void>(`/users/addresses/${addressId}`, {
      method: 'DELETE',
    })
  },

  setDefaultAddress: async (addressId: string): Promise<ApiResponse<UserAddress>> => {
    return apiClient<UserAddress>(`/users/addresses/${addressId}/set-default`, {
      method: 'PUT',
    })
  },
}

