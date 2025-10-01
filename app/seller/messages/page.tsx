import { SellerSidebar } from "@/components/seller-sidebar"
import { ChatInterface } from "@/components/chat-interface"

export default function MessagesPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <SellerSidebar />
      <div className="flex-1 lg:ml-64">
        <ChatInterface />
      </div>
    </div>
  )
}
