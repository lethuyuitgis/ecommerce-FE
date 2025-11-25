"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import { SellerSidebar } from "@/components/seller/seller-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { messagesApi, Conversation, Message } from "@/lib/api/messages"
import { sellerCustomersApi, SellerCustomer } from "@/lib/api/customers"
import { useAuth } from "@/contexts/AuthContext"
import { Loader2, MessageSquare, Search, Send, Users } from "lucide-react"
import { toast } from "sonner"
import { subscribeChatMessages } from "@/lib/realtime/chat-events"

const DebouncedInput = dynamic(() => import("@/components/shared/debounced-input"), { ssr: false, loading: () => <Input disabled placeholder="Đang tải..." /> })

interface ConversationWithMeta extends Conversation {
  lastMessagePreview?: string
}

interface MessagesClientProps {
  initialConversations: Conversation[]
}

export function MessagesClient({ initialConversations: initialConvs }: MessagesClientProps) {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<ConversationWithMeta[]>(initialConvs)
  const [selectedId, setSelectedId] = useState<string | null>(initialConvs.length > 0 ? initialConvs[0].id : null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loadingConversations, setLoadingConversations] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const [draft, setDraft] = useState("")
  const [customerSearch, setCustomerSearch] = useState("")
  const [suggestedCustomers, setSuggestedCustomers] = useState<SellerCustomer[]>([])
  const [fetchingCustomers, setFetchingCustomers] = useState(false)

  const loadConversations = useCallback(async () => {
    try {
      setLoadingConversations(true)
      const response = await messagesApi.getConversations()
      console.log('[MessagesClient] Load conversations response:', response)
      if (response.success && response.data) {
        console.log('[MessagesClient] Loaded conversations:', response.data.length)
        setConversations(response.data)
        if (!selectedId && response.data.length > 0) {
          setSelectedId(response.data[0].id)
        }
      } else {
        console.error('[MessagesClient] Failed to load conversations:', response.message)
        toast.error(response.message || 'Không thể tải danh sách hội thoại')
      }
    } catch (error: any) {
      console.error('[MessagesClient] Error loading conversations:', error)
      toast.error(error?.message || 'Lỗi khi tải danh sách hội thoại')
    } finally {
      setLoadingConversations(false)
    }
  }, [selectedId])

  useEffect(() => {
    // Only reload if needed (e.g., after sending a message)
    // Initial conversations are already loaded from server
  }, [])

  useEffect(() => {
    if (!customerSearch) {
      setSuggestedCustomers([])
      return
    }
    setFetchingCustomers(true)
    const timer = setTimeout(async () => {
      const res = await sellerCustomersApi.list(customerSearch, 0, 5)
      if (res.success && res.data) {
        setSuggestedCustomers(res.data.content)
      }
      setFetchingCustomers(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [customerSearch])

  const fetchMessages = useCallback(
    async (conversationId: string) => {
      try {
        setLoadingMessages(true)
        const response = await messagesApi.getConversationMessages(conversationId, 0, 100)
        if (response.success && response.data) {
          setMessages(response.data.content.slice().reverse())
        }
      } finally {
        setLoadingMessages(false)
      }
    },
    []
  )

  useEffect(() => {
    if (!selectedId) {
      setMessages([])
      return
    }
    fetchMessages(selectedId)
  }, [selectedId, fetchMessages])

  useEffect(() => {
    const unsubscribe = subscribeChatMessages((event) => {
      if (!event) return
      loadConversations()
      if (event.conversationId && event.conversationId === selectedId) {
        fetchMessages(event.conversationId)
      }
    })
    return unsubscribe
  }, [selectedId, loadConversations, fetchMessages])

  const activeConversation = useMemo(() => conversations.find((c) => c.id === selectedId) || null, [conversations, selectedId])

  const handleSend = async () => {
    if (!activeConversation || !draft.trim()) return
    try {
      setSending(true)
      const response = await messagesApi.sendMessage({
        conversationId: activeConversation.id,
        recipientId: activeConversation.customerId,
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
      toast.error(error.message || "Không thể gửi tin nhắn")
    } finally {
      setSending(false)
    }
  }

  const handleStartConversation = async (customer: SellerCustomer) => {
    if (!customer.customerId || !customer.fullName) return
    try {
      setCustomerSearch("")
      const response = await messagesApi.sendMessage({
        recipientId: customer.customerId,
        content: "Xin chào! Hỗ trợ bạn vấn đề gì?",
      })
      if (response.success && response.data) {
        toast.success(`Đã tạo hội thoại với ${customer.fullName}`)
        setDraft("")
        await loadConversations()
        setSelectedId(response.data.conversationId)
        setMessages([response.data])
      }
    } catch (error: any) {
      toast.error(error.message || "Không thể mở hội thoại")
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SellerSidebar />
      <div className="flex-1">
        <div className="grid h-full gap-0 p-0 lg:grid-cols-[320px_1fr]">
          <aside className="border-r bg-muted/20 p-4">
            <div className="mb-4 space-y-3">
              <h1 className="text-2xl font-bold">Tin nhắn</h1>
              <p className="text-sm text-muted-foreground">Trao đổi trực tiếp với khách hàng</p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="Tìm khách hàng để nhắn tin"
                  className="pl-9"
                />
              </div>
              {customerSearch && (
                <div className="rounded-md border bg-background shadow-sm">
                  {fetchingCustomers ? (
                    <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" /> Đang tìm...
                    </div>
                  ) : suggestedCustomers.length === 0 ? (
                    <div className="px-4 py-2 text-sm text-muted-foreground">Không tìm thấy khách hàng</div>
                  ) : (
                    suggestedCustomers.map((customer) => (
                      <button
                        key={customer.customerId}
                        onClick={() => handleStartConversation(customer)}
                        className="flex w-full items-center justify-between px-4 py-2 text-left text-sm hover:bg-accent"
                      >
                        <span>
                          {customer.fullName || 'Khách hàng'}
                          {customer.email && <span className="ml-1 text-xs text-muted-foreground">({customer.email})</span>}
                        </span>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            <ScrollArea className="h-[calc(100vh-200px)] pr-2">
              {loadingConversations ? (
                <div className="flex h-48 items-center justify-center text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="rounded-lg border bg-background p-6 text-center text-sm text-muted-foreground">
                  <MessageSquare className="mx-auto mb-3 h-6 w-6" />
                  Chưa có hội thoại nào. Tìm khách hàng để bắt đầu trò chuyện.
                </div>
              ) : (
                conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedId(conversation.id)}
                    className={cn(
                      'mb-2 w-full rounded-lg border p-3 text-left transition hover:bg-accent',
                      selectedId === conversation.id ? 'border-primary bg-primary/5' : 'border-transparent bg-background'
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="font-semibold text-sm text-foreground line-clamp-1">
                        {conversation.customerName || 'Khách hàng'}
                      </div>
                      {conversation.sellerUnreadCount ? (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                          {conversation.sellerUnreadCount}
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground line-clamp-1">
                      {conversation.lastMessage || 'Chưa có tin nhắn'}
                    </div>
                    {conversation.lastMessageAt && (
                      <div className="mt-1 text-[11px] text-muted-foreground">
                        {new Date(conversation.lastMessageAt).toLocaleString('vi-VN')}
                      </div>
                    )}
                  </button>
                ))
              )}
            </ScrollArea>
          </aside>
          <main className="flex h-full flex-col">
            {activeConversation ? (
              <>
                <div className="flex items-center justify-between border-b px-6 py-4">
                  <div>
                    <p className="text-lg font-semibold">{activeConversation.customerName || 'Khách hàng'}</p>
                    <p className="text-sm text-muted-foreground">{activeConversation.customerEmail}</p>
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
                        const isSeller = message.senderId === user?.userId
                        return (
                          <div key={message.id} className={cn('flex', isSeller ? 'justify-end' : 'justify-start')}>
                            <div
                              className={cn(
                                'max-w-sm rounded-lg border px-3 py-2 text-sm shadow-sm',
                                isSeller ? 'bg-primary text-primary-foreground' : 'bg-background'
                              )}
                            >
                              <p className="whitespace-pre-line">{message.content}</p>
                              <span className="mt-1 block text-[11px] opacity-70">
                                {new Date(message.createdAt).toLocaleString('vi-VN')}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </ScrollArea>
                <div className="border-t bg-muted/10 p-4">
                  <div className="flex items-center gap-3">
                    <Textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Nhập tin nhắn..."
                      className="min-h-[60px] flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSend()
                        }
                      }}
                    />
                    <Button onClick={handleSend} disabled={sending || !draft.trim()} className="shrink-0">
                      {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Nhấn Enter để gửi, Shift + Enter để xuống dòng.
                  </p>
                </div>
              </>
            ) : (
              <div className="flex h-full flex-1 flex-col items-center justify-center gap-3 p-6 text-center text-muted-foreground">
                <MessageSquare className="h-10 w-10" />
                <p className="text-sm">Chọn một hội thoại hoặc tìm khách hàng để bắt đầu nhắn tin.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}


