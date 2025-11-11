import { ChatInterface } from "@/components/seller/chat-interface"
import { SellerSidebar } from "@/components/seller/seller-sidebar"

export default function MessagesPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <SellerSidebar />
      <div className="flex-1">
        <ChatInterface />
      </div>
    </div>
  )
}
