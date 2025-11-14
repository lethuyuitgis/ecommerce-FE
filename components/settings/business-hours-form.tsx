"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { sellerApi } from "@/lib/api/seller"
import { toast } from "sonner"

const daysOfWeek = [
  { key: "monday", label: "Thứ 2" },
  { key: "tuesday", label: "Thứ 3" },
  { key: "wednesday", label: "Thứ 4" },
  { key: "thursday", label: "Thứ 5" },
  { key: "friday", label: "Thứ 6" },
  { key: "saturday", label: "Thứ 7" },
  { key: "sunday", label: "Chủ nhật" },
]

export function BusinessHoursForm() {
  const [businessHours, setBusinessHours] = useState<Record<string, { open: string; close: string }>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchBusinessHours()
  }, [])

  const fetchBusinessHours = async () => {
    try {
      setLoading(true)
      const response = await sellerApi.getBusinessHours()
      if (response.success && response.data) {
        setBusinessHours(response.data)
      } else {
        // Initialize with default hours
        const defaultHours: Record<string, { open: string; close: string }> = {}
        daysOfWeek.forEach((day) => {
          defaultHours[day.key] = { open: "08:00", close: "22:00" }
        })
        setBusinessHours(defaultHours)
      }
    } catch (error) {
      console.error('Failed to fetch business hours:', error)
      // Initialize with default hours
      const defaultHours: Record<string, { open: string; close: string }> = {}
      daysOfWeek.forEach((day) => {
        defaultHours[day.key] = { open: "08:00", close: "22:00" }
      })
      setBusinessHours(defaultHours)
    } finally {
      setLoading(false)
    }
  }

  const handleTimeChange = (dayKey: string, field: "open" | "close", value: string) => {
    setBusinessHours((prev) => ({
      ...prev,
      [dayKey]: {
        ...(prev[dayKey] || { open: "08:00", close: "22:00" }),
        [field]: value,
      },
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await sellerApi.updateBusinessHours(businessHours)
      if (response.success && response.data) {
        setBusinessHours(response.data)
        toast.success("Lưu giờ làm việc thành công")
      }
    } catch (error: any) {
      toast.error(error.message || "Lưu giờ làm việc thất bại")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Đang tải...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {daysOfWeek.map((day) => {
        const hours = businessHours[day.key] || { open: "08:00", close: "22:00" }
        return (
          <div key={day.key} className="flex items-center gap-4">
            <div className="w-24 font-medium">{day.label}</div>
            <Input
              type="time"
              value={hours.open}
              onChange={(e) => handleTimeChange(day.key, "open", e.target.value)}
              className="w-32"
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="time"
              value={hours.close}
              onChange={(e) => handleTimeChange(day.key, "close", e.target.value)}
              className="w-32"
            />
          </div>
        )
      })}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>
    </div>
  )
}


