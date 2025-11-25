import { MessagesClient } from "./messages-client"
import { serverSellerApi } from "@/lib/api/server"
import { cookies, headers } from "next/headers"
import { Conversation } from "@/lib/api/messages"

export default async function SellerMessagesPage() {
  const cookieStore = await cookies()
  const headersList = await headers()
  
  // Fetch initial conversations on server
  const conversationsResponse = await serverSellerApi.getConversations(cookieStore, headersList)
  
  const initialConversations: Conversation[] = conversationsResponse.success && conversationsResponse.data
    ? (Array.isArray(conversationsResponse.data) ? conversationsResponse.data : [])
    : []

  return <MessagesClient initialConversations={initialConversations} />
}
