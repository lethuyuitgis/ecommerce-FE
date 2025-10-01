"use client"

import { useState } from "react"
import { MapPin, CreditCard } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

export function CheckoutForm() {
  const [paymentMethod, setPaymentMethod] = useState("cod")

  return (
    <div className="space-y-4">
      {/* Shipping Address */}
      <div className="rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Địa Chỉ Nhận Hàng</h2>
        </div>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input id="fullName" placeholder="Nhập họ và tên" />
            </div>
            <div>
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input id="phone" placeholder="Nhập số điện thoại" />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Nhập email" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="city">Tỉnh/Thành phố</Label>
              <Input id="city" placeholder="Chọn Tỉnh/Thành phố" />
            </div>
            <div>
              <Label htmlFor="district">Quận/Huyện</Label>
              <Input id="district" placeholder="Chọn Quận/Huyện" />
            </div>
            <div>
              <Label htmlFor="ward">Phường/Xã</Label>
              <Input id="ward" placeholder="Chọn Phường/Xã" />
            </div>
          </div>
          <div>
            <Label htmlFor="address">Địa chỉ cụ thể</Label>
            <Textarea id="address" placeholder="Nhập địa chỉ cụ thể" rows={3} />
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Phương Thức Thanh Toán</h2>
        </div>
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="cod" id="cod" />
              <Label htmlFor="cod" className="flex flex-1 cursor-pointer items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-foreground">Thanh toán khi nhận hàng (COD)</div>
                  <div className="text-sm text-muted-foreground">Thanh toán bằng tiền mặt khi nhận hàng</div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="bank" id="bank" />
              <Label htmlFor="bank" className="flex flex-1 cursor-pointer items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-foreground">Chuyển khoản ngân hàng</div>
                  <div className="text-sm text-muted-foreground">Chuyển khoản qua tài khoản ngân hàng</div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="momo" id="momo" />
              <Label htmlFor="momo" className="flex flex-1 cursor-pointer items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                  <span className="text-lg font-bold text-pink-600">M</span>
                </div>
                <div>
                  <div className="font-medium text-foreground">Ví MoMo</div>
                  <div className="text-sm text-muted-foreground">Thanh toán qua ví điện tử MoMo</div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="zalopay" id="zalopay" />
              <Label htmlFor="zalopay" className="flex flex-1 cursor-pointer items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <span className="text-lg font-bold text-blue-600">Z</span>
                </div>
                <div>
                  <div className="font-medium text-foreground">ZaloPay</div>
                  <div className="text-sm text-muted-foreground">Thanh toán qua ví điện tử ZaloPay</div>
                </div>
              </Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Note */}
      <div className="rounded-lg bg-white p-6">
        <Label htmlFor="note">Ghi chú đơn hàng (Tùy chọn)</Label>
        <Textarea
          id="note"
          placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn"
          rows={4}
          className="mt-2"
        />
      </div>
    </div>
  )
}
