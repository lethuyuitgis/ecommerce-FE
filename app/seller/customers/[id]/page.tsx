import { CustomerDetailClient } from "./customer-detail-client"
import { serverSellerApi } from "@/lib/api/server"
import { notFound } from "next/navigation"
import { SellerSidebar } from "@/components/seller/seller-sidebar"
import { cookies, headers } from "next/headers"

export default async function CustomerDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> | { id: string } 
}) {
  const resolvedParams = params instanceof Promise ? await params : params
  const cookieStore = await cookies()
  const headersList = await headers()
  
  // Fetch customer detail on server with authentication
  const customerResponse = await serverSellerApi.getCustomerDetail(resolvedParams.id, cookieStore, headersList)
  
  if (!customerResponse.success || !customerResponse.data) {
    notFound()
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SellerSidebar />
      <div className="flex-1 p-6 lg:p-8">
        <CustomerDetailClient initialCustomer={customerResponse.data} />
      </div>
    </div>
  )
}
