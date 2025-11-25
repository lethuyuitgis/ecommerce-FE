'use client'

import { useState } from "react"
import { Search, Package, CheckCircle, Clock, Truck, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function TrackingClient() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [showResult, setShowResult] = useState(false)

  const handleTrack = () => {
    if (trackingNumber.trim()) {
      setShowResult(true)
    }
  }

  const trackingResult = {
    id: trackingNumber,
    status: "Đang giao",
    currentLocation: "Quận Bình Thạnh, TP.HCM",
    estimatedDelivery: "Hôm nay, 18:00",
    carrier: "GHN",
    updates: [
      { time: "14:30", status: "Đang giao", location: "Quận Bình Thạnh", icon: Truck },
      { time: "12:45", status: "Rời kho", location: "Kho GHN TP.HCM", icon: Package },
      { time: "10:15", status: "Đã tiếp nhận", location: "Kho GHN TP.HCM", icon: CheckCircle },
      { time: "09:00", status: "Đơn hàng được tạo", location: "Online", icon: Clock },
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Theo dõi đơn hàng</h1>
          <p className="text-amber-100">Nhập mã vận đơn để xem tình trạng giao hàng</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Search Box */}
        <div className="bg-white border-2 border-amber-200 rounded-lg p-8 mb-8">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Nhập mã vận đơn (ví dụ: GHN123456789)"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
                className="h-12"
              />
            </div>
            <Button onClick={handleTrack} size="lg" className="px-8">
              <Search className="mr-2 h-5 w-5" />
              Tra cứu
            </Button>
          </div>
        </div>

        {/* Tracking Result */}
        {showResult && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6 border-b pb-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold">Mã vận đơn: {trackingResult.id}</h2>
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                  {trackingResult.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{trackingResult.currentLocation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Dự kiến: {trackingResult.estimatedDelivery}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {trackingResult.updates.map((update, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="p-2 bg-amber-100 rounded-full">
                      <update.icon className="h-5 w-5 text-amber-600" />
                    </div>
                    {index < trackingResult.updates.length - 1 && (
                      <div className="w-0.5 h-12 bg-gray-200 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">{update.status}</span>
                      <span className="text-sm text-gray-500">{update.time}</span>
                    </div>
                    <p className="text-sm text-gray-600">{update.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

