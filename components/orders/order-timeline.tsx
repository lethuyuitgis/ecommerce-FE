import { CheckCircle, Package, Truck, Home, XCircle } from "lucide-react"

interface OrderTimelineProps {
  status: string
  createdAt?: string
}

export function OrderTimeline({ status, createdAt }: OrderTimelineProps) {
  const statusLower = status?.toLowerCase() || "pending"
  const orderDate = createdAt ? new Date(createdAt).toLocaleString("vi-VN") : ""

  const timeline = [
    {
      status: "pending",
      label: "Đơn hàng đã đặt",
      time: orderDate,
      completed: true,
    },
    {
      status: "processing",
      label: "Đã xác nhận",
      time: statusLower !== "pending" ? orderDate : undefined,
      completed: statusLower !== "pending" && statusLower !== "cancelled",
    },
    {
      status: "shipping",
      label: "Đang giao hàng",
      time: (statusLower === "shipping" || statusLower === "delivered" || statusLower === "completed") ? orderDate : undefined,
      completed: statusLower === "shipping" || statusLower === "delivered" || statusLower === "completed",
    },
    {
      status: "completed",
      label: "Đã giao hàng",
      time: (statusLower === "delivered" || statusLower === "completed") ? orderDate : undefined,
      completed: statusLower === "delivered" || statusLower === "completed",
    },
  ]

  if (statusLower === "cancelled") {
    timeline.push({
      status: "cancelled",
      label: "Đã hủy",
      time: orderDate,
      completed: true,
    })
  }

  const getIcon = (timelineStatus: string) => {
    switch (timelineStatus) {
      case "pending":
        return Package
      case "processing":
        return CheckCircle
      case "shipping":
        return Truck
      case "completed":
        return Home
      case "cancelled":
        return XCircle
      default:
        return Package
    }
  }

  return (
    <div className="space-y-6">
      {timeline.map((item, index) => {
        const Icon = getIcon(item.status)
        return (
          <div key={item.status} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`rounded-full p-2 ${item.completed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              {index < timeline.length - 1 && (
                <div className={`w-0.5 h-12 ${item.completed ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
            <div className="flex-1 pb-6">
              <p className={`font-medium ${item.completed ? "text-foreground" : "text-muted-foreground"}`}>
                {item.label}
              </p>
              {item.time && <p className="text-sm text-muted-foreground mt-1">{item.time}</p>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
