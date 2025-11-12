"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Client } from "@stomp/stompjs"
import { Bell, Package, Tag, TrendingUp, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { notificationsApi, Notification } from "@/lib/api/notifications"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

const MAX_NOTIFICATIONS = 50

function buildWebSocketUrl(): string {
  if (typeof window === "undefined") {
    return ""
  }
  const explicit = process.env.NEXT_PUBLIC_WS_URL
  if (explicit) {
    return explicit
  }
  const base = (process.env.NEXT_PUBLIC_API_URL || window.location.origin).replace(/\/$/, "")
  const normalized = base.replace(/\/api$/, "")
  const protocol = normalized.startsWith("https") ? "wss" : "ws"
  return normalized.replace(/^https?/, protocol) + "/ws"
}

export function NotificationDropdown() {
  const { isAuthenticated, user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const clientRef = useRef<Client | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications()
      fetchUnreadCount()
    } else {
      setNotifications([])
      setUnreadCount(0)
      if (clientRef.current) {
        clientRef.current.deactivate()
        clientRef.current = null
      }
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated || !user?.userId) {
      return
    }

    const brokerURL = buildWebSocketUrl()
    if (!brokerURL) {
      return
    }

    const client = new Client({
      brokerURL,
      reconnectDelay: 5000,
      debug: process.env.NODE_ENV === "development" ? (msg) => console.debug("[notifications][ws]", msg) : undefined,
    })

    client.onConnect = () => {
      client.subscribe(`/topic/users/${user.userId}`, (message) => {
        try {
          const payload: Notification = JSON.parse(message.body)
          setNotifications((prev) => {
            const existingIndex = prev.findIndex((n) => n.id === payload.id)
            if (existingIndex >= 0) {
              const clone = [...prev]
              clone[existingIndex] = payload
              return clone
            }
            return [payload, ...prev].slice(0, MAX_NOTIFICATIONS)
          })
          if (!payload.isRead) {
            setUnreadCount((prev) => prev + 1)
          }
        } catch (error) {
          console.error("Failed to parse notification message", error)
        }
      })
    }

    client.onStompError = (frame) => {
      console.error("STOMP error", frame)
    }

    client.onWebSocketError = (event) => {
      console.error("Websocket error", event)
    }

    client.activate()
    clientRef.current = client

    return () => {
      client.deactivate()
      clientRef.current = null
    }
  }, [isAuthenticated, user?.userId])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await notificationsApi.getNotifications(0, MAX_NOTIFICATIONS)
      if (response.success && response.data) {
        setNotifications(response.data.content)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationsApi.getUnreadCount()
      if (response.success && response.data !== undefined) {
        setUnreadCount(Number(response.data) || 0)
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const response = await notificationsApi.markAsRead(id)
      if (response.success) {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    } catch (error) {
      toast.error("Đánh dấu đã đọc thất bại")
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await notificationsApi.markAllAsRead()
      if (response.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
        setUnreadCount(0)
      }
    } catch (error) {
      toast.error("Đánh dấu tất cả đã đọc thất bại")
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      const response = await notificationsApi.deleteNotification(id)
      if (response.success) {
        const notification = notifications.find(n => n.id === id)
        if (notification && !notification.isRead) {
          setUnreadCount((prev) => Math.max(0, prev - 1))
        }
        setNotifications((prev) => prev.filter((n) => n.id !== id))
      }
    } catch (error) {
      toast.error("Xóa thông báo thất bại")
    }
  }

  const getIcon = (type: string): React.ReactNode => {
    const normalized = type?.toUpperCase()
    if (normalized === "ORDER" || normalized === "ORDER_NEW" || normalized === "ORDER_STATUS") {
      return <Package className="w-5 h-5 text-blue-500" />
    }
    if (normalized === "PROMOTION") {
      return <Tag className="w-5 h-5 text-red-500" />
    }
    if (normalized === "SYSTEM") {
      return <TrendingUp className="w-5 h-5 text-green-500" />
    }
    return <Bell className="w-5 h-5" />
  }

  const filterNotifications = (category?: "ORDER" | "PROMOTION") => {
    if (!category) return notifications
    if (category === "ORDER") {
      return notifications.filter((n) => {
        const normalized = n.type?.toUpperCase()
        return normalized === "ORDER" || normalized === "ORDER_NEW" || normalized === "ORDER_STATUS"
      })
    }
    if (category === "PROMOTION") {
      return notifications.filter((n) => n.type?.toUpperCase() === "PROMOTION")
    }
    return notifications
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Vừa xong"
    if (diffMins < 60) return `${diffMins} phút trước`
    if (diffHours < 24) return `${diffHours} giờ trước`
    if (diffDays < 7) return `${diffDays} ngày trước`
    return date.toLocaleDateString("vi-VN")
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-auto p-0 text-primary-foreground hover:bg-transparent hover:opacity-80"
        >
          <Bell className="mr-1 h-4 w-4" />
          Thông Báo
          {unreadCount > 0 && (
            <Badge className="absolute -right-2 -top-1 h-5 min-w-5 rounded-full bg-red-500 px-1 text-xs text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0">
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Thông báo</h3>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-primary">
                Đánh dấu đã đọc
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="all"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Tất cả ({notifications.length})
            </TabsTrigger>
            <TabsTrigger
              value="order"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Đơn hàng
            </TabsTrigger>
            <TabsTrigger
              value="promotion"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Khuyến mãi
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="m-0 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <p>Đang tải...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Bell className="w-12 h-12 mb-2 opacity-50" />
                <p>Không có thông báo nào</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onRead={markAsRead}
                    onDelete={deleteNotification}
                    getIcon={getIcon}
                    formatTime={formatTime}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="order" className="m-0 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <p>Đang tải...</p>
              </div>
            ) : filterNotifications("ORDER").length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <p>Không có thông báo đơn hàng</p>
              </div>
            ) : (
              <div className="divide-y">
                {filterNotifications("ORDER").map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onRead={markAsRead}
                    onDelete={deleteNotification}
                    getIcon={getIcon}
                    formatTime={formatTime}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="promotion" className="m-0 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <p>Đang tải...</p>
              </div>
            ) : filterNotifications("PROMOTION").length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <p>Không có thông báo khuyến mãi</p>
              </div>
            ) : (
              <div className="divide-y">
                {filterNotifications("PROMOTION").map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onRead={markAsRead}
                    onDelete={deleteNotification}
                    getIcon={getIcon}
                    formatTime={formatTime}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="border-t p-3 text-center">
          <Link href="/notifications" className="text-sm text-primary hover:underline" onClick={() => setOpen(false)}>
            Xem tất cả thông báo
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function NotificationItem({
  notification,
  onRead,
  onDelete,
  getIcon,
  formatTime,
}: {
  notification: Notification
  onRead: (id: string) => void
  onDelete: (id: string) => void
  getIcon: (type: string) => React.ReactNode
  formatTime: (dateString: string) => string
}) {
  const handleClick = () => {
    if (!notification.isRead) {
      onRead(notification.id)
    }
  }

  return (
    <div
      className={`group relative p-4 hover:bg-gray-50 transition-colors ${!notification.isRead ? "bg-blue-50/50" : ""}`}
    >
      <Link href={notification.link || "#"} onClick={handleClick} className="flex gap-3">
        <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-sm line-clamp-1">{notification.title}</h4>
            {!notification.isRead && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />}
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">{notification.message}</p>
          <p className="text-xs text-gray-400 mt-1">{formatTime(notification.createdAt)}</p>
        </div>
      </Link>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.preventDefault()
          onDelete(notification.id)
        }}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  )
}
