import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, TrendingUp, RefreshCw } from "lucide-react"

const inventoryHistory = [
  {
    id: 1,
    type: "import",
    quantity: 50,
    date: "2024-01-07 14:30",
    note: "Nhập hàng từ nhà cung cấp",
    user: "Admin",
  },
  {
    id: 2,
    type: "sale",
    quantity: -5,
    date: "2024-01-07 10:15",
    note: "Bán hàng - Đơn #12345",
    user: "Hệ thống",
  },
  {
    id: 3,
    type: "adjust",
    quantity: -2,
    date: "2024-01-06 16:20",
    note: "Điều chỉnh tồn kho - Hàng lỗi",
    user: "Admin",
  },
  {
    id: 4,
    type: "sale",
    quantity: -3,
    date: "2024-01-06 09:45",
    note: "Bán hàng - Đơn #12344",
    user: "Hệ thống",
  },
  {
    id: 5,
    type: "import",
    quantity: 30,
    date: "2024-01-05 11:00",
    note: "Nhập hàng từ nhà cung cấp",
    user: "Admin",
  },
]

export function ProductInventoryHistory() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {inventoryHistory.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
            >
              <div
                className={`p-2 rounded-lg ${
                  item.type === "import"
                    ? "bg-green-100 text-green-600"
                    : item.type === "sale"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-amber-100 text-amber-600"
                }`}
              >
                {item.type === "import" ? (
                  <TrendingUp className="h-5 w-5" />
                ) : item.type === "sale" ? (
                  <Package className="h-5 w-5" />
                ) : (
                  <RefreshCw className="h-5 w-5" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="font-medium">{item.note}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.date} • {item.user}
                    </p>
                  </div>
                  <Badge
                    variant={item.quantity > 0 ? "default" : "secondary"}
                    className={item.quantity > 0 ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}
                  >
                    {item.quantity > 0 ? "+" : ""}
                    {item.quantity}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
