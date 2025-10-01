"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const notificationTypes = [
  { id: "new-order", label: "Đơn hàng mới", description: "Nhận thông báo khi có đơn hàng mới" },
  { id: "order-status", label: "Cập nhật đơn hàng", description: "Thông báo khi trạng thái đơn hàng thay đổi" },
  { id: "new-message", label: "Tin nhắn mới", description: "Nhận thông báo khi có tin nhắn từ khách hàng" },
  { id: "low-stock", label: "Cảnh báo tồn kho", description: "Thông báo khi sản phẩm sắp hết hàng" },
  { id: "new-review", label: "Đánh giá mới", description: "Nhận thông báo khi có đánh giá mới" },
]

export function NotificationSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông báo Email</CardTitle>
          <CardDescription>Quản lý thông báo qua email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {notificationTypes.map((type) => (
            <div key={type.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor={`email-${type.id}`}>{type.label}</Label>
                <p className="text-sm text-muted-foreground">{type.description}</p>
              </div>
              <Switch id={`email-${type.id}`} defaultChecked />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thông báo Push</CardTitle>
          <CardDescription>Quản lý thông báo đẩy trên trình duyệt</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {notificationTypes.map((type) => (
            <div key={type.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor={`push-${type.id}`}>{type.label}</Label>
                <p className="text-sm text-muted-foreground">{type.description}</p>
              </div>
              <Switch id={`push-${type.id}`} defaultChecked />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
