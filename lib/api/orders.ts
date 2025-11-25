import { apiClient, ApiResponse } from './client'

export interface OrderItem {
  id: string
  productId: string
  productName: string
  variantId?: string
  variantName?: string
  quantity: number
  unitPrice?: number
  productPrice: number
  variantPrice?: number
  totalPrice: number
  productImage?: string
}

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  customerName: string
  sellerId: string
  sellerName: string
  status: string
  paymentStatus: string
  shippingStatus: string
  totalPrice: number
  subtotal: number
  discountAmount: number
  shippingFee: number
  tax: number
  finalTotal: number
  paymentMethod: string
  notes?: string
  customerNotes?: string
  createdAt: string
  items: OrderItem[]
}

export interface CreateOrderRequest {
  items: Array<{
    productId: string
    variantId?: string
    quantity: number
  }>
  shippingAddressId: string
  paymentMethod: string
  voucherCode?: string
  notes?: string
}

export interface OrderPage {
  content: Order[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export const ordersApi = {
  createOrder: async (data: CreateOrderRequest): Promise<ApiResponse<Order>> => {
    return apiClient<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  getOrders: async (page: number = 0, size: number = 20): Promise<ApiResponse<OrderPage>> => {
    return apiClient<OrderPage>(`/orders?page=${page}&size=${size}`)
  },

  getOrderById: async (orderId: string): Promise<ApiResponse<Order>> => {
    return apiClient<Order>(`/orders/${orderId}`)
  },

  getSellerOrders: async (page: number = 0, size: number = 20, status?: string): Promise<ApiResponse<OrderPage>> => {
    // Seller orders are filtered from user orders by sellerId
    let url = `/orders?page=${page}&size=${size}`
    if (status && status !== 'all') {
      url += `&status=${status.toUpperCase()}`
    }
    return apiClient<OrderPage>(url)
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<ApiResponse<Order>> => {
    return apiClient<Order>(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  },

  checkPurchase: async (productId: string): Promise<ApiResponse<PurchaseStatus>> => {
    return apiClient<PurchaseStatus>(`/orders/check-purchase/${productId}`)
  },
}

export interface PurchaseStatus {
  hasPurchased: boolean
  orderItemId?: string
  orderId?: string
  orderNumber?: string
}
