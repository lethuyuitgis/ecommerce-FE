"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"
import Image from "next/image"
import { sellerApi, Seller } from "@/lib/api/seller"
import { apiClientWithFile } from "@/lib/api/client"
import { toast } from "sonner"
import { BusinessHoursForm } from "./business-hours-form"

export function ShopSettings() {
  const [seller, setSeller] = useState<Seller | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    shopName: "",
    shopDescription: "",
    shopPhone: "",
    shopEmail: "",
    province: "",
    district: "",
  })

  useEffect(() => {
    fetchSellerProfile()
  }, [])

  const fetchSellerProfile = async () => {
    try {
      setLoading(true)
      const response = await sellerApi.getProfile()
      if (response.success && response.data) {
        setSeller(response.data)
        setFormData({
          shopName: response.data.shopName || "",
          shopDescription: response.data.shopDescription || "",
          shopPhone: response.data.shopPhone || "",
          shopEmail: response.data.shopEmail || "",
          province: response.data.province || "",
          district: response.data.district || "",
        })
      }
    } catch (error) {
      console.error('Failed to fetch seller profile:', error)
      toast.error("Tải thông tin cửa hàng thất bại")
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setSaving(true)
      const response = await apiClientWithFile<{ url: string }>('/upload', file, 'shop-avatars')
      if (response.success && response.data) {
        await sellerApi.updateProfile({ shopAvatar: response.data.url })
        toast.success("Cập nhật logo thành công")
        fetchSellerProfile()
      }
    } catch (error: any) {
      toast.error(error.message || "Cập nhật logo thất bại")
    } finally {
      setSaving(false)
    }
  }

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setSaving(true)
      const response = await apiClientWithFile<{ url: string }>('/upload', file, 'shop-covers')
      if (response.success && response.data) {
        await sellerApi.updateProfile({ shopCover: response.data.url })
        toast.success("Cập nhật ảnh bìa thành công")
        fetchSellerProfile()
      }
    } catch (error: any) {
      toast.error(error.message || "Cập nhật ảnh bìa thất bại")
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      const response = await sellerApi.updateProfile(formData)
      if (response.success && response.data) {
        setSeller(response.data)
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
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Đang tải thông tin...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
          <CardDescription>Cập nhật thông tin cửa hàng của bạn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Logo cửa hàng</Label>
              <div className="flex items-center gap-4">
                <Image
                  src={seller?.shopAvatar || "/placeholder.svg"}
                  alt="Shop logo"
                  width={100}
                  height={100}
                  className="rounded-lg border"
                />
                <label htmlFor="avatar-upload">
                  <Button type="button" variant="outline" disabled={saving}>
                    <Upload className="h-4 w-4 mr-2" />
                    {saving ? "Đang tải..." : "Tải ảnh lên"}
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
              </div>
            </div>

            <div className="space-y-2">
              <Label>Ảnh bìa cửa hàng</Label>
              <div className="flex items-center gap-4">
                {seller?.shopCover && (
                  <Image
                    src={seller.shopCover}
                    alt="Shop cover"
                    width={200}
                    height={100}
                    className="rounded-lg border object-cover"
                  />
                )}
                <label htmlFor="cover-upload">
                  <Button type="button" variant="outline" disabled={saving}>
                    <Upload className="h-4 w-4 mr-2" />
                    {saving ? "Đang tải..." : "Tải ảnh bìa lên"}
                  </Button>
                </label>
                <input
                  id="cover-upload"
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  onChange={handleCoverChange}
                  disabled={saving}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shop-name">Tên cửa hàng</Label>
              <Input
                id="shop-name"
                value={formData.shopName}
                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shop-description">Mô tả</Label>
              <Textarea
                id="shop-description"
                rows={4}
                value={formData.shopDescription}
                onChange={(e) => setFormData({ ...formData, shopDescription: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shop-phone">Số điện thoại</Label>
                <Input
                  id="shop-phone"
                  value={formData.shopPhone}
                  onChange={(e) => setFormData({ ...formData, shopPhone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shop-email">Email</Label>
                <Input
                  id="shop-email"
                  type="email"
                  value={formData.shopEmail}
                  onChange={(e) => setFormData({ ...formData, shopEmail: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="province">Tỉnh/Thành phố</Label>
                <Input
                  id="province"
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">Quận/Huyện</Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Giờ làm việc</CardTitle>
          <CardDescription>Thiết lập thời gian hoạt động của cửa hàng</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <BusinessHoursForm />
        </CardContent>
      </Card>
    </div>
  )
}
