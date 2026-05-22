import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { ShipperAvailableClient } from "@/components/shipper/shipper-available-client"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export default async function ShipperAvailablePage() {
  const cookieStore = await cookies()
  const role = cookieStore.get("role")?.value
  if (role !== "SHIPPER" && role !== "ADMIN") {
    redirect("/shipper/register")
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <h1 className="mb-6 text-2xl font-bold text-foreground">Đơn có sẵn</h1>
          <ShipperAvailableClient />
        </div>
      </main>
      <Footer />
    </div>
  )
}
