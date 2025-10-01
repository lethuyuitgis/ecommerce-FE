import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const salesData = [
  { date: "01/01", sales: 12, revenue: 359880000 },
  { date: "02/01", sales: 19, revenue: 569810000 },
  { date: "03/01", sales: 15, revenue: 449850000 },
  { date: "04/01", sales: 25, revenue: 749750000 },
  { date: "05/01", sales: 22, revenue: 659780000 },
  { date: "06/01", sales: 30, revenue: 899700000 },
  { date: "07/01", sales: 28, revenue: 839720000 },
]

const viewsData = [
  { date: "01/01", views: 245 },
  { date: "02/01", views: 312 },
  { date: "03/01", views: 289 },
  { date: "04/01", views: 401 },
  { date: "05/01", views: 378 },
  { date: "06/01", views: 445 },
  { date: "07/01", views: 423 },
]

export function ProductDetailStats() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Doanh số bán hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value: number) => [`${value} sản phẩm`, "Đã bán"]} />
              <Bar dataKey="sales" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lượt xem sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={viewsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value: number) => [`${value} lượt`, "Xem"]} />
              <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
