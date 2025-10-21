import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { TrendingUp, TrendingDown } from "lucide-react"

const topProducts = [
  {
    id: "1",
    name: "iPhone 15 Pro Max 256GB",
    image: "/modern-smartphone.png",
    sold: 128,
    revenue: 3838720000,
    trend: "+15%",
    trendUp: true,
  },
  {
    id: "2",
    name: "Áo Thun Nam Basic",
    image: "/plain-white-tshirt.png",
    sold: 456,
    revenue: 90744000,
    trend: "+8%",
    trendUp: true,
  },
  {
    id: "3",
    name: "Son Môi Lì Cao Cấp",
    image: "/assorted-lipsticks.png",
    sold: 234,
    revenue: 81900000,
    trend: "-3%",
    trendUp: false,
  },
]

const lowStockProducts = [
  { name: "Tai nghe Bluetooth", stock: 5, status: "critical" },
  { name: "Ốp lưng iPhone", stock: 12, status: "warning" },
  { name: "Cáp sạc Type-C", stock: 18, status: "warning" },
]

export function TopProductsChart() {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Sản phẩm bán chạy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/5">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                  {index + 1}
                </div>
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={60}
                  height={60}
                  className="rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{product.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-muted-foreground">Đã bán: {product.sold}</span>
                    <span className="text-sm font-medium">{formatPrice(product.revenue)}</span>
                  </div>
                </div>
                <div className={`flex items-center gap-1 ${product.trendUp ? "text-green-600" : "text-red-600"}`}>
                  {product.trendUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="text-sm font-medium">{product.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cảnh báo tồn kho</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {lowStockProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                <div>
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">Còn {product.stock} sản phẩm</p>
                </div>
                <Badge variant={product.status === "critical" ? "destructive" : "secondary"}>
                  {product.status === "critical" ? "Rất thấp" : "Thấp"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
