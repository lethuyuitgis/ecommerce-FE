"use client"

import { useState } from "react"
import { MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { messagesApi, CreateMessagePayload } from "@/lib/api/messages"
import { toast } from "sonner"

interface ChatWithShopButtonProps {
  sellerId: string
  sellerName?: string
  productId: string
  productName?: string
}

export function ChatWithShopButton({ sellerId, sellerName, productId, productName }: ChatWithShopButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  const handleOpenChat = async () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    setIsOpen(true)
    
    // Try to load existing conversation messages
    try {
      const conversationsResponse = await messagesApi.getCustomerConversations()
      if (conversationsResponse.success && conversationsResponse.data) {
        // Find conversation with this seller
        const conversation = conversationsResponse.data.find(
          (conv: any) => conv.sellerId === sellerId || conv.customerId === sellerId
        )
        
        if (conversation) {
          const messagesResponse = await messagesApi.getCustomerConversationMessages(conversation.id)
          if (messagesResponse.success && messagesResponse.data) {
            setMessages(messagesResponse.data.content || [])
          }
        }
      }
    } catch (error) {
      // If no conversation exists, start fresh
      console.log('No existing conversation found')
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim() || !isAuthenticated || !user) {
      return
    }

    try {
      setLoading(true)
      const payload: CreateMessagePayload = {
        recipientId: sellerId,
        content: message.trim(),
      }

      // If product context, add product info to message
      if (productName) {
        payload.content = `[Sản phẩm: ${productName}]\n${payload.content}`
      }

      const response = await messagesApi.sendMessage(payload)
      
      if (response.success && response.data) {
        setMessages([...messages, response.data])
        setMessage("")
        toast.success("Đã gửi tin nhắn!")
      }
    } catch (error: any) {
      toast.error(error.message || "Gửi tin nhắn thất bại")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="lg"
        className="w-full border-primary text-primary hover:bg-primary/5"
        onClick={handleOpenChat}
      >
        <MessageCircle className="mr-2 h-5 w-5" />
        Chat với Shop
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl flex flex-col h-[600px]">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{sellerName?.[0] || 'S'}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{sellerName || 'Shop'}</h3>
              <p className="text-sm text-muted-foreground">Đang hoạt động</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Chưa có tin nhắn nào</p>
              <p className="text-sm text-muted-foreground mt-2">
                Hãy gửi tin nhắn để bắt đầu trò chuyện với {sellerName || 'shop'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === user?.userId ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.senderId === user?.userId
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(msg.createdAt).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Nhập tin nhắn..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              disabled={loading}
            />
            <Button onClick={handleSendMessage} disabled={loading || !message.trim()}>
              Gửi
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

