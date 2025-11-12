"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { productStatsApi } from "@/lib/api/product-stats"
import { Loader2 } from "lucide-react"

interface ProductDetailStatsProps {
  productId: string
}

export function ProductDetailStats({ productId }: ProductDetailStatsProps) {
  const [salesData, setSalesData] = useState<Array<{ date: string; sales: number; revenue: number }>>([])
  const [viewsData, setViewsData] = useState<Array<{ date: string; views: number }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [productId])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const resp = await productStatsApi.getProductStats(productId, 7)
      if (resp.success && resp.data) {
        setSalesData(resp.data.salesData || [])
        setViewsData(resp.data.viewsData || [])
      } else {
        // Fallback to empty data if API fails
        setSalesData([])
        setViewsData([])
      }
    } catch (error) {
      console.error("Error fetching product stats:", error)
      // Fallback to empty data
      setSalesData([])
      setViewsData([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Đang tải thống kê...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (salesData.length === 0 && viewsData.length === 0) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">Chưa có dữ liệu thống kê</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
      {salesData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Doanh số bán hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => [`${value} sản phẩm`, "Đã bán"]}
                  labelStyle={{ fontSize: 12 }}
                />
                <Bar dataKey="sales" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {viewsData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Lượt xem sản phẩm</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={viewsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => [`${value} lượt`, "Xem"]}
                  labelStyle={{ fontSize: 12 }}
                />
                <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
