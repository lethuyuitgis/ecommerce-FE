import { apiClient, getAuthHeaders, ApiResponse } from "./client"
import type { SellerReportSummary } from "./admin"

export interface ExportReportRequest {
  type: 'EXCEL' | 'PDF'
  period?: '7days' | '30days' | '90days' | 'year' | 'custom'
  startDate?: string
  endDate?: string
  reportType?: 'revenue' | 'orders' | 'products' | 'customers' | 'all'
}

export const reportsApi = {
  exportReport: async (request: ExportReportRequest): Promise<{ blob: Blob; filename: string }> => {
    const { apiClientFormDataBlob } = await import('./client-blob')
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

    // Create empty FormData for POST request
    const formData = new FormData()
    const { blob, headers } = await apiClientFormDataBlob(`/seller/reports/export?${params.toString()}`, formData)
    
    // Try to get filename from Content-Disposition header
    let filename = `bao-cao-${request.period || 'custom'}-${new Date().toISOString().split('T')[0]}.${request.type === 'PDF' ? 'pdf' : 'xlsx'}`
    const disposition = headers.get('Content-Disposition') || headers.get('content-disposition')
    if (disposition) {
      const match = disposition.match(/filename=\"?([^\";]+)\"?/)
      if (match?.[1]) {
        filename = match[1]
      }
    }
    
    return { blob, filename }
  },
  getSummary: async (params?: { period?: string; startDate?: string; endDate?: string; reportType?: string }): Promise<ApiResponse<SellerReportSummary>> => {
    const qs = new URLSearchParams()
    if (params?.period) qs.set('period', params.period)
    if (params?.startDate) qs.set('startDate', params.startDate)
    if (params?.endDate) qs.set('endDate', params.endDate)
    if (params?.reportType) qs.set('reportType', params.reportType)
    return apiClient(`/seller/reports/summary${qs.toString() ? `?${qs}` : ''}`, {}, true)
  },
}

export type { SellerReportSummary } from "./admin"

