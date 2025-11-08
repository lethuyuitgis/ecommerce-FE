import { type Package, MapPin } from "lucide-react"

interface TrackingUpdate {
  time: string
  status: string
  location: string
  icon: typeof Package
}

interface TrackingResultProps {
  id: string
  status: string
  currentLocation: string
  estimatedDelivery: string
  carrier: string
  updates: TrackingUpdate[]
}

export function TrackingResult({
  id,
  status,
  currentLocation,
  estimatedDelivery,
  carrier,
  updates,
}: TrackingResultProps) {
  return (
    <div className="space-y-6">
      {/* Status Summary */}
      <div className="bg-white border-2 border-amber-200 rounded-lg p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Mã vận đơn</p>
            <p className="text-lg font-bold">{id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Trạng thái</p>
            <p className="text-lg font-bold text-amber-600">{status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Đơn vị</p>
            <p className="text-lg font-bold">{carrier}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Dự kiến</p>
            <p className="text-lg font-bold text-green-600">{estimatedDelivery}</p>
          </div>
        </div>
        <div className="bg-amber-50 p-3 rounded flex items-center gap-3">
          <MapPin className="h-5 w-5 text-amber-600" />
          <div>
            <p className="font-semibold text-gray-800">Vị trí hiện tại</p>
            <p className="text-gray-600">{currentLocation}</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white border-2 border-amber-200 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-6">Lịch sử cập nhật</h3>
        <div className="space-y-4">
          {updates.map((update, index) => {
            const Icon = update.icon
            return (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="bg-amber-100 text-amber-600 p-2 rounded-full">
                    <Icon className="h-5 w-5" />
                  </div>
                  {index < updates.length - 1 && <div className="w-0.5 h-8 bg-amber-200 mt-2" />}
                </div>
                <div className="pt-1 pb-4">
                  <p className="font-semibold text-gray-800">{update.status}</p>
                  <p className="text-sm text-gray-600">{update.location}</p>
                  <p className="text-xs text-gray-500">{update.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
