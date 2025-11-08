"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface TrackingFormProps {
  onSubmit: (trackingNumber: string) => void
  isLoading?: boolean
}

export function TrackingForm({ onSubmit, isLoading = false }: TrackingFormProps) {
  const [trackingNumber, setTrackingNumber] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (trackingNumber.trim()) {
      onSubmit(trackingNumber)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex-1">
        <Input
          type="text"
          placeholder="Nhập mã vận đơn..."
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          className="py-3 border-2 border-amber-200 focus:border-amber-500"
        />
      </div>
      <Button type="submit" disabled={isLoading} className="bg-amber-500 hover:bg-amber-600 text-white px-6">
        <Search className="h-5 w-5 mr-2" />
        Tìm
      </Button>
    </form>
  )
}
