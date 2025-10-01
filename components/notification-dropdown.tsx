"use client"

import type React from "react"

import { useState } from "react"
import { Bell, Package, Tag, TrendingUp, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

interface Notification {
  id: string
  type: "order" | "promotion" | "system"
  title: string
  message: string
  time: string
  read: boolean
  link?: string
  image?: string
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "order",
    title: "Đơn hàng đã được giao",
    message: "Đơn hàng #DH123456 đã được giao thành công",
    time: "5 phút trước",
    read: false,
    link: "/orders/DH123456",
  },
  {
    id: "2",
    type: "promotion",
    title: "Flash Sale 12.12",
    message: "Giảm đến 50% cho hàng ngàn sản phẩm. Nhanh tay đặt hàng!",
    time: "1 giờ trước",
    read: false,
    link: "/flash-sales",
  },
  {
    id: "3",
    type: "order",
    title: "Đơn hàng đang được vận chuyển",
    message: "Đơn hàng #DH123455 đang trên đường giao đến bạn",
    time: "2 giờ trước",
    read: true,
    link: "/orders/DH123455",
  },
  {
    id: "4",
    type: "system",
    title: "Cập nhật chính sách",
    message: "Chính sách đổi trả hàng đã được cập nhật",
    time: "1 ngày trước",
    read: true,
    link: "/return-policy",
  },
  {
    id: "5",
    type: "promotion",
    title: "Mã giảm giá mới",
    message: "Bạn có 1 mã giảm giá 100.000đ. Sử dụng ngay!",
    time: "2 ngày trước",
    read: true,
    link: "/vouchers",
  },
]

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [open, setOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getIcon = (type: string): React.ReactNode => {
    switch (type) {
      case "order":
        return <Package className="w-5 h-5 text-blue-500" />
      case "promotion":
        return <Tag className="w-5 h-5 text-red-500" />
      case "system":
        return <TrendingUp className="w-5 h-5 text-green-500" />
      default:
        return <Bell className="w-5 h-5" />
    }
  }

  const filterNotifications = (type?: string) => {
    if (!type) return notifications
    return notifications.filter((n) => n.type === type)
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
              {unreadCount}
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
            {notifications.length === 0 ? (
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
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="order" className="m-0 max-h-96 overflow-y-auto">
            <div className="divide-y">
              {filterNotifications("order").map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={markAsRead}
                  onDelete={deleteNotification}
                  getIcon={getIcon}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="promotion" className="m-0 max-h-96 overflow-y-auto">
            <div className="divide-y">
              {filterNotifications("promotion").map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={markAsRead}
                  onDelete={deleteNotification}
                  getIcon={getIcon}
                />
              ))}
            </div>
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
}: {
  notification: Notification
  onRead: (id: string) => void
  onDelete: (id: string) => void
  getIcon: (type: string) => React.ReactNode
}) {
  const handleClick = () => {
    if (!notification.read) {
      onRead(notification.id)
    }
  }

  return (
    <div
      className={`group relative p-4 hover:bg-gray-50 transition-colors ${!notification.read ? "bg-blue-50/50" : ""}`}
    >
      <Link href={notification.link || "#"} onClick={handleClick} className="flex gap-3">
        <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-sm line-clamp-1">{notification.title}</h4>
            {!notification.read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />}
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">{notification.message}</p>
          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
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
