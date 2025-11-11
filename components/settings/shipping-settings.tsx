"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Truck } from "lucide-react"
import { shippingApi, ShippingMethod } from "@/lib/api/shipping"
import { toast } from "sonner"

export function ShippingSettings() {
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [enabledMethods, setEnabledMethods] = useState<Record<string, boolean>>({})
  const [freeShippingEnabled, setFreeShippingEnabled] = useState(false)
  const [minOrderValue, setMinOrderValue] = useState("")

  useEffect(() => {
    fetchShippingMethods()
  }, [])

  const fetchShippingMethods = async () => {
    try {
      setLoading(true)
      const response = await shippingApi.getShippingMethods()
      if (response.success && response.data) {
        setShippingMethods(response.data)
        const enabled: Record<string, boolean> = {}
        response.data.forEach((method) => {
          enabled[method.id] = method.isActive
        })
        setEnabledMethods(enabled)
      }
    } catch (error) {
      console.error('Failed to fetch shipping methods:', error)
      toast.error("Tải phương thức vận chuyển thất bại")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleMethod = (methodId: string) => {
    setEnabledMethods((prev) => ({
      ...prev,
      [methodId]: !prev[methodId],
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      // Persist shipping methods' active states
      await Promise.all(
        shippingMethods.map((method) =>
          shippingApi.updateShippingMethodActive(method.id, !!enabledMethods[method.id])
        )
      )
      // Persist free shipping settings
      await shippingApi.saveShippingSettings({
        freeShippingEnabled,
        minOrderValue: freeShippingEnabled && minOrderValue ? Number(minOrderValue) : undefined,
      })
      toast.success("Lưu cài đặt thành công")
    } catch (error: any) {
      toast.error(error.message || "Lưu cài đặt thất bại")
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
              <p className="text-muted-foreground">Đang tải...</p>
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
          <CardTitle>Phương thức vận chuyển</CardTitle>
          <CardDescription>Cấu hình các phương thức giao hàng</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {shippingMethods.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Chưa có phương thức vận chuyển nào</p>
            </div>
          ) : (
            shippingMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">{method.name}</h3>
                    {method.description && (
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    )}
                    {method.estimatedDays && (
                      <p className="text-sm text-muted-foreground">
                        Thời gian: {method.estimatedDays} ngày
                      </p>
                    )}
                    {method.baseFee && (
                      <p className="text-sm text-muted-foreground">
                        Phí cơ bản: {method.baseFee.toLocaleString("vi-VN")}₫
                      </p>
                    )}
                  </div>
                </div>
                <Switch
                  checked={enabledMethods[method.id] || false}
                  onCheckedChange={() => handleToggleMethod(method.id)}
                />
              </div>
            ))
          )}
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
            <Switch
              id="free-shipping"
              checked={freeShippingEnabled}
              onCheckedChange={setFreeShippingEnabled}
            />
          </div>

          {freeShippingEnabled && (
            <div className="space-y-2">
              <Label htmlFor="min-order">Giá trị đơn hàng tối thiểu</Label>
              <Input
                id="min-order"
                type="number"
                placeholder="VD: 500000"
                value={minOrderValue}
                onChange={(e) => setMinOrderValue(e.target.value)}
              />
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
