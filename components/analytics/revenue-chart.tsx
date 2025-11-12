"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const revenueData = [
  { date: "01/01", revenue: 4200000, orders: 45, profit: 1260000 },
  { date: "05/01", revenue: 5100000, orders: 52, profit: 1530000 },
  { date: "10/01", revenue: 3800000, orders: 38, profit: 1140000 },
  { date: "15/01", revenue: 6200000, orders: 68, profit: 1860000 },
  { date: "20/01", revenue: 5500000, orders: 59, profit: 1650000 },
  { date: "25/01", revenue: 7100000, orders: 75, profit: 2130000 },
  { date: "30/01", revenue: 6800000, orders: 71, profit: 2040000 },
]

const categoryData = [
  { category: "Điện tử", revenue: 45200000 },
  { category: "Thời trang", revenue: 32100000 },
  { category: "Làm đẹp", revenue: 28500000 },
  { category: "Nhà cửa", revenue: 19700000 },
]

export function RevenueChart() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Doanh thu theo thời gian</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === "revenue" || name === "profit") {
                    return [
                      new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value),
                      name === "revenue" ? "Doanh thu" : "Lợi nhuận",
                    ]
                  }
                  return [value, "Đơn hàng"]
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} name="Doanh thu" />
              <Line type="monotone" dataKey="profit" stroke="hsl(var(--secondary))" strokeWidth={2} name="Lợi nhuận" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Doanh thu theo danh mục</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [
                  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value),
                  "Doanh thu",
                ]}
              />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
