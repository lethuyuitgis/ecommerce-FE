"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Truck } from "lucide-react"

const shippingMethods = [
  { id: "standard", name: "Giao hàng tiêu chuẩn", time: "3-5 ngày", fee: 30000 },
  { id: "express", name: "Giao hàng nhanh", time: "1-2 ngày", fee: 50000 },
  { id: "same-day", name: "Giao hàng trong ngày", time: "Trong ngày", fee: 80000 },
]

export function ShippingSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Phương thức vận chuyển</CardTitle>
          <CardDescription>Cấu hình các phương thức giao hàng</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {shippingMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">{method.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {method.time} • {method.fee.toLocaleString("vi-VN")}₫
                  </p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Miễn phí vận chuyển</CardTitle>
          <CardDescription>Thiết lập điều kiện miễn phí ship</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="free-shipping">Bật miễn phí vận chuyển</Label>
            <Switch id="free-shipping" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="min-order">Giá trị đơn hàng tối thiểu</Label>
            <Input id="min-order" type="number" placeholder="VD: 500000" />
          </div>

          <div className="flex justify-end">
            <Button>Lưu thay đổi</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
