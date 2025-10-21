import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { ProfileSidebar } from "@/components/profile/profile-sidebar"
import { OrdersList } from "@/components/orders/orders-list"

export default function OrdersPage() {
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
              <OrdersList />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
