import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { CheckoutClient } from "./checkout-client"
import { serverCartApi, serverUserApi } from "@/lib/api/server"
import { redirect } from "next/navigation"

export default async function CheckoutPage() {
  // Fetch cart and addresses on server
  const [cartResponse, addressesResponse] = await Promise.all([
    serverCartApi.getCart(),
    serverUserApi.getAddresses(),
  ])

  // If not authenticated, redirect to login
  if (!cartResponse.success || !addressesResponse.success) {
    redirect('/login')
  }

  const cartItems = cartResponse.success && cartResponse.data?.items
    ? (Array.isArray(cartResponse.data.items) ? cartResponse.data.items : [])
    : []

  const addresses = addressesResponse.success && addressesResponse.data
    ? (Array.isArray(addressesResponse.data) ? addressesResponse.data : [])
    : []

  if (cartItems.length === 0) {
    redirect('/cart')
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <CheckoutClient cartItems={cartItems} addresses={addresses} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
