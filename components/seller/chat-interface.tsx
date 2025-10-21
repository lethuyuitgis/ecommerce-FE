"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Send, Paperclip, MoreVertical, Phone, Video } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const conversations = [
  {
    id: "1",
    customer: "Nguyễn Văn A",
    avatar: "/placeholder.svg",
    lastMessage: "Sản phẩm còn hàng không ạ?",
    time: "2 phút trước",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    customer: "Trần Thị B",
    avatar: "/placeholder.svg",
    lastMessage: "Cảm ơn shop nhiều!",
    time: "15 phút trước",
    unread: 0,
    online: false,
  },
  {
    id: "3",
    customer: "Lê Văn C",
    avatar: "/placeholder.svg",
    lastMessage: "Khi nào giao hàng vậy shop?",
    time: "1 giờ trước",
    unread: 1,
    online: true,
  },
]

const messages = [
  {
    id: "1",
    sender: "customer",
    content: "Chào shop, em muốn hỏi về sản phẩm iPhone 15 Pro Max",
    time: "10:30",
  },
  {
    id: "2",
    sender: "seller",
    content: "Chào bạn! Shop có sẵn hàng ạ. Bạn muốn tư vấn thêm gì không?",
    time: "10:31",
  },
  {
    id: "3",
    sender: "customer",
    content: "Sản phẩm có bảo hành không ạ?",
    time: "10:32",
  },
  {
    id: "4",
    sender: "seller",
    content: "Có ạ, sản phẩm được bảo hành chính hãng 12 tháng tại các trung tâm bảo hành Apple toàn quốc",
    time: "10:32",
  },
  {
    id: "5",
    sender: "customer",
    content: "Sản phẩm còn hàng không ạ?",
    time: "10:35",
  },
]

export function ChatInterface() {
  const [selectedChat, setSelectedChat] = useState(conversations[0])
  const [message, setMessage] = useState("")

  return (
    <div className="flex h-screen">
      {/* Conversations List */}
      <div className="w-80 border-r bg-card flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold mb-3">Tin nhắn</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Tìm kiếm khách hàng..." className="pl-9" />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedChat(conv)}
                className={`w-full p-3 rounded-lg flex items-start gap-3 hover:bg-accent/50 transition-colors ${
                  selectedChat.id === conv.id ? "bg-accent" : ""
                }`}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={conv.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{conv.customer[0]}</AvatarFallback>
                  </Avatar>
                  {conv.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{conv.customer}</span>
                    <span className="text-xs text-muted-foreground">{conv.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground line-clamp-1">{conv.lastMessage}</p>
                    {conv.unread > 0 && (
                      <Badge variant="default" className="ml-2 h-5 min-w-5 px-1.5">
                        {conv.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b bg-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar>
                <AvatarImage src={selectedChat.avatar || "/placeholder.svg"} />
                <AvatarFallback>{selectedChat.customer[0]}</AvatarFallback>
              </Avatar>
              {selectedChat.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
              )}
            </div>
            <div>
              <h3 className="font-semibold">{selectedChat.customer}</h3>
              <p className="text-sm text-muted-foreground">{selectedChat.online ? "Đang hoạt động" : "Offline"}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "seller" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    msg.sender === "seller" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t bg-card">
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Input
              placeholder="Nhập tin nhắn..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  console.log("[v0] Sending message:", message)
                  setMessage("")
                }
              }}
            />
            <Button>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
