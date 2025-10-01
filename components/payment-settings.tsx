"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { CreditCard, Wallet, Banknote } from "lucide-react"

const paymentMethods = [
  { id: "cod", name: "Thanh toán khi nhận hàng (COD)", icon: Banknote, enabled: true },
  { id: "bank", name: "Chuyển khoản ngân hàng", icon: CreditCard, enabled: true },
  { id: "momo", name: "Ví MoMo", icon: Wallet, enabled: false },
  { id: "zalopay", name: "ZaloPay", icon: Wallet, enabled: false },
]

export function PaymentSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Phương thức thanh toán</CardTitle>
          <CardDescription>Quản lý các phương thức thanh toán</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <method.icon className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{method.name}</span>
              </div>
              <Switch defaultChecked={method.enabled} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin ngân hàng</CardTitle>
          <CardDescription>Cập nhật thông tin tài khoản nhận tiền</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ngân hàng:</span>
              <span className="font-medium">Vietcombank</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Số tài khoản:</span>
              <span className="font-medium font-mono">1234567890</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Chủ tài khoản:</span>
              <span className="font-medium">NGUYEN VAN A</span>
            </div>
          </div>
          <Button variant="outline" className="w-full bg-transparent">
            Chỉnh sửa thông tin
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
