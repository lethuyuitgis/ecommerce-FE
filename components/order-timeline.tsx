import { CheckCircle, Package, Truck, Home } from "lucide-react"

interface OrderTimelineProps {
  status: string
}

export function OrderTimeline({ status }: OrderTimelineProps) {
  const timeline = [
    {
      status: "pending",
      label: "Đơn hàng đã đặt",
      time: "2024-01-07 14:30",
      completed: true,
    },
    {
      status: "processing",
      label: "Đã xác nhận",
      time: status !== "pending" ? "2024-01-07 15:00" : undefined,
      completed: status !== "pending",
    },
    {
      status: "shipping",
      label: "Đang giao hàng",
      time: status === "shipping" || status === "completed" ? "2024-01-08 09:00" : undefined,
      completed: status === "shipping" || status === "completed",
    },
    {
      status: "completed",
      label: "Đã giao hàng",
      time: status === "completed" ? "2024-01-08 16:30" : undefined,
      completed: status === "completed",
    },
  ]

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
                className={`rounded-full p-2 ${
                  item.completed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
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
