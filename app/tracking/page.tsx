"use client"

import { useState } from "react"
import { Search, Package, CheckCircle, Clock, Truck, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function TrackingPage() {
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
                onKeyPress={(e) => e.key === "Enter" && handleTrack()}
                className="py-3 text-lg border-2 border-amber-200 focus:border-amber-500"
              />
            </div>
            <Button onClick={handleTrack} className="bg-amber-500 hover:bg-amber-600 text-white px-8">
              <Search className="h-5 w-5 mr-2" />
              Tìm kiếm
            </Button>
          </div>
        </div>

        {/* Tracking Result */}
        {showResult && (
          <div className="space-y-8">
            {/* Status Summary */}
            <div className="bg-white border-2 border-amber-200 rounded-lg p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Mã vận đơn</p>
                  <p className="text-lg font-bold text-gray-800">{trackingResult.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Trạng thái</p>
                  <p className="text-lg font-bold text-amber-600">{trackingResult.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Đơn vị vận chuyển</p>
                  <p className="text-lg font-bold text-gray-800">{trackingResult.carrier}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Dự kiến giao</p>
                  <p className="text-lg font-bold text-green-600">{trackingResult.estimatedDelivery}</p>
                </div>
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800">Vị trí hiện tại</p>
                    <p className="text-gray-600">{trackingResult.currentLocation}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white border-2 border-amber-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Lịch sử cập nhật</h2>
              <div className="space-y-6">
                {trackingResult.updates.map((update, index) => {
                  const Icon = update.icon
                  return (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="bg-amber-100 text-amber-600 p-3 rounded-full">
                          <Icon className="h-6 w-6" />
                        </div>
                        {index < trackingResult.updates.length - 1 && <div className="w-1 h-12 bg-amber-200 mt-2" />}
                      </div>
                      <div className="flex-1 pt-2 pb-4">
                        <p className="font-semibold text-gray-800">{update.status}</p>
                        <p className="text-sm text-gray-600 mt-1">{update.location}</p>
                        <p className="text-xs text-gray-500 mt-2">{update.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        {!showResult && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-amber-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Chưa có kết quả</h2>
            <p className="text-gray-600 mb-6">Nhập mã vận đơn ở trên để theo dõi đơn hàng của bạn</p>
            <Button className="bg-amber-500 hover:bg-amber-600 text-white">Xem đơn hàng của tôi</Button>
          </div>
        )}
      </div>
    </div>
  )
}
