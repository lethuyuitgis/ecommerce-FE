"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { notificationSettingsApi, NotificationPreference } from "@/lib/api/notifications"
import { toast } from "sonner"

const defaultNotificationTypes = [
  { id: "new-order", label: "Đơn hàng mới", description: "Nhận thông báo khi có đơn hàng mới" },
  { id: "order-status", label: "Cập nhật đơn hàng", description: "Thông báo khi trạng thái đơn hàng thay đổi" },
  { id: "new-message", label: "Tin nhắn mới", description: "Nhận thông báo khi có tin nhắn từ khách hàng" },
  { id: "low-stock", label: "Cảnh báo tồn kho", description: "Thông báo khi sản phẩm sắp hết hàng" },
  { id: "new-review", label: "Đánh giá mới", description: "Nhận thông báo khi có đánh giá mới" },
]

export function NotificationSettings() {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchPreferences()
  }, [])

  const fetchPreferences = async () => {
    try {
      setLoading(true)
      const response = await notificationSettingsApi.getPreferences()
      if (response.success && response.data) {
        setPreferences(response.data.preferences || [])
      } else {
        // Fallback to defaults
        const defaultPrefs: NotificationPreference[] = defaultNotificationTypes.map((type) => ({
          id: type.id,
          type: type.id,
          label: type.label,
          description: type.description,
          emailEnabled: true,
          pushEnabled: true,
        }))
        setPreferences(defaultPrefs)
      }
    } catch (error) {
      console.error('Failed to fetch notification preferences:', error)
      // Fallback to defaults
      const defaultPrefs: NotificationPreference[] = defaultNotificationTypes.map((type) => ({
        id: type.id,
        type: type.id,
        label: type.label,
        description: type.description,
        emailEnabled: true,
        pushEnabled: true,
      }))
      setPreferences(defaultPrefs)
      toast.error("Tải cài đặt thông báo thất bại")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleEmail = async (preferenceId: string, enabled: boolean) => {
    try {
      setSaving(true)
      const response = await notificationSettingsApi.updatePreference(preferenceId, enabled, undefined)
      if (response.success && response.data) {
        setPreferences((prev) =>
          prev.map((p) => (p.id === preferenceId ? { ...p, emailEnabled: enabled } : p))
        )
        toast.success("Cập nhật cài đặt email thành công")
      }
    } catch (error: any) {
      toast.error(error.message || "Cập nhật thất bại")
      // Revert on error
      setPreferences((prev) =>
        prev.map((p) => (p.id === preferenceId ? { ...p, emailEnabled: !enabled } : p))
      )
    } finally {
      setSaving(false)
    }
  }

  const handleTogglePush = async (preferenceId: string, enabled: boolean) => {
    try {
      setSaving(true)
      const response = await notificationSettingsApi.updatePreference(preferenceId, undefined, enabled)
      if (response.success && response.data) {
        setPreferences((prev) =>
          prev.map((p) => (p.id === preferenceId ? { ...p, pushEnabled: enabled } : p))
        )
        toast.success("Cập nhật cài đặt push thành công")
      }
    } catch (error: any) {
      toast.error(error.message || "Cập nhật thất bại")
      // Revert on error
      setPreferences((prev) =>
        prev.map((p) => (p.id === preferenceId ? { ...p, pushEnabled: !enabled } : p))
      )
    } finally {
      setSaving(false)
    }
  }

  const handleSaveAll = async () => {
    try {
      setSaving(true)
      const response = await notificationSettingsApi.updatePreferences(preferences)
      if (response.success && response.data) {
        setPreferences(response.data.preferences)
        toast.success("Lưu tất cả cài đặt thành công")
      }
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
          <CardTitle>Thông báo Email</CardTitle>
          <CardDescription>Quản lý thông báo qua email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {preferences.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Chưa có cài đặt thông báo nào</p>
            </div>
          ) : (
            preferences.map((pref) => (
              <div key={pref.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor={`email-${pref.id}`}>{pref.label}</Label>
                  <p className="text-sm text-muted-foreground">{pref.description}</p>
                </div>
                <Switch
                  id={`email-${pref.id}`}
                  checked={pref.emailEnabled}
                  onCheckedChange={(checked) => handleToggleEmail(pref.id, checked)}
                  disabled={saving}
                />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thông báo Push</CardTitle>
          <CardDescription>Quản lý thông báo đẩy trên trình duyệt</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {preferences.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Chưa có cài đặt thông báo nào</p>
            </div>
          ) : (
            preferences.map((pref) => (
              <div key={pref.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor={`push-${pref.id}`}>{pref.label}</Label>
                  <p className="text-sm text-muted-foreground">{pref.description}</p>
                </div>
                <Switch
                  id={`push-${pref.id}`}
                  checked={pref.pushEnabled}
                  onCheckedChange={(checked) => handleTogglePush(pref.id, checked)}
                  disabled={saving}
                />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveAll} disabled={saving}>
          {saving ? "Đang lưu..." : "Lưu tất cả cài đặt"}
        </Button>
      </div>
    </div>
  )
}
