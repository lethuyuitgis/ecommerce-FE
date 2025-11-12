import { apiClient, ApiResponse } from './client'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  fullName: string
  phone?: string
}

export interface AuthResponse {
  token: string
  refreshToken: string
  userId: string
  email: string
  fullName: string
  userType: string
}

export const authApi = {
  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    
    if (response.success && response.data) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('userId', response.data.userId)
      localStorage.setItem('refreshToken', response.data.refreshToken)
    }
    
    return response
  },

  register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    
    if (response.success && response.data) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('userId', response.data.userId)
      localStorage.setItem('refreshToken', response.data.refreshToken)
    }
    
    return response
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('refreshToken')
  },

  getToken: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('token')
  },

  getUserId: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('userId')
  },

  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem('token')
  },

  loginWithGoogle: async (idToken: string): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient<AuthResponse>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    })
    
    if (response.success && response.data) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('userId', response.data.userId)
      localStorage.setItem('refreshToken', response.data.refreshToken)
    }
    
    return response
  },

  loginWithFacebook: async (accessToken: string): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient<AuthResponse>('/auth/facebook', {
      method: 'POST',
      body: JSON.stringify({ accessToken }),
    })
    
    if (response.success && response.data) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('userId', response.data.userId)
      localStorage.setItem('refreshToken', response.data.refreshToken)
    }
    
    return response
  },
}
