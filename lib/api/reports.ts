export interface ExportReportRequest {
  type: 'EXCEL' | 'PDF'
  period?: '7days' | '30days' | '90days' | 'year' | 'custom'
  startDate?: string
  endDate?: string
  reportType?: 'revenue' | 'orders' | 'products' | 'customers' | 'all'
}

export const reportsApi = {
  exportReport: async (request: ExportReportRequest): Promise<Blob> => {
    const apiBaseUrl = typeof window !== 'undefined' ? '/api' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api')
    
    const headers: HeadersInit = {}
    
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      const userId = localStorage.getItem('userId')
      if (userId) {
        headers['X-User-Id'] = userId
      }
    }

    // Build query parameters
    const params = new URLSearchParams()
    params.append('type', request.type)
    if (request.period) {
      params.append('period', request.period)
    }
    if (request.startDate) {
      params.append('startDate', request.startDate)
    }
    if (request.endDate) {
      params.append('endDate', request.endDate)
    }
    if (request.reportType) {
      params.append('reportType', request.reportType)
    }

    const response = await fetch(`${apiBaseUrl}/seller/reports/export?${params.toString()}`, {
      method: 'POST',
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = 'Failed to export report'
      try {
        const error = JSON.parse(errorText)
        errorMessage = error.message || errorMessage
      } catch {
        errorMessage = errorText || errorMessage
      }
      throw new Error(errorMessage)
    }

    return response.blob()
  },
}

