import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { ShipperRegisterClient } from "./shipper-register-client"

export default function ShipperRegisterPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-muted/30">
        <ShipperRegisterClient />
      </main>
      <Footer />
    </div>
  )
}




