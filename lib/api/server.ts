// Server-side API client - only use in Server Components
// This file should NOT have 'use client' directive
import 'server-only'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

async function getCookieStore(customCookies?: any) {
  if (customCookies) {
    try {
      if (typeof customCookies === 'function') {
        return await customCookies()
      }
      return customCookies
    } catch {
      return undefined
    }
  }

  try {
    // Lazy import to avoid bundling next/headers in client components
    const { cookies } = await import('next/headers')
    return cookies()
  } catch {
    return undefined
  }
}

async function getHeaderStore(customHeaders?: any) {
  if (customHeaders) {
    try {
      if (typeof customHeaders === 'function') {
        return await customHeaders()
      }
      return customHeaders
    } catch {
      return undefined
    }
  }

  try {
    // Lazy import to avoid bundling next/headers in client components
    const { headers } = await import('next/headers')
    return headers()
  } catch {
    return undefined
  }
}

async function resolveAuthContext(cookies?: any, headers?: any) {
  let userId: string | undefined
  let token: string | undefined

  const cookieStore = await getCookieStore(cookies)
  if (cookieStore?.get) {
    try {
      const userIdCookie = cookieStore.get('userId')
      const tokenCookie = cookieStore.get('token')
      if (userIdCookie) userId = userIdCookie.value
      if (tokenCookie) token = tokenCookie.value
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[resolveAuthContext] Error reading cookies:', error)
      }
    }
  }

  const headerStore = await getHeaderStore(headers)
  if (headerStore?.get) {
    try {
      const xUserId = headerStore.get('x-user-id') || headerStore.get('X-User-Id')
      if (xUserId) userId = userId || xUserId
      if (!token) {
        const authHeader = headerStore.get('authorization') || headerStore.get('Authorization')
        if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
          token = authHeader.substring(7)
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[resolveAuthContext] Error reading headers:', error)
      }
    }
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[resolveAuthContext] Resolved:', { userId: !!userId, token: !!token })
  }

  return { userId, token }
}

/**
 * Check if user is authenticated by checking cookies/headers
 * Returns true if token exists, false otherwise
 */
export async function isAuthenticated(cookies?: any, headers?: any): Promise<boolean> {
  const { token } = await resolveAuthContext(cookies, headers)
  return !!token
}

export async function serverFetch<T>(
  endpoint: string,
  options?: RequestInit,
  cookies?: any,
  headers?: any
): Promise<{ success: boolean; data?: T; message?: string; error?: string }> {
  try {
    const url = endpoint.startsWith('http') ? endpoint : `${BACKEND_URL}${endpoint}`
    
    const fetchHeaders = new Headers()
    if (options?.body) {
      fetchHeaders.set('Content-Type', 'application/json')
    }
    if (options?.headers) {
      const extraHeaders = new Headers(options.headers as HeadersInit)
      extraHeaders.forEach((value, key) => {
        fetchHeaders.set(key, value)
      })
    }
    
    const { userId, token } = await resolveAuthContext(cookies, headers)
    if (userId) {
      fetchHeaders.set('X-User-Id', userId)
    }
    if (token && !fetchHeaders.has('Authorization')) {
      fetchHeaders.set('Authorization', `Bearer ${token}`)
    }
    
    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[serverFetch] ${options?.method || 'GET'} ${url}`)
      console.log(`[serverFetch] Has userId: ${!!userId}, Has token: ${!!token}`)
    }
    
    const response = await fetch(url, {
      ...options,
      headers: fetchHeaders,
      cache: 'no-store', // Always fetch fresh data
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      if (process.env.NODE_ENV === 'development') {
        console.error(`[serverFetch] Error ${response.status} for ${url}:`, errorData)
      }
      return {
        success: false,
        message: errorData.message || `HTTP ${response.status}`,
        error: errorData.error,
      }
    }

    const data = await response.json()
    return {
      success: true,
      data: data.data || data,
      message: data.message,
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to fetch data',
      error: error.message,
    }
  }
}

// Product APIs
export const serverProductsApi = {
  getAll: async (page = 0, size = 20, categoryId?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    })
    if (categoryId) params.append('categoryId', categoryId)
    return serverFetch(`/products?${params}`)
  },

  getFeatured: async (page = 0, size = 24) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    })
    return serverFetch(`/products/featured?${params}`)
  },

  getFlashSales: async (page = 0, size = 24) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    })
    return serverFetch(`/products/flash-sales?${params}`)
  },

  getById: async (id: string) => {
    return serverFetch(`/products/${id}`)
  },

  search: async (keyword: string, page = 0, size = 20) => {
    const params = new URLSearchParams({
      keyword: keyword,
      page: page.toString(),
      size: size.toString(),
    })
    return serverFetch(`/products/search?${params}`)
  },

  getByCategorySlug: async (slug: string, page = 0, size = 24, filters?: {
    minPrice?: number
    maxPrice?: number
    minRating?: number
    subcategory?: string
  }) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    })
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString())
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString())
    if (filters?.minRating) params.append('minRating', filters.minRating.toString())
    if (filters?.subcategory) params.append('subcategory', filters.subcategory)
    return serverFetch(`/products/category/${slug}?${params}`)
  },
}

// Category APIs
export const serverCategoriesApi = {
  getAll: async () => {
    return serverFetch('/categories')
  },

  getBySlug: async (slug: string) => {
    return serverFetch(`/categories/${slug}`)
  },
}

// User APIs
export const serverUserApi = {
  getProfile: async (cookies?: any, headers?: any) => {
    return serverFetch('/users/profile', {}, cookies, headers)
  },

  getAddresses: async (cookies?: any, headers?: any) => {
    return serverFetch('/users/addresses', {}, cookies, headers)
  },
}

// Cart APIs
export const serverCartApi = {
  getCart: async (cookies?: any, headers?: any) => {
    return serverFetch('/cart', {}, cookies, headers)
  },
}

// Seller APIs
export const serverSellerApi = {
  getProducts: async (page = 0, size = 50, params?: { q?: string; categoryId?: string; status?: string }, cookies?: any, headers?: any) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    })
    if (params?.q) queryParams.append('q', params.q)
    if (params?.categoryId) queryParams.append('categoryId', params.categoryId)
    if (params?.status) queryParams.append('status', params.status)
    return serverFetch(`/seller/products?${queryParams}`, {}, cookies, headers)
  },
  
  getProductById: async (productId: string, cookies?: any, headers?: any) => {
    return serverFetch(`/seller/products/${productId}`, {}, cookies, headers)
  },
  
  getOrders: async (page = 0, size = 50, params?: { status?: string }, cookies?: any, headers?: any) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    })
    if (params?.status) queryParams.append('status', params.status)
    return serverFetch(`/seller/orders?${queryParams}`, {}, cookies, headers)
  },
  
  getOrderById: async (orderId: string, cookies?: any, headers?: any) => {
    return serverFetch(`/seller/orders/${orderId}`, {}, cookies, headers)
  },
  
  getCustomers: async (keyword = '', page = 0, size = 12, cookies?: any, headers?: any) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    })
    if (keyword) queryParams.append('keyword', keyword)
    return serverFetch(`/seller/customers?${queryParams}`, {}, cookies, headers)
  },
  
  getCustomerDetail: async (customerId: string, cookies?: any, headers?: any) => {
    return serverFetch(`/seller/customers/${customerId}`, {}, cookies, headers)
  },
  
  getAnalyticsDashboard: async (period: '7days' | '30days' | '90days' | 'year' = '30days', cookies?: any, headers?: any) => {
    return serverFetch(`/seller/analytics/dashboard?period=${period}`, {}, cookies, headers)
  },
  
  getReportsSummary: async (period: '7days' | '30days' | '90days' | 'year' = '30days', reportType = 'all', cookies?: any, headers?: any) => {
    const queryParams = new URLSearchParams({
      period,
      reportType,
    })
    return serverFetch(`/seller/reports/summary?${queryParams}`, {}, cookies, headers)
  },
  
  getOverview: async (cookies?: any, headers?: any) => {
    return serverFetch('/seller/overview', {}, cookies, headers)
  },
  
  getProfile: async (cookies?: any, headers?: any) => {
    return serverFetch('/seller/profile', {}, cookies, headers)
  },
  
  getConversations: async (cookies?: any, headers?: any) => {
    return serverFetch('/seller/messages/conversations', {}, cookies, headers)
  },
  
  getConversationMessages: async (conversationId: string, page = 0, size = 50, cookies?: any, headers?: any) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    })
    return serverFetch(`/seller/messages/conversations/${conversationId}?${params}`, {}, cookies, headers)
  },
}

// Promotions APIs
export const serverPromotionsApi = {
  getActive: async (page = 0, size = 10) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    })
    return serverFetch(`/promotions/active?${params}`)
  },
}

// Reviews APIs
export const serverReviewsApi = {
  getProductReviews: async (productId: string, page = 0, size = 20) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    })
    return serverFetch(`/reviews/product/${productId}?${params}`)
  },
}

// Wishlist APIs
export const serverWishlistApi = {
  checkWishlist: async (productId: string, cookies?: any, headers?: any) => {
    return serverFetch<boolean>(`/wishlist/check/${productId}`, {}, cookies, headers)
  },
}

// Messages APIs
export const serverMessagesApi = {
  getCustomerConversations: async (cookies?: any, headers?: any) => {
    return serverFetch('/messages/conversations', {}, cookies, headers)
  },
  
  getCustomerConversationMessages: async (conversationId: string, page = 0, size = 50, cookies?: any, headers?: any) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    })
    return serverFetch(`/messages/conversations/${conversationId}?${params}`, {}, cookies, headers)
  },
}

// Shipper APIs
export const serverShipperApi = {
  getMyShipments: async (status?: string, cookies?: any, headers?: any) => {
    let url = `/shipments/my-shipments`
    if (status && status !== 'all') {
      url += `?status=${status}`
    }
    return serverFetch(url, {}, cookies, headers)
  },
  
  getOrdersToShip: async (page = 0, size = 20, status?: string, cookies?: any, headers?: any) => {
    // Fetch orders and filter on server side
    const params = new URLSearchParams({
      page: page.toString(),
      size: (size * 2).toString(), // Fetch more to filter
    })
    return serverFetch(`/orders?${params}`, {}, cookies, headers)
  },
  
  getOrderDetail: async (orderId: string, cookies?: any, headers?: any) => {
    return serverFetch(`/orders/${orderId}`, {}, cookies, headers)
  },
}

// Orders APIs
export const serverOrdersApi = {
  getOrders: async (page = 0, size = 100, cookies?: any, headers?: any) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    })
    return serverFetch(`/orders?${params}`, {}, cookies, headers)
  },
  
  checkPurchase: async (productId: string, cookies?: any, headers?: any) => {
    return serverFetch(`/orders/check-purchase/${productId}`, {}, cookies, headers)
  },
}

// Complaints APIs
export const serverComplaintsApi = {
  getAll: async (cookies?: any, headers?: any, status?: string) => {
    const params = new URLSearchParams()
    if (status) params.append('status', status)
    const suffix = params.toString() ? `?${params}` : ''
    return serverFetch(`/complaints${suffix}`, {}, cookies, headers)
  },

  getById: async (id: string, cookies?: any, headers?: any) => {
    return serverFetch(`/complaints/${id}`, {}, cookies, headers)
  },

  getMessages: async (id: string, cookies?: any, headers?: any) => {
    return serverFetch(`/complaints/${id}/messages`, {}, cookies, headers)
  },

  addMessage: async (id: string, payload: { content: string; attachments?: string }, cookies?: any, headers?: any) => {
    return serverFetch(`/complaints/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }, cookies, headers)
  },

  cancel: async (id: string, cookies?: any, headers?: any) => {
    return serverFetch(`/complaints/${id}/cancel`, {
      method: 'POST',
    }, cookies, headers)
  },

  create: async (payload: any, cookies?: any, headers?: any) => {
    return serverFetch('/complaints', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, cookies, headers)
  },
}

// Admin Product APIs
export const serverAdminProductsApi = {
  setFeatured: async (productId: string, payload: { featured: boolean; priority?: number }) => {
    return serverFetch(`/admin/products/${productId}/featured`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  setFlashSale: async (
    productId: string,
    payload: { enabled: boolean; flashPrice?: number; startTime?: string; endTime?: string; stock?: number }
  ) => {
    return serverFetch(`/admin/products/${productId}/flash-sale`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
}

// Admin APIs
export const serverAdminApi = {
  listUsers: async (params?: { q?: string; role?: string; status?: string }, cookies?: any, headers?: any) => {
    const qs = new URLSearchParams()
    if (params?.q) qs.set('q', params.q)
    if (params?.role) qs.set('role', params.role)
    if (params?.status) qs.set('status', params.status)
    const suffix = qs.toString() ? `?${qs}` : ''
    return serverFetch(`/admin/users${suffix}`, {}, cookies, headers)
  },

  listSellers: async (params?: { q?: string; status?: string }, cookies?: any, headers?: any) => {
    const qs = new URLSearchParams()
    if (params?.q) qs.set('q', params.q)
    if (params?.status) qs.set('status', params.status)
    const suffix = qs.toString() ? `?${qs}` : ''
    return serverFetch(`/admin/sellers${suffix}`, {}, cookies, headers)
  },

  listShipments: async (params?: { status?: string }, cookies?: any, headers?: any) => {
    const qs = new URLSearchParams()
    if (params?.status) qs.set('status', params.status)
    const suffix = qs.toString() ? `?${qs}` : ''
    return serverFetch(`/admin/shipments${suffix}`, {}, cookies, headers)
  },

  listVouchers: async (params?: { q?: string; status?: string; type?: string }, cookies?: any, headers?: any) => {
    const qs = new URLSearchParams()
    if (params?.q) qs.set('q', params.q)
    if (params?.status) qs.set('status', params.status)
    if (params?.type) qs.set('type', params.type)
    const suffix = qs.toString() ? `?${qs}` : ''
    return serverFetch(`/admin/vouchers${suffix}`, {}, cookies, headers)
  },

  listComplaints: async (params?: { status?: string }, cookies?: any, headers?: any) => {
    const qs = new URLSearchParams()
    if (params?.status) qs.set('status', params.status)
    const suffix = qs.toString() ? `?${qs}` : ''
    return serverFetch(`/admin/complaints${suffix}`, {}, cookies, headers)
  },

  getComplaint: async (id: string, cookies?: any, headers?: any) => {
    return serverFetch(`/admin/complaints/${id}`, {}, cookies, headers)
  },

  getComplaintMessages: async (id: string, cookies?: any, headers?: any) => {
    return serverFetch(`/admin/complaints/${id}/messages`, {}, cookies, headers)
  },

  addComplaintMessage: async (id: string, payload: { content: string; attachments?: string }, cookies?: any, headers?: any) => {
    return serverFetch(`/admin/complaints/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }, cookies, headers)
  },

  getSystemMetrics: async (cookies?: any, headers?: any) => {
    return serverFetch('/admin/system/metrics', {}, cookies, headers)
  },

  getAdminOverview: async (params?: { startDate?: string; endDate?: string }, cookies?: any, headers?: any) => {
    const qs = new URLSearchParams()
    if (params?.startDate) qs.set('startDate', params.startDate)
    if (params?.endDate) qs.set('endDate', params.endDate)
    const suffix = qs.toString() ? `?${qs}` : ''
    return serverFetch(`/admin/dashboard/overview${suffix}`, {}, cookies, headers)
  },
}


