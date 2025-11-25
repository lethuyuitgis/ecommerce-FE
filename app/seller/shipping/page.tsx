import { ShippingClient } from "./shipping-client"
import { serverSellerApi } from "@/lib/api/server"
import { redirect } from "next/navigation"
import { cookies, headers } from "next/headers"

export default async function SellerShippingPage() {
  const cookieStore = await cookies()
  const headersList = await headers()
  
  // Fetch seller orders to calculate stats
  const ordersResponse = await serverSellerApi.getOrders(0, 1000, {}, cookieStore, headersList)
  
  if (!ordersResponse.success) {
    redirect('/seller')
  }

  const orders = ordersResponse.data?.content || []
  
  // Calculate stats from orders
  const stats = {
    pending: orders.filter((o: any) => o.shippingStatus === 'PENDING').length,
    shipping: orders.filter((o: any) => o.shippingStatus === 'IN_TRANSIT' || o.shippingStatus === 'PICKED_UP').length,
    delivered: orders.filter((o: any) => o.shippingStatus === 'DELIVERED').length,
    failed: orders.filter((o: any) => o.shippingStatus === 'FAILED').length,
  }

  // Shipments will be fetched on client side when needed
  return (
    <ShippingClient 
      initialShipments={[]}
      initialStats={stats}
    />
  )
}
