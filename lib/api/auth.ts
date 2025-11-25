import { apiClient, ApiResponse } from './client'
import { setCookie, removeCookie } from '@/lib/utils/cookies'

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
  avatarUrl?: string
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
      if (response.data.avatarUrl) {
        localStorage.setItem('avatarUrl', response.data.avatarUrl)
      } else {
        localStorage.removeItem('avatarUrl')
      }
      // Also save to cookies for server-side access
      setCookie('userId', response.data.userId, 30)
      setCookie('token', response.data.token, 30)
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
      if (response.data.avatarUrl) {
        localStorage.setItem('avatarUrl', response.data.avatarUrl)
      } else {
        localStorage.removeItem('avatarUrl')
      }
      // Also save to cookies for server-side access
      setCookie('userId', response.data.userId, 30)
      setCookie('token', response.data.token, 30)
    }
    
    return response
  },

  logout: () => {
    void apiClient('/auth/logout', { method: 'POST' }).catch(() => {
      // ignore network errors during logout
    })
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('avatarUrl')
    // Also remove from cookies
    removeCookie('userId')
    removeCookie('token')
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
      if (response.data.avatarUrl) {
        localStorage.setItem('avatarUrl', response.data.avatarUrl)
      } else {
        localStorage.removeItem('avatarUrl')
      }
      // Also save to cookies for server-side access
      setCookie('userId', response.data.userId, 30)
      setCookie('token', response.data.token, 30)
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
      if (response.data.avatarUrl) {
        localStorage.setItem('avatarUrl', response.data.avatarUrl)
      } else {
        localStorage.removeItem('avatarUrl')
      }
      // Also save to cookies for server-side access
      setCookie('userId', response.data.userId, 30)
      setCookie('token', response.data.token, 30)
    }
    
    return response
  },
}
