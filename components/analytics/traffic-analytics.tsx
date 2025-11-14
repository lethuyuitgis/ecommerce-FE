"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from "recharts"

interface TrafficAnalyticsProps {
  trafficData?: Array<{ date: string; views: number; visitors: number; bounceRate?: number }>
  sourceData?: Array<{ source: string; visitors: number }>
}

const defaultTrafficData = [
  { date: "01/01", views: 1245, visitors: 856, bounceRate: 42 },
  { date: "05/01", views: 1589, visitors: 1023, bounceRate: 38 },
  { date: "10/01", views: 1342, visitors: 912, bounceRate: 45 },
  { date: "15/01", views: 1876, visitors: 1234, bounceRate: 35 },
  { date: "20/01", views: 1654, visitors: 1089, bounceRate: 40 },
  { date: "25/01", views: 2103, visitors: 1456, bounceRate: 32 },
  { date: "30/01", views: 1987, visitors: 1345, bounceRate: 36 },
]

const defaultSourceData = [
  { source: "Tìm kiếm", visitors: 3456 },
  { source: "Mạng xã hội", visitors: 2345 },
  { source: "Trực tiếp", visitors: 1876 },
  { source: "Quảng cáo", visitors: 1234 },
  { source: "Khác", visitors: 567 },
]

export function TrafficAnalytics({ trafficData = defaultTrafficData, sourceData = defaultSourceData }: TrafficAnalyticsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Lượt truy cập</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} name="Lượt xem" />
              <Line type="monotone" dataKey="visitors" stroke="hsl(var(--secondary))" strokeWidth={2} name="Khách" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nguồn truy cập</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={sourceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="source" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="visitors" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
