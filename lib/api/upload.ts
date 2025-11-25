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
    const { apiClientFormData } = await import('./client')
    const formData = new FormData()
    formData.append('file', file)
    return apiClientFormData<UploadedFile>('/upload/excel', formData)
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
    const { apiClientBlob } = await import('./client-blob')
    const { blob } = await apiClientBlob(`/upload/excel/${encodeURIComponent(fileName)}`)
    return blob
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
