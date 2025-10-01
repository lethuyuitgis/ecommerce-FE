"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"
import Image from "next/image"

export function ShopSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
          <CardDescription>Cập nhật thông tin cửa hàng của bạn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Logo cửa hàng</Label>
            <div className="flex items-center gap-4">
              <Image
                src="/placeholder.svg?height=100&width=100"
                alt="Shop logo"
                width={100}
                height={100}
                className="rounded-lg border"
              />
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Tải ảnh lên
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shop-name">Tên cửa hàng</Label>
            <Input id="shop-name" defaultValue="Shop Của Huy" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shop-description">Mô tả</Label>
            <Textarea
              id="shop-description"
              rows={4}
              defaultValue="Chuyên cung cấp các sản phẩm chất lượng cao với giá tốt nhất thị trường"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shop-phone">Số điện thoại</Label>
              <Input id="shop-phone" defaultValue="0901234567" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shop-email">Email</Label>
              <Input id="shop-email" type="email" defaultValue="shop@example.com" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shop-address">Địa chỉ</Label>
            <Input id="shop-address" defaultValue="123 Đường ABC, Phường XYZ, Quận 1, TP.HCM" />
          </div>

          <div className="flex justify-end">
            <Button>Lưu thay đổi</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Giờ làm việc</CardTitle>
          <CardDescription>Thiết lập thời gian hoạt động của cửa hàng</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"].map((day) => (
            <div key={day} className="flex items-center gap-4">
              <div className="w-24 font-medium">{day}</div>
              <Input type="time" defaultValue="08:00" className="w-32" />
              <span className="text-muted-foreground">-</span>
              <Input type="time" defaultValue="22:00" className="w-32" />
            </div>
          ))}
          <div className="flex justify-end">
            <Button>Lưu thay đổi</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
