import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { TrackingClient } from "./tracking-client"

export default function TrackingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <TrackingClient />
      </main>
      <Footer />
    </div>
  )
}
