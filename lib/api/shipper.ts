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
  // Lấy danh sách shipments được điều phối cho shipper
  getMyShipments: async (
    status?: string
  ): Promise<ApiResponse<AdminShipmentDTO[]>> => {
    let url = `/shipments/my-shipments`
    if (status && status !== 'all') {
      url += `?status=${status}`
    }
    return apiClient<AdminShipmentDTO[]>(url)
  },

  // Cập nhật trạng thái shipment
  updateShipmentStatus: async (
    shipmentId: string,
    status: string
  ): Promise<ApiResponse<AdminShipmentDTO>> => {
    return apiClient<AdminShipmentDTO>(`/shipments/${shipmentId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  },

  // Lấy danh sách đơn hàng cần vận chuyển (deprecated - dùng getMyShipments thay thế)
  getOrdersToShip: async (
    page: number = 0,
    size: number = 20,
    status?: string
  ): Promise<ApiResponse<OrderPage>> => {
    // Dùng endpoint orders thông thường, filter sẽ được xử lý ở frontend
    let url = `/orders?page=${page}&size=${size * 2}` // Lấy nhiều hơn để filter
    const response = await apiClient<OrderPage>(url)
    
    if (response.success && response.data) {
      // Filter orders có shipping status phù hợp
      let filteredOrders = response.data.content || []
      
      // Filter theo shipping status nếu có
      if (status && status !== 'all') {
        const statusMap: Record<string, string[]> = {
          'pending': ['PENDING', 'pending'],
          'picked_up': ['PICKED_UP', 'picked_up', 'PICKED UP'],
          'in_transit': ['IN_TRANSIT', 'in_transit', 'IN TRANSIT'],
          'out_for_delivery': ['OUT_FOR_DELIVERY', 'out_for_delivery', 'OUT FOR DELIVERY'],
          'delivered': ['DELIVERED', 'delivered'],
          'failed': ['FAILED', 'failed'],
        }
        
        const targetStatuses = statusMap[status.toLowerCase()] || [status]
        filteredOrders = filteredOrders.filter(order => {
          const shippingStatus = (order.shippingStatus || order.status || '').toUpperCase()
          return targetStatuses.some(s => shippingStatus.includes(s.toUpperCase()))
        })
      } else {
        // Chỉ lấy orders có shipping status (không phải cancelled)
        filteredOrders = filteredOrders.filter(order => {
          const shippingStatus = (order.shippingStatus || order.status || '').toUpperCase()
          return !shippingStatus.includes('CANCELLED') && 
                 (shippingStatus.includes('PENDING') || 
                  shippingStatus.includes('PICKED') || 
                  shippingStatus.includes('TRANSIT') || 
                  shippingStatus.includes('DELIVERY') || 
                  shippingStatus.includes('DELIVERED') ||
                  shippingStatus.includes('FAILED'))
        })
      }
      
      // Pagination
      const start = page * size
      const end = start + size
      const paginatedOrders = filteredOrders.slice(start, end)
      
      return {
        ...response,
        data: {
          ...response.data,
          content: paginatedOrders,
          totalElements: filteredOrders.length,
          totalPages: Math.ceil(filteredOrders.length / size),
          number: page,
          size: size,
        }
      }
    }
    
    return response
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
    // TODO: Backend cần tạo endpoint này
    // Tạm thời trả về empty
    return {
      success: false,
      message: 'Tracking endpoint not implemented yet',
      data: null as any,
    }
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

