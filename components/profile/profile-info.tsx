"use client"

import type React from "react"

import { useState } from "react"
import { Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function ProfileInfo() {
  const [formData, setFormData] = useState({
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0123456789",
    gender: "male",
    birthDate: "1990-01-01",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Update profile:", formData)
  }

  return (
    <div className="rounded-lg bg-white p-6">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-xl font-semibold text-foreground">Hồ Sơ Của Tôi</h2>
        <p className="text-sm text-muted-foreground">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input id="fullName" value={formData.fullName} onChange={handleChange} />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={formData.email} onChange={handleChange} disabled />
              <p className="mt-1 text-xs text-muted-foreground">Email không thể thay đổi</p>
            </div>

            <div>
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} />
            </div>

            <div>
              <Label>Giới tính</Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
              >
                <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="cursor-pointer font-normal">
                      Nam
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="cursor-pointer font-normal">
                      Nữ
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="cursor-pointer font-normal">
                      Khác
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="birthDate">Ngày sinh</Label>
              <Input id="birthDate" type="date" value={formData.birthDate} onChange={handleChange} />
            </div>

            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Lưu Thay Đổi
            </Button>
          </form>
        </div>

        <div className="flex flex-col items-center border-l pl-8">
          <Avatar className="mb-4 h-32 w-32">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>NV</AvatarFallback>
          </Avatar>
          <Button variant="outline" size="sm" className="mb-2 bg-transparent">
            <Camera className="mr-2 h-4 w-4" />
            Chọn Ảnh
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Dung lượng file tối đa 1 MB
            <br />
            Định dạng: .JPEG, .PNG
          </p>
        </div>
      </div>
    </div>
  )
}
