import { ShipClient } from "./ship-client"
import { serverShipperApi, serverUserApi } from "@/lib/api/server"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { Order } from "@/lib/api/orders"

export default async function ShipDashboardPage({
  searchParams,
}: {
  searchParams?: { status?: string; page?: string }
}) {
  const cookieStore = await cookies()
  const headersList = await headers()
  
  // Check authentication
  const profileResponse = await serverUserApi.getProfile(cookieStore, headersList)
  if (!profileResponse.success || !profileResponse.data) {
    redirect('/login?redirect=/ship')
  }

  const user = profileResponse.data as any
  if (user?.userType !== 'SHIPPER') {
    redirect('/')
  }

  const statusFilter = searchParams?.status || 'all'
  const page = parseInt(searchParams?.page || '0', 10)
  
  // Fetch orders on server
  const ordersResponse = await serverShipperApi.getOrdersToShip(page, 20, statusFilter !== 'all' ? statusFilter : undefined, cookieStore, headersList)
  
  // Filter orders on server side (similar to client-side logic)
  let orders: Order[] = []
  let totalPages = 0
  
  if (ordersResponse.success && ordersResponse.data?.content) {
    let filteredOrders = ordersResponse.data.content
    
    // Filter by shipping status
    if (statusFilter !== 'all') {
      const statusMap: Record<string, string[]> = {
        'pending': ['PENDING', 'pending'],
        'picked_up': ['PICKED_UP', 'picked_up', 'PICKED UP'],
        'in_transit': ['IN_TRANSIT', 'in_transit', 'IN TRANSIT'],
        'out_for_delivery': ['OUT_FOR_DELIVERY', 'out_for_delivery', 'OUT FOR DELIVERY'],
        'delivered': ['DELIVERED', 'delivered'],
        'failed': ['FAILED', 'failed'],
      }
      
      const targetStatuses = statusMap[statusFilter.toLowerCase()] || [statusFilter]
      filteredOrders = filteredOrders.filter(order => {
        const shippingStatus = (order.shippingStatus || order.status || '').toUpperCase()
        return targetStatuses.some(s => shippingStatus.includes(s.toUpperCase()))
      })
    } else {
      // Only get orders with shipping status
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
    
    orders = filteredOrders
    totalPages = Math.ceil(filteredOrders.length / 20)
  }

  return (
    <ShipClient 
      initialOrders={orders}
      initialTotalPages={totalPages}
      initialStatusFilter={statusFilter}
      initialPage={page}
    />
  )
}
