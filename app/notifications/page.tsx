"use client"

import type React from "react"

import { useState } from "react"
import { Bell, Package, Tag, TrendingUp, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

interface Notification {
  id: string
  type: "order" | "promotion" | "system"
  title: string
  message: string
  time: string
  date: string
  read: boolean
  link?: string
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "order",
    title: "Đơn hàng đã được giao",
    message: "Đơn hàng #DH123456 đã được giao thành công. Cảm ơn bạn đã mua hàng!",
    time: "14:30",
    date: "Hôm nay",
    read: false,
    link: "/orders/DH123456",
  },
  {
    id: "2",
    type: "promotion",
    title: "Flash Sale 12.12 - Giảm đến 50%",
    message: "Hàng ngàn sản phẩm giảm giá sốc. Nhanh tay đặt hàng ngay!",
    time: "10:00",
    date: "Hôm nay",
    read: false,
    link: "/flash-sales",
  },
  {
    id: "3",
    type: "order",
    title: "Đơn hàng đang được vận chuyển",
    message: "Đơn hàng #DH123455 đang trên đường giao đến bạn. Dự kiến giao hàng trong 1-2 ngày.",
    time: "09:15",
    date: "Hôm qua",
    read: true,
    link: "/orders/DH123455",
  },
  {
    id: "4",
    type: "system",
    title: "Cập nhật chính sách đổi trả",
    message: "Chính sách đổi trả hàng đã được cập nhật. Xem chi tiết tại đây.",
    time: "16:45",
    date: "10/12/2024",
    read: true,
    link: "/return-policy",
  },
  {
    id: "5",
    type: "promotion",
    title: "Mã giảm giá 100.000đ",
    message: "Bạn có 1 mã giảm giá trị giá 100.000đ cho đơn hàng từ 500.000đ. Sử dụng ngay!",
    time: "11:20",
    date: "09/12/2024",
    read: true,
    link: "/vouchers",
  },
  {
    id: "6",
    type: "order",
    title: "Đơn hàng đã được xác nhận",
    message: "Đơn hàng #DH123454 đã được xác nhận và đang được chuẩn bị.",
    time: "08:30",
    date: "08/12/2024",
    read: true,
    link: "/orders/DH123454",
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (ids: string[]) => {
    setNotifications((prev) => prev.map((n) => (ids.includes(n.id) ? { ...n, read: true } : n)))
    setSelectedIds([])
  }

  const deleteNotifications = (ids: string[]) => {
    setNotifications((prev) => prev.filter((n) => !ids.includes(n.id)))
    setSelectedIds([])
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === notifications.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(notifications.map((n) => n.id))
    }
  }

  const getIcon = (type: string): React.ReactNode => {
    switch (type) {
      case "order":
        return <Package className="w-6 h-6 text-blue-500" />
      case "promotion":
        return <Tag className="w-6 h-6 text-red-500" />
      case "system":
        return <TrendingUp className="w-6 h-6 text-green-500" />
      default:
        return <Bell className="w-6 h-6" />
    }
  }

  const filterNotifications = (type?: string) => {
    if (!type) return notifications
    return notifications.filter((n) => n.type === type)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm">
            {/* Header */}
            <div className="border-b p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold">Thông báo</h1>
                  <p className="text-gray-600 mt-1">Bạn có {unreadCount} thông báo chưa đọc</p>
                </div>
                {selectedIds.length > 0 && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => markAsRead(selectedIds)}>
                      Đánh dấu đã đọc
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => deleteNotifications(selectedIds)}>
                      <Trash2 className="w-4 h-4 mr-1" />
                      Xóa
                    </Button>
                  </div>
                )}
              </div>

              {notifications.length > 0 && (
                <div className="flex items-center gap-2">
                  <Checkbox checked={selectedIds.length === notifications.length} onCheckedChange={toggleSelectAll} />
                  <span className="text-sm text-gray-600">
                    Chọn tất cả ({selectedIds.length}/{notifications.length})
                  </span>
                </div>
              )}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 px-6">
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
                <TabsTrigger
                  value="system"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Hệ thống
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="m-0">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                    <Bell className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-lg">Không có thông báo nào</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {notifications.map((notification) => (
                      <NotificationRow
                        key={notification.id}
                        notification={notification}
                        selected={selectedIds.includes(notification.id)}
                        onToggleSelect={toggleSelect}
                        getIcon={getIcon}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="order" className="m-0">
                <div className="divide-y">
                  {filterNotifications("order").map((notification) => (
                    <NotificationRow
                      key={notification.id}
                      notification={notification}
                      selected={selectedIds.includes(notification.id)}
                      onToggleSelect={toggleSelect}
                      getIcon={getIcon}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="promotion" className="m-0">
                <div className="divide-y">
                  {filterNotifications("promotion").map((notification) => (
                    <NotificationRow
                      key={notification.id}
                      notification={notification}
                      selected={selectedIds.includes(notification.id)}
                      onToggleSelect={toggleSelect}
                      getIcon={getIcon}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="system" className="m-0">
                <div className="divide-y">
                  {filterNotifications("system").map((notification) => (
                    <NotificationRow
                      key={notification.id}
                      notification={notification}
                      selected={selectedIds.includes(notification.id)}
                      onToggleSelect={toggleSelect}
                      getIcon={getIcon}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

function NotificationRow({
  notification,
  selected,
  onToggleSelect,
  getIcon,
}: {
  notification: Notification
  selected: boolean
  onToggleSelect: (id: string) => void
  getIcon: (type: string) => React.ReactNode
}) {
  return (
    <div className={`p-6 hover:bg-gray-50 transition-colors ${!notification.read ? "bg-blue-50/30" : ""}`}>
      <div className="flex gap-4">
        <Checkbox checked={selected} onCheckedChange={() => onToggleSelect(notification.id)} />
        <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
        <div className="flex-1 min-w-0">
          <Link href={notification.link || "#"} className="block group">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{notification.title}</h3>
              {!notification.read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />}
            </div>
            <p className="text-gray-600 mb-2">{notification.message}</p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>{notification.date}</span>
              <span>•</span>
              <span>{notification.time}</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
