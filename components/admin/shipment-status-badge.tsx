import { Badge } from "@/components/ui/badge"

interface ShipmentStatusBadgeProps {
  status: string
}

export function ShipmentStatusBadge({ status }: ShipmentStatusBadgeProps) {
  const s = status.toUpperCase()
  
  let variant: "default" | "outline" | "secondary" | "destructive" = "default"
  let label = status
  let className = ""

  switch (s) {
    case 'READY_FOR_PICKUP':
      variant = "secondary"
      label = "Sẵn sàng lấy"
      className = "bg-blue-100 text-blue-700 hover:bg-blue-200"
      break
    case 'PICKED_UP':
      variant = "default"
      label = "Đã lấy hàng"
      className = "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
      break
    case 'IN_TRANSIT':
      variant = "default"
      label = "Đang vận chuyển"
      className = "bg-orange-100 text-orange-700 hover:bg-orange-200 animate-pulse"
      break
    case 'ARRIVED_HUB':
      variant = "default"
      label = "Tại kho trung chuyển"
      className = "bg-purple-100 text-purple-700 hover:bg-purple-200"
      break
    case 'OUT_FOR_DELIVERY':
      variant = "default"
      label = "Đang giao"
      className = "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
      break
    case 'DELIVERED':
      variant = "default"
      label = "Thành công"
      className = "bg-green-100 text-green-700 hover:bg-green-200"
      break
    case 'FAILED':
      variant = "destructive"
      label = "Thất bại"
      break
    case 'CANCELLED':
      variant = "outline"
      label = "Đã hủy"
      break
  }

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  )
}
