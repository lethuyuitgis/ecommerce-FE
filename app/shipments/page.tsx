import { ShipmentsClient } from "./shipments-client"
import { serverShipperApi, serverUserApi } from "@/lib/api/server"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function ShipmentsPage({
  searchParams,
}: {
  searchParams?: { status?: string }
}) {
  const cookieStore = await cookies()
  const headersList = await headers()
  
  // Check authentication
  const profileResponse = await serverUserApi.getProfile(cookieStore, headersList)
  if (!profileResponse.success || !profileResponse.data) {
    redirect('/login?redirect=/shipments')
  }

  const user = profileResponse.data as any
  if (user?.userType !== 'SHIPPER') {
    redirect('/')
  }

  const statusFilter = searchParams?.status || 'all'
  
  // Fetch shipments on server
  const shipmentsResponse = await serverShipperApi.getMyShipments(
    statusFilter !== 'all' ? statusFilter : undefined,
    cookieStore,
    headersList
  )
  
  let shipments: any[] = []
  
  if (shipmentsResponse.success && shipmentsResponse.data) {
    shipments = shipmentsResponse.data
  }

  return (
    <ShipmentsClient 
      initialShipments={shipments}
      initialStatusFilter={statusFilter}
    />
  )
}


