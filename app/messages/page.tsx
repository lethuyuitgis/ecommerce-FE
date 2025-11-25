import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { MessagesClient } from "./messages-client"
import { serverMessagesApi } from "@/lib/api/server"
import { cookies, headers } from "next/headers"
import { Conversation } from "@/lib/api/messages"
import { redirect } from "next/navigation"

export default async function MessagesPage() {
  const cookieStore = await cookies()
  const headersList = await headers()
  
  // Fetch initial conversations on server
  const conversationsResponse = await serverMessagesApi.getCustomerConversations(cookieStore, headersList)
  
  // If not authenticated, redirect to login
  if (!conversationsResponse.success) {
    redirect('/login?redirect=/messages')
  }
  
  const initialConversations: Conversation[] = conversationsResponse.data
    ? (Array.isArray(conversationsResponse.data) ? conversationsResponse.data : [])
    : []

  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">Tin nhắn</h1>
            <p className="text-sm text-muted-foreground">
              Trao đổi với Shop về đơn hàng và sản phẩm của bạn
            </p>
          </div>
          <MessagesClient initialConversations={initialConversations} />
        </div>
      </main>
      <Footer />
    </div>
  )
}

