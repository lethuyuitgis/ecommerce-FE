// Use Next.js API route as proxy in browser, direct backend URL in server-side
const getApiBaseUrl = () => {
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

async function getAuthHeaders(): Promise<HeadersInit> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    // Backend requires X-User-Id
    if (userId && userId.trim() !== '') {
      headers['X-User-Id'] = userId
    }
  }

  return headers
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers = await getAuthHeaders()
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  }

  try {
    const apiBaseUrl = getApiBaseUrl()
    const response = await fetch(`${apiBaseUrl}${endpoint}`, config)
    
    // Try to parse JSON response
    let data: any
    try {
      data = await response.json()
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
      throw new ApiError(
        data.message || data.error || 'An error occurred',
        response.status,
        data
      )
    }

    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError('Network error', 0, error)
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
  
  const headers: HeadersInit = {}
  
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  try {
    const apiBaseUrl = getApiBaseUrl()
    const response = await fetch(`${apiBaseUrl}${endpoint}?folder=${folder}`, {
      ...options,
      method: 'POST',
      headers,
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(
        data.message || 'Upload failed',
        response.status,
        data
      )
    }

    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError('Upload error', 0, error)
  }
}


