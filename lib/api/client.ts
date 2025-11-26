import { removeCookie } from '@/lib/utils/cookies'

// Use Next.js API route as proxy in browser, direct backend URL in server-side
export const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use Next.js API proxy to avoid CORS issues
    return '/api'
  }
  // Server-side: use direct backend URL
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
  timestamp?: string
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

const AUTH_STORAGE_KEYS = ['token', 'refreshToken', 'userId', 'email', 'fullName', 'userType', 'avatarUrl']
let redirectingToLogin = false

export function clearAuthState() {
  if (typeof window === 'undefined') return
  AUTH_STORAGE_KEYS.forEach((key) => {
    try {
      window.localStorage.removeItem(key)
      window.sessionStorage?.removeItem?.(key)
    } catch {
      // ignore
    }
  })
  removeCookie('token')
  removeCookie('userId')
}

export function handleUnauthorizedRedirect() {
  if (typeof window === 'undefined') return
  if (redirectingToLogin) return

  const isLoginRoute = window.location.pathname.startsWith('/login')
  const currentPath = window.location.pathname + window.location.search + window.location.hash

  clearAuthState()

  if (isLoginRoute) {
    // Đang ở trang login, không redirect nữa để tránh vòng lặp
    return
  }

  redirectingToLogin = true
  const redirectParam = encodeURIComponent(currentPath || '/')
  window.location.href = `/login?redirect=${redirectParam}`
}

export async function getAuthHeaders(): Promise<HeadersInit> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    if (userId && userId.trim() !== '') {
      headers['X-User-Id'] = userId
    }
  } else {
    try {
      const { getAuthFromCookies } = await import('../server/auth-cookies')
      const { token, userId } = await getAuthFromCookies()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      if (userId) {
        headers['X-User-Id'] = userId
      }
    } catch (error) {
      // Ignore - likely running in an environment without Next.js headers
    }
  }

  return headers
}

// Request deduplication map
const pendingRequests = new Map<string, Promise<ApiResponse<any>>>()

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
  useCache: boolean = false
): Promise<ApiResponse<T>> {
  const requestStartedAt = performance.now?.() ?? Date.now()
  const method = options.method || 'GET'
  const isReadRequest = method === 'GET' || method === 'HEAD'
  
  // Create cache key
  const cacheKey = `${method}:${endpoint}:${JSON.stringify(options.body || {})}`
  
  // Use cache for GET requests if enabled
  if (useCache && isReadRequest) {
    const { apiCache } = await import('./cache')
    return apiCache.get(cacheKey, () => fetchApi<T>(endpoint, options))
  }

  // Request deduplication for GET requests
  if (isReadRequest && pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey)!
  }

  const requestPromise = fetchApi<T>(endpoint, options).then((response) => {
    const duration = (performance.now?.() ?? Date.now()) - requestStartedAt
    if (duration > 1000) {
      const seconds = (duration / 1000).toFixed(2)
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[apiClient] Slow response (${seconds}s): ${method} ${endpoint}`)
      }
    }
    return response
  })
  
  if (isReadRequest) {
    pendingRequests.set(cacheKey, requestPromise)
    requestPromise.finally(() => {
      pendingRequests.delete(cacheKey)
    })
  }

  return requestPromise
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers = await getAuthHeaders()
  
  // If body is FormData, don't set Content-Type (browser will set it with boundary)
  const isFormData = options.body instanceof FormData
  const finalHeaders: HeadersInit = isFormData
    ? { ...options.headers }
    : {
        ...headers,
        ...options.headers,
      }
  
  // Add auth headers even for FormData
  if (isFormData) {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')
      if (token) {
        finalHeaders['Authorization'] = `Bearer ${token}`
      }
      if (userId && userId.trim() !== '') {
        finalHeaders['X-User-Id'] = userId
      }
    }
  }
  
  const config: RequestInit = {
    ...options,
    headers: finalHeaders,
  }

  try {
    const apiBaseUrl = getApiBaseUrl()
    const url = `${apiBaseUrl}${endpoint}`
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[apiClient] Fetching:', url, { method: config.method || 'GET' })
    }
    
    const response = await fetch(url, config)

    if (response.status === 401 || response.status === 403) {
      // Check if this is a public endpoint that shouldn't require authentication
      const isPublicEndpoint = endpoint.match(/^\/(products|categories|home|public|promotions|auth|upload\/image)/)
      
      if (isPublicEndpoint) {
        // For public endpoints, don't redirect - just clear invalid auth state and continue
        // The backend should allow access to public endpoints even without valid token
        clearAuthState()
        // Don't redirect for public endpoints - they should work without login
        // Just throw error without redirect flag
        const message =
          response.status === 401
            ? 'Unauthorized - Token expired'
            : 'Forbidden - Please login again'
        throw new ApiError(message, response.status, { redirect: false })
      } else {
        // For protected endpoints, redirect to login
        clearAuthState()
        handleUnauthorizedRedirect()
        const message =
          response.status === 401
            ? 'Unauthorized - Token expired'
            : 'Forbidden - Please login again'
        throw new ApiError(message, response.status, { redirect: true })
      }
    }
    
    // Try to parse JSON response
    let data: any = null
    try {
      const text = await response.text()
      if (text && text.trim()) {
        try {
          data = JSON.parse(text)
        } catch (parseErr) {
          // If not valid JSON, use text as message
          if (!response.ok) {
            throw new ApiError(
              text || `HTTP ${response.status}: ${response.statusText}`,
              response.status,
              { statusText: response.statusText, rawText: text }
            )
          }
          data = { message: text || `HTTP ${response.status}: ${response.statusText}` }
        }
      } else {
        // Empty response body
        if (!response.ok) {
          throw new ApiError(
            `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            { statusText: response.statusText }
          )
        }
        // Empty but ok response - return empty object
        data = {}
      }
    } catch (parseError) {
      // If response is not JSON, create error response
      if (!response.ok) {
        throw new ApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          { statusText: response.statusText }
        )
      }
      throw new ApiError('Invalid JSON response', 0, parseError)
    }

    // Check if response is ok
    if (!response.ok) {
      const errorMessage = data?.message || data?.error || (typeof data === 'string' ? data : `HTTP ${response.status}: ${response.statusText}`)
      throw new ApiError(
        typeof errorMessage === 'string' ? errorMessage : 'An error occurred',
        response.status,
        data
      )
    }

    // Check if API response indicates failure (even if HTTP status is ok)
    // Only check if data exists and is an object with 'success' property
    if (data && typeof data === 'object' && data !== null && 'success' in data) {
      if (!data.success) {
        const errorMessage = data.message || data.error || 'API request failed'
        if (process.env.NODE_ENV === 'development') {
          console.error('[apiClient] API returned success=false:', { url, data, errorMessage })
        }
        throw new ApiError(
          typeof errorMessage === 'string' ? errorMessage : 'API request failed',
          response.status,
          data
        )
      }
      // If success is true, return the data as is
      if (process.env.NODE_ENV === 'development') {
        console.log('[apiClient] Success response:', { url, hasData: !!data.data })
      }
      return data
    }

    // If data doesn't have 'success' property, return it as is (might be direct data)
    // Return empty object only if data is null/undefined
    if (process.env.NODE_ENV === 'development') {
      console.warn('[apiClient] Response without success property:', { url, data })
    }
    return data ?? {}
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401 || error.status === 403) {
        clearAuthState()
        handleUnauthorizedRedirect()
      }
      if (process.env.NODE_ENV === 'development') {
        console.error('[apiClient] ApiError:', { endpoint, error: error.message, status: error.status })
      }
      throw error
    }
    
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      const errorMsg = 'Network error: Unable to connect to server'
      if (process.env.NODE_ENV === 'development') {
        console.error('[apiClient] Network error:', { endpoint, error: error.message })
      }
      throw new ApiError(errorMsg, 0, error)
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.error('[apiClient] Unexpected error:', { endpoint, error })
    }
    throw new ApiError(error instanceof Error ? error.message : 'Network error', 0, error)
  }
}

/**
 * API client for FormData requests (file uploads, multipart forms)
 */
export async function apiClientFormData<T>(
  endpoint: string,
  formData: FormData,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers: HeadersInit = {}
  
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    if (userId && userId.trim() !== '') {
      headers['X-User-Id'] = userId
    }
  } else {
    try {
      const { getAuthFromCookies } = await import('../server/auth-cookies')
      const { token, userId } = await getAuthFromCookies()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      if (userId) {
        headers['X-User-Id'] = userId
      }
    } catch (error) {
      // Ignore - likely running in an environment without Next.js headers
    }
  }

  try {
    const apiBaseUrl = getApiBaseUrl()
    const url = `${apiBaseUrl}${endpoint}`
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[apiClientFormData] Fetching:', url)
    }
    
    const response = await fetch(url, {
      ...options,
      method: options.method || 'POST',
      headers,
      body: formData,
    })

    if (response.status === 401 || response.status === 403) {
      clearAuthState()
      handleUnauthorizedRedirect()
      const message =
        response.status === 401
          ? 'Unauthorized - Token expired'
          : 'Forbidden - Please login again'
      throw new ApiError(message, response.status, { redirect: true })
    }

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(
        data.message || data.error || 'Request failed',
        response.status,
        data
      )
    }

    // Check if API response indicates failure
    if (data && typeof data === 'object' && data !== null && 'success' in data) {
      if (!data.success) {
        const errorMessage = data.message || data.error || 'API request failed'
        throw new ApiError(
          typeof errorMessage === 'string' ? errorMessage : 'API request failed',
          response.status,
          data
        )
      }
      return data
    }

    return data ?? { success: true, data: data as T }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError('Request error', 0, error)
  }
}

export async function apiClientWithFile<T>(
  endpoint: string,
  file: File,
  folder: string = 'images',
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const formData = new FormData()
  formData.append('file', file)
  return apiClientFormData<T>(`${endpoint}?folder=${folder}`, formData, options)
}
