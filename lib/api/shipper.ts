import { apiClient, ApiResponse } from './client'
import { Order, OrderPage } from './orders'

export interface Shipment {
  id: string
  orderId: string
  orderNumber: string
  trackingNumber: string
  shippingMethod: string
  shippingPartner: string
  status: string
  recipientName: string
  recipientPhone: string
  recipientAddress: string
  recipientProvince: string
  recipientDistrict: string
  recipientWard: string
  weight: number
  shippingFee: number
  expectedDeliveryDate?: string
  actualDeliveryDate?: string
  createdAt: string
  updatedAt: string
}

export interface TrackingUpdate {
  id: string
  shipmentId: string
  status: string
  location: string
  description: string
  timestamp: string
}

export interface UpdateShippingStatusRequest {
  status: string
  location?: string
  description?: string
  failureReason?: string
}

export interface AdminShipmentDTO {
  id: string
  orderId: string
  sellerId?: string
  shipperId?: string
  trackingNumber?: string
  status: string
  pickupAddress?: {
    name?: string
    phone?: string
    address?: string
    province?: string
    district?: string
    ward?: string
  }
  deliveryAddress?: {
    name?: string
    phone?: string
    address?: string
    province?: string
    district?: string
    ward?: string
  }
  packageWeight?: number
  packageSize?: string
  codAmount?: number
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export const shipperApi = {
  // Đăng ký làm shipper
  register: async (): Promise<ApiResponse<string>> => {
    return apiClient<string>(`/shipper/register`, {
      method: 'POST',
    })
  },

  // Kiểm tra trạng thái phê duyệt
  getApprovalStatus: async (): Promise<ApiResponse<string>> => {
    return apiClient<string>(`/shipper/status`)
  },

  // Lấy danh sách shipments được điều phối cho shipper
  getMyShipments: async (
    status?: string
  ): Promise<ApiResponse<AdminShipmentDTO[]>> => {
    let url = `/shipper/shipments`
    if (status && status !== 'all') {
      url += `?status=${status}`
    }
    return apiClient<AdminShipmentDTO[]>(url)
  },

  // Cập nhật trạng thái shipment
  updateShipmentStatus: async (
    shipmentId: string,
    status: string
  ): Promise<ApiResponse<string>> => {
    return apiClient<string>(`/shipper/shipments/${shipmentId}/status?status=${status}`, {
      method: 'PUT',
    })
  },

  // Lấy danh sách đơn hàng cần vận chuyển
  getOrdersToShip: async (
    page: number = 0,
    size: number = 20,
    status?: string
  ): Promise<ApiResponse<OrderPage>> => {
    let url = `/shipper/orders?page=${page}&size=${size}`
    if (status && status !== 'all') {
      url += `&status=${status}`
    }
    return apiClient<OrderPage>(url)
  },

  // Lấy chi tiết đơn hàng
  getOrderDetail: async (orderId: string): Promise<ApiResponse<Order>> => {
    // Dùng endpoint orders thông thường
    return apiClient<Order>(`/orders/${orderId}`)
  },

  // Cập nhật trạng thái vận chuyển (deprecated - dùng updateShipmentStatus thay thế)
  updateShippingStatus: async (
    orderId: string,
    data: UpdateShippingStatusRequest
  ): Promise<ApiResponse<Order>> => {
    // Map shipping status to order status
    const statusMap: Record<string, string> = {
      'PICKED_UP': 'SHIPPING',
      'IN_TRANSIT': 'SHIPPING',
      'OUT_FOR_DELIVERY': 'SHIPPING',
      'DELIVERED': 'COMPLETED',
      'FAILED': 'CANCELLED',
    }
    
    const orderStatus = statusMap[data.status] || data.status
    
    // Update order status
    const response = await apiClient<Order>(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: orderStatus }),
    })
    
    return response
  },

  // Lấy thông tin tracking
  getTrackingInfo: async (trackingNumber: string): Promise<ApiResponse<{
    shipment: Shipment
    updates: TrackingUpdate[]
  }>> => {
    return apiClient<{ shipment: Shipment; updates: TrackingUpdate[] }>(
      `/shipments/tracking/${encodeURIComponent(trackingNumber)}`,
      {},
      true,
    )
  },

  // Tìm kiếm đơn hàng
  searchOrder: async (query: string): Promise<ApiResponse<Order[]>> => {
    // Tạm thời lấy tất cả orders và filter client-side
    const response = await apiClient<OrderPage>(`/orders?page=0&size=100`)
    
    if (response.success && response.data) {
      const orders = response.data.content || []
      const filtered = orders.filter(order => 
        order.orderNumber.toLowerCase().includes(query.toLowerCase()) ||
        order.customerName.toLowerCase().includes(query.toLowerCase()) ||
        (order.shippingStatus || order.status || '').toLowerCase().includes(query.toLowerCase())
      )
      
      return {
        ...response,
        data: filtered,
      }
    }
    
    return {
      success: false,
      message: 'Search failed',
      data: [],
    }
  },
}

