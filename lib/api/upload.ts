import { apiClient, ApiResponse } from './client'

export interface UploadedFile {
  fileName: string
  originalName: string
  filePath: string
  fileUrl: string
  size: number
  mimeType: string
  uploadedAt: string
  userId: string | null
}

export interface FileListItem {
  fileName: string
  fileUrl: string
  size: number
  uploadedAt: string
  modifiedAt: string
}

export interface FileListResponse {
  files: FileListItem[]
  total: number
  limit: number
  offset: number
}

export const uploadApi = {
  /**
   * Upload Excel file
   */
  uploadExcel: async (file: File): Promise<ApiResponse<UploadedFile>> => {
    const formData = new FormData()
    formData.append('file', file)
    
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

    const apiBaseUrl = typeof window !== 'undefined' ? '/api' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api')
    
    const response = await fetch(`${apiBaseUrl}/upload/excel`, {
      method: 'POST',
      headers,
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to upload file')
    }

    return data
  },

  /**
   * List uploaded Excel files
   */
  listExcelFiles: async (limit: number = 50, offset: number = 0): Promise<ApiResponse<FileListResponse>> => {
    return apiClient<FileListResponse>(`/upload/excel/list?limit=${limit}&offset=${offset}`)
  },

  /**
   * Download Excel file
   */
  downloadExcel: async (fileName: string): Promise<Blob> => {
    const headers: HeadersInit = {}
    
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    const apiBaseUrl = typeof window !== 'undefined' ? '/api' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api')
    
    const response = await fetch(`${apiBaseUrl}/upload/excel/${encodeURIComponent(fileName)}`, {
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to download file' }))
      throw new Error(error.message || 'Failed to download file')
    }

    return response.blob()
  },

  /**
   * Delete Excel file
   */
  deleteExcel: async (fileName: string): Promise<ApiResponse<void>> => {
    return apiClient<void>(`/upload/excel/${encodeURIComponent(fileName)}`, {
      method: 'DELETE',
    })
  },
}
