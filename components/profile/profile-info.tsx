"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { userApi, User } from "@/lib/api/user"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { apiClientWithFile } from "@/lib/api/client"

export function ProfileInfo() {
  const { user: authUser } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "male",
    birthDate: "",
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await userApi.getProfile()
      if (response.success && response.data) {
        setUser(response.data)
        setFormData({
          fullName: response.data.fullName || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          gender: "male", // Default, update if user has gender field
          birthDate: "", // Update if user has birthDate field
        })
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      toast.error("Tải thông tin thất bại")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setSaving(true)
      const response = await apiClientWithFile<{ url: string }>('/upload', file, 'avatars')
      if (response.success && response.data) {
        await userApi.updateProfile({ avatarUrl: response.data.url })
        toast.success("Cập nhật ảnh đại diện thành công")
        fetchProfile()
      }
    } catch (error: any) {
      toast.error(error.message || "Cập nhật ảnh đại diện thất bại")
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      const response = await userApi.updateProfile({
        fullName: formData.fullName,
        phone: formData.phone,
      })
      if (response.success && response.data) {
        setUser(response.data)
        toast.success("Cập nhật thông tin thành công")
      }
    } catch (error: any) {
      toast.error(error.message || "Cập nhật thông tin thất bại")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Đang tải thông tin...</p>
        </div>
      </div>
    )
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

            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={saving}>
              {saving ? "Đang lưu..." : "Lưu Thay Đổi"}
            </Button>
          </form>
        </div>

        <div className="flex flex-col items-center border-l pl-8">
          <Avatar className="mb-4 h-32 w-32">
            <AvatarImage src={user?.avatarUrl || "/placeholder.svg"} />
            <AvatarFallback>{user?.fullName?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <label htmlFor="avatar-upload">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mb-2 bg-transparent cursor-pointer"
              disabled={saving}
            >
              <Camera className="mr-2 h-4 w-4" />
              {saving ? "Đang tải..." : "Chọn Ảnh"}
            </Button>
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={handleAvatarChange}
            disabled={saving}
          />
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
