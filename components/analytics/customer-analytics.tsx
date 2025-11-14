"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

interface CustomerAnalyticsProps {
  customerTypeData?: Array<{ name: string; value: number; color?: string }>
  customerLocationData?: Array<{ city: string; customers: number }>
}

const defaultCustomerTypeData = [
  { name: "Khách mới", value: 45, color: "#f59e0b" },
  { name: "Khách quay lại", value: 35, color: "#d97706" },
  { name: "Khách VIP", value: 20, color: "#eab308" },
]

const defaultCustomerLocationData = [
  { city: "TP.HCM", customers: 456 },
  { city: "Hà Nội", customers: 389 },
  { city: "Đà Nẵng", customers: 234 },
  { city: "Cần Thơ", customers: 156 },
  { city: "Khác", customers: 289 },
]

export function CustomerAnalytics({
  customerTypeData = defaultCustomerTypeData,
  customerLocationData = defaultCustomerLocationData,
}: CustomerAnalyticsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Phân loại khách hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={customerTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {customerTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Khách hàng theo khu vực</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={customerLocationData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="city" type="category" />
              <Tooltip />
              <Bar dataKey="customers" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
