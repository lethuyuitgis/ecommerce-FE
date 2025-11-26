"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Client } from "@stomp/stompjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { messagesApi, Conversation, Message } from "@/lib/api/messages"
import { useAuth } from "@/contexts/AuthContext"
import { Loader2, MessageSquare, Search, Store, Send } from "lucide-react"
import { toast } from "sonner"
import { subscribeChatMessages } from "@/lib/realtime/chat-events"
import { createStompClient } from "@/lib/realtime/websocket-client"

interface ConversationWithMeta extends Conversation {
  lastMessagePreview?: string
}

interface MessagesClientProps {
  initialConversations: Conversation[]
}

export function MessagesClient({ initialConversations: initialConvs }: MessagesClientProps) {
  const { user, isAuthenticated } = useAuth()
  const [conversations, setConversations] = useState<ConversationWithMeta[]>(initialConvs)
  const [selectedId, setSelectedId] = useState<string | null>(initialConvs.length > 0 ? initialConvs[0].id : null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loadingConversations, setLoadingConversations] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const [draft, setDraft] = useState("")
  const [search, setSearch] = useState("")
  const clientRef = useRef<Client | null>(null)
  const [wsConnected, setWsConnected] = useState(false)

  const loadConversations = useCallback(async () => {
    try {
      setLoadingConversations(true)
      const response = await messagesApi.getCustomerConversations()
      if (response.success && response.data) {
        const list = response.data
        setConversations(list)
        if (!selectedId && list.length > 0) {
          setSelectedId(list[0].id)
        }
      }
    } catch (error: any) {
      console.error("Failed to load conversations", error)
      toast.error(error?.message || "Không thể tải danh sách hội thoại")
    } finally {
      setLoadingConversations(false)
    }
  }, [selectedId])

  useEffect(() => {
    // Only reload if needed (e.g., after sending a message)
    // Initial conversations are already loaded from server
  }, [])

  const fetchMessages = useCallback(
    async (conversationId: string) => {
      try {
        setLoadingMessages(true)
        const response = await messagesApi.getCustomerConversationMessages(conversationId, 0, 100)
        if (response.success && response.data) {
          setMessages(response.data.content.slice().reverse())
        }
      } catch (error: any) {
        console.error("Failed to load messages", error)
        toast.error(error?.message || "Không thể tải tin nhắn")
      } finally {
        setLoadingMessages(false)
      }
    },
    []
  )

  useEffect(() => {
    if (!selectedId || !isAuthenticated) {
      setMessages([])
      return
    }
    fetchMessages(selectedId)
  }, [selectedId, isAuthenticated, fetchMessages])

  useEffect(() => {
    if (!isAuthenticated) {
      if (clientRef.current) {
        clientRef.current.deactivate()
        clientRef.current = null
      }
      setWsConnected(false)
      return
    }

    const client = createStompClient()
    if (!client) {
      return
    }

    client.onConnect = () => {
      setWsConnected(true)
    }
    client.onDisconnect = () => setWsConnected(false)
    client.onStompError = (frame) => {
      console.error("[messages][ws] STOMP error", frame)
    }
    client.onWebSocketError = (event) => {
      if (process.env.NODE_ENV === "development") {
        console.warn("[messages][ws] WebSocket error", event)
      }
    }

    client.activate()
    clientRef.current = client

    return () => {
      setWsConnected(false)
      client.deactivate()
      clientRef.current = null
    }
  }, [isAuthenticated])

  const handleRealtimeIncoming = useCallback(
    (incoming: Message) => {
      if (!incoming?.conversationId) {
        return
      }

      let conversationExists = true
      setConversations((prev) => {
        const idx = prev.findIndex((c) => c.id === incoming.conversationId)
        if (idx === -1) {
          conversationExists = false
          return prev
        }

        const updated = [...prev]
        const next = {
          ...updated[idx],
          lastMessage: incoming.content,
          lastMessageAt: incoming.createdAt,
        }
        updated.splice(idx, 1)
        updated.unshift(next)
        return updated
      })

      if (!conversationExists) {
        loadConversations()
      }

      if (incoming.conversationId === selectedId) {
        setMessages((prev) => {
          if (prev.some((msg) => msg.id === incoming.id)) {
            return prev
          }
          return [...prev, incoming]
        })
      }
    },
    [loadConversations, selectedId]
  )

  useEffect(() => {
    if (!wsConnected || !clientRef.current || !selectedId) {
      return
    }

    const subscription = clientRef.current.subscribe(`/topic/conversations/${selectedId}`, (frame) => {
      try {
        const payload: Message = JSON.parse(frame.body)
        handleRealtimeIncoming(payload)
      } catch (error) {
        console.error("[messages][ws] Failed to parse payload", error)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [wsConnected, selectedId, handleRealtimeIncoming])

  useEffect(() => {
    if (!isAuthenticated) return
    const unsubscribe = subscribeChatMessages((event) => {
      if (!event) return
      loadConversations()
      if (event.conversationId && event.conversationId === selectedId) {
        fetchMessages(event.conversationId)
      }
    })
    return unsubscribe
  }, [isAuthenticated, selectedId, loadConversations, fetchMessages])

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === selectedId) || null,
    [conversations, selectedId]
  )

  const handleSend = async () => {
    if (!activeConversation || !draft.trim()) return
    try {
      setSending(true)
      const response = await messagesApi.sendMessage({
        conversationId: activeConversation.id,
        // Customer endpoint doesn't need recipientId when conversationId is provided
        recipientId: activeConversation.sellerId || "",
        content: draft.trim(),
      })
      if (response.success && response.data) {
        setMessages((prev) => [...prev, response.data])
        setDraft("")
        loadConversations()
      } else {
        toast.error(response.message || "Gửi tin nhắn thất bại")
      }
    } catch (error: any) {
      toast.error(error?.message || "Không thể gửi tin nhắn")
    } finally {
      setSending(false)
    }
  }

  const filteredConversations = conversations.filter((c) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      (c.sellerName || "").toLowerCase().includes(q) ||
      (c.customerName || "").toLowerCase().includes(q) ||
      (c.customerEmail || "").toLowerCase().includes(q) ||
      (c.lastMessage || "").toLowerCase().includes(q)
    )
  })

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold">Vui lòng đăng nhập để sử dụng chat</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-0 rounded-lg border bg-card lg:grid-cols-[320px_1fr]">
      {/* Danh sách hội thoại */}
      <aside className="border-r bg-muted/10 p-4">
        <div className="mb-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm hội thoại theo tên shop, nội dung..."
              className="pl-9"
            />
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-260px)] pr-2">
          {loadingConversations ? (
            <div className="flex h-48 items-center justify-center text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="rounded-lg border bg-background p-6 text-center text-sm text-muted-foreground">
              <MessageSquare className="mx-auto mb-3 h-6 w-6" />
              Chưa có hội thoại nào. Hãy nhắn tin cho shop từ trang sản phẩm hoặc đơn hàng.
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedId(conversation.id)}
                className={cn(
                  "mb-2 w-full rounded-lg border p-3 text-left transition hover:bg-accent",
                  selectedId === conversation.id
                    ? "border-primary bg-primary/5"
                    : "border-transparent bg-background"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                      <Store className="h-4 w-4 text-primary" />
                    </div>
                    <div className="font-semibold text-sm text-foreground line-clamp-1">
                      {conversation.sellerName || "Shop"}
                    </div>
                  </div>
                </div>
                <div className="mt-1 text-xs text-muted-foreground line-clamp-1">
                  {conversation.lastMessage || "Chưa có tin nhắn"}
                </div>
                {conversation.lastMessageAt && (
                  <div className="mt-1 text-[11px] text-muted-foreground">
                    {new Date(conversation.lastMessageAt).toLocaleString("vi-VN")}
                  </div>
                )}
              </button>
            ))
          )}
        </ScrollArea>
      </aside>

      {/* Khung chat */}
      <main className="flex h-full flex-col">
        {activeConversation ? (
          <>
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <p className="text-lg font-semibold">{activeConversation.sellerName || "Shop"}</p>
                {activeConversation.customerEmail && (
                  <p className="text-sm text-muted-foreground">{activeConversation.customerEmail}</p>
                )}
              </div>
            </div>
            <ScrollArea className="flex-1 px-6 py-4">
              {loadingMessages ? (
                <div className="flex h-64 items-center justify-center text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                  Chưa có tin nhắn nào trong hội thoại này.
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isMe = message.senderId === user?.userId
                    return (
                      <div key={message.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                        <div
                          className={cn(
                            "max-w-sm rounded-lg border px-3 py-2 text-sm shadow-sm",
                            isMe ? "bg-primary text-primary-foreground" : "bg-background"
                          )}
                        >
                          <p className="whitespace-pre-line">{message.content}</p>
                          <span className="mt-1 block text-[11px] opacity-70">
                            {new Date(message.createdAt).toLocaleString("vi-VN")}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </ScrollArea>
            <div className="border-t bg-muted/40 px-6 py-4">
              <div className="flex items-end gap-3">
                <Textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  className="min-h-[44px] flex-1 resize-none"
                  rows={2}
                />
                <Button
                  onClick={handleSend}
                  disabled={sending || !draft.trim()}
                  className="h-10 px-4"
                >
                  {sending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Gửi
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-muted-foreground">
            <MessageSquare className="h-10 w-10" />
            <p>Chọn một hội thoại để bắt đầu chat với Shop</p>
          </div>
        )}
      </main>
    </div>
  )
}


