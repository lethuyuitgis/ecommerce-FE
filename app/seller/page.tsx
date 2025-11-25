import { SellerDashboardClient } from "@/components/seller/seller-dashboard-client"
import { serverSellerApi, serverOrdersApi } from "@/lib/api/server"
import { redirect } from "next/navigation"

export default async function SellerPage() {
  // Check seller profile and fetch data on server
  const [profileResponse, overviewResponse, ordersResponse] = await Promise.all([
    serverSellerApi.getProfile(),
    serverSellerApi.getOverview(),
    serverSellerApi.getOrders(0, 5),
  ])
  
  // If no seller profile, redirect to onboarding
  if (!profileResponse.success || !profileResponse.data) {
    redirect('/seller/onboarding')
  }

  const overview = overviewResponse.success ? overviewResponse.data : null
  const orders = ordersResponse.success && ordersResponse.data?.content 
    ? ordersResponse.data.content 
    : []

  return (
    <SellerDashboardClient 
      initialOverview={overview}
      initialOrders={orders}
    />
  )
}
