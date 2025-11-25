import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { ShippingClient } from "./shipping-client"

export default function ShippingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <ShippingClient />
      </main>
      <Footer />
    </div>
  )
}
