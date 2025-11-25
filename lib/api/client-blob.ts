import { getAuthHeaders, ApiError, clearAuthState, handleUnauthorizedRedirect } from './client'
import { getApiBaseUrl } from './client'

/**
 * Fetch API that returns Blob (for file downloads, exports, etc.)
 */
export async function apiClientBlob(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ blob: Blob; headers: Headers }> {
  const headers = await getAuthHeaders()
  
  // Remove Content-Type for blob requests
  if ('Content-Type' in headers) {
    delete (headers as Record<string, string>)['Content-Type']
  }
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  }

  try {
    const apiBaseUrl = getApiBaseUrl()
    const url = `${apiBaseUrl}${endpoint}`
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[apiClientBlob] Fetching:', url, { method: config.method || 'GET' })
    }
    
    const response = await fetch(url, config)

    if (response.status === 401 || response.status === 403) {
      clearAuthState()
      handleUnauthorizedRedirect()
      const message =
        response.status === 401
          ? 'Unauthorized - Token expired'
          : 'Forbidden - Please login again'
      throw new ApiError(message, response.status, { redirect: true })
    }
    
    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`
      try {
        const error = JSON.parse(errorText)
        errorMessage = error.message || errorMessage
      } catch {
        errorMessage = errorText || errorMessage
      }
      throw new ApiError(errorMessage, response.status, { statusText: response.statusText })
    }

    const blob = await response.blob()
    return { blob, headers: response.headers }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(error instanceof Error ? error.message : 'Network error', 0, error)
  }
}

/**
 * Fetch API that accepts FormData and returns Blob with headers
 */
export async function apiClientFormDataBlob(
  endpoint: string,
  formData: FormData,
  options: RequestInit = {}
): Promise<{ blob: Blob; headers: Headers }> {
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
  }

  const config: RequestInit = {
    ...options,
    method: 'POST',
    headers,
    body: formData,
  }

  try {
    const apiBaseUrl = getApiBaseUrl()
    const url = `${apiBaseUrl}${endpoint}`
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[apiClientFormDataBlob] Fetching:', url)
    }
    
    const response = await fetch(url, config)

    if (response.status === 401 || response.status === 403) {
      clearAuthState()
      handleUnauthorizedRedirect()
      const message =
        response.status === 401
          ? 'Unauthorized - Token expired'
          : 'Forbidden - Please login again'
      throw new ApiError(message, response.status, { redirect: true })
    }
    
    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`
      try {
        const error = JSON.parse(errorText)
        errorMessage = error.message || errorMessage
      } catch {
        errorMessage = errorText || errorMessage
      }
      throw new ApiError(errorMessage, response.status, { statusText: response.statusText })
    }

    const blob = await response.blob()
    return { blob, headers: response.headers }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(error instanceof Error ? error.message : 'Network error', 0, error)
  }
}

