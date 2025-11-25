"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Bell, Package, Tag, TrendingUp, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"

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

interface NotificationsClientProps {
  initialNotifications?: Notification[]
}

export function NotificationsClient({ initialNotifications = [] }: NotificationsClientProps) {
  const [notifications, setNotifications] = useState(initialNotifications)
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
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm">
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
      <Footer />
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


