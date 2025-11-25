import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { ProfileSidebar } from "@/components/profile/profile-sidebar"
import { OrdersList } from "@/components/orders/orders-list"
import { serverOrdersApi } from "@/lib/api/server"
import { redirect } from "next/navigation"

export default async function OrdersPage() {
  // Fetch orders on server
  const ordersResponse = await serverOrdersApi.getOrders(0, 100)
  
  // If not authenticated, redirect to login
  if (!ordersResponse.success) {
    redirect('/login')
  }

  const orders = ordersResponse.success && ordersResponse.data?.content
    ? ordersResponse.data.content
    : []

  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="grid gap-6 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <ProfileSidebar />
            </div>
            <div className="lg:col-span-3">
              <OrdersList initialOrders={orders} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
