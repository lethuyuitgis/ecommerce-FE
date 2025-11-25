import { OrderDetailClient } from "./order-detail-client"
import { serverSellerApi } from "@/lib/api/server"
import { notFound } from "next/navigation"
import { SellerSidebar } from "@/components/seller/seller-sidebar"
import { cookies, headers } from "next/headers"

export default async function OrderDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> | { id: string } 
}) {
  const resolvedParams = params instanceof Promise ? await params : params
  const cookieStore = await cookies()
  const headersList = await headers()
  
  // Fetch order on server with authentication
  const orderResponse = await serverSellerApi.getOrderById(resolvedParams.id, cookieStore, headersList)
  
  if (!orderResponse.success || !orderResponse.data) {
    notFound()
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SellerSidebar />
      <div className="flex-1">
        <OrderDetailClient initialOrder={orderResponse.data} />
      </div>
    </div>
  )
}
