"use client"

import { useState, useEffect } from 'react'
import { adminApi, AdminOverview } from '@/lib/api/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

interface OverviewTabProps {
  initialOverview?: AdminOverview | null
  initialStartDate?: string
  initialEndDate?: string
}

function getInitialDateRange() {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 30)
  return { start: formatInputDate(start), end: formatInputDate(end) }
}

function formatInputDate(date: Date) {
  return date.toISOString().split('T')[0]
}

function formatCurrency(value?: number) {
  if (value == null) return '0₫'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

function OverviewStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border p-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  )
}

export function OverviewTab({ initialOverview, initialStartDate, initialEndDate }: OverviewTabProps) {
  const [overview, setOverview] = useState<AdminOverview | null>(initialOverview || null)
  const [loading, setLoading] = useState(false)
  const [{ start: startDate, end: endDate }, setDateRange] = useState(() => {
    if (initialStartDate && initialEndDate) {
      return { start: initialStartDate, end: initialEndDate }
    }
    return getInitialDateRange()
  })

  const loadOverview = async () => {
    try {
      setLoading(true)
      const data = await adminApi.getAdminOverview({ startDate, endDate })
      setOverview(data)
    } catch (error: any) {
      console.error('Failed to load admin overview', error)
      toast.error(error?.message || 'Không thể tải tổng quan hệ thống')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!initialOverview) {
      loadOverview()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const topSellers = overview?.topSellers ?? []

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tổng quan hệ thống</CardTitle>
          <p className="text-sm text-muted-foreground">Theo phạm vi ngày lựa chọn</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Ngày bắt đầu</span>
              <Input
                type="date"
                value={startDate}
                max={endDate}
                onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Ngày kết thúc</span>
              <Input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
              />
            </div>
            <Button variant="outline" onClick={loadOverview} disabled={loading}>
              {loading ? 'Đang cập nhật...' : 'Làm mới'}
            </Button>
          </div>

          {loading && !overview ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <Skeleton key={idx} className="h-24 w-full" />
              ))}
            </div>
          ) : overview ? (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <OverviewStat label="Tổng doanh thu" value={formatCurrency(overview.totalRevenue)} />
                <OverviewStat label="Tổng đơn hàng" value={overview.totalOrders.toLocaleString('vi-VN')} />
                <OverviewStat label="Khách hàng" value={overview.totalCustomers.toLocaleString('vi-VN')} />
                <OverviewStat label="Seller đang hoạt động" value={overview.activeSellers.toLocaleString('vi-VN')} />
              </div>
              <div className="rounded-lg border">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <div>
                    <p className="font-medium">Top người bán</p>
                    <p className="text-sm text-muted-foreground">Theo doanh thu</p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(overview.startDate).toLocaleDateString('vi-VN')} -{' '}
                    {new Date(overview.endDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                {topSellers.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground">Chưa có dữ liệu.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left text-muted-foreground">
                          <th className="px-4 py-2">Shop</th>
                          <th className="px-4 py-2">Đơn hàng</th>
                          <th className="px-4 py-2">Doanh thu</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topSellers.map((seller) => (
                          <tr key={seller.sellerId} className="border-t">
                            <td className="px-4 py-2">{seller.shopName}</td>
                            <td className="px-4 py-2">{seller.orders.toLocaleString('vi-VN')}</td>
                            <td className="px-4 py-2">{formatCurrency(seller.revenue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">Không có dữ liệu trong khoảng thời gian đã chọn.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


