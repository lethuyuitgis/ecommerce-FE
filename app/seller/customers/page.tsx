"use client"

import { useEffect, useMemo, useState } from "react"
import { SellerSidebar } from "@/components/seller/seller-sidebar"
import { sellerCustomersApi, SellerCustomer, SellerCustomerDetail } from "@/lib/api/customers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, Search, MessagesSquare, TrendingUp, Users } from "lucide-react"
import { formatCurrency } from "@/lib/format"
import { messagesApi } from "@/lib/api/messages"
import { toast } from "sonner"

export default function SellerCustomersPage() {
  const [search, setSearch] = useState("")
  const [keyword, setKeyword] = useState("")
  const [page, setPage] = useState(0)
  const [customers, setCustomers] = useState<SellerCustomer[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<SellerCustomerDetail | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(search)
      setPage(0)
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    loadCustomers()
  }, [keyword, page])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      const response = await sellerCustomersApi.list(keyword, page, 12)
      if (response.success && response.data) {
        setCustomers(response.data.content)
        setTotalPages(response.data.totalPages)
      }
    } finally {
      setLoading(false)
    }
  }

  const loadDetail = async (customerId: string) => {
    try {
      setLoadingDetail(true)
      const response = await sellerCustomersApi.detail(customerId)
      if (response.success && response.data) {
        setSelectedCustomer(response.data)
      }
    } catch (error: any) {
      toast.error(error.message || "Không thể tải thông tin khách hàng")
    } finally {
      setLoadingDetail(false)
    }
  }

  const handleMessage = async (customerId: string, customerName?: string) => {
    try {
      const response = await messagesApi.sendMessage({
        recipientId: customerId,
        content: "Xin chào, mình có thể hỗ trợ gì cho bạn?",
      })
      if (response.success && response.data) {
        toast.success(`Đã mở hội thoại với ${customerName || 'khách hàng'}`)
      }
    } catch (error: any) {
      toast.error(error.message || "Không thể mở hội thoại")
    }
  }

  const stats = useMemo(() => {
    if (customers.length === 0) {
      return { totalOrders: 0, totalSpent: 0 }
    }
    return customers.reduce(
      (acc, item) => {
        acc.totalOrders += item.totalOrders || 0
        acc.totalSpent += Number(item.totalSpent || 0)
        return acc
      },
      { totalOrders: 0, totalSpent: 0 }
    )
  }, [customers])

  return (
    <div className="flex min-h-screen bg-background">
      <SellerSidebar />
      <div className="flex-1 p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Khách hàng</h1>
            <p className="text-sm text-muted-foreground">Danh sách khách đã mua hàng của bạn</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm khách hàng theo tên, email, số điện thoại"
                className="w-full pl-9 sm:w-[320px]"
              />
            </div>
            <div className="rounded-lg border bg-card px-4 py-2 text-sm">
              <div className="flex items-center gap-2 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span>Tổng đơn: {stats.totalOrders.toLocaleString('vi-VN')}</span>
              </div>
              <div className="text-muted-foreground text-xs">
                Tổng chi tiêu: {formatCurrency(stats.totalSpent)}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : customers.length === 0 ? (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-5 w-5" />
                Chưa có khách hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Khi khách hàng đặt mua sản phẩm của bạn, họ sẽ xuất hiện tại đây cùng lịch sử giao dịch.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {customers.map((customer) => (
              <Card key={customer.customerId} className="flex flex-col justify-between">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {customer.fullName || 'Khách hàng'}
                  </CardTitle>
                  <div className="text-xs text-muted-foreground space-y-1">
                    {customer.email && <p>Email: {customer.email}</p>}
                    {customer.phone && <p>Điện thoại: {customer.phone}</p>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Đơn hàng</span>
                    <Badge variant="secondary">{customer.totalOrders}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Tổng chi tiêu</span>
                    <span className="font-medium">{formatCurrency(Number(customer.totalSpent || 0))}</span>
                  </div>
                  {customer.lastOrderAt && (
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Lần cuối</span>
                      <span>{new Date(customer.lastOrderAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  )}
                  <div className="flex gap-2 pt-3">
                    <Button size="sm" className="flex-1" variant="outline" onClick={() => loadDetail(customer.customerId)}>
                      Chi tiết
                    </Button>
                    <Button
                      size="sm"
                      variant="default"
                      className="flex-1"
                      onClick={() => handleMessage(customer.customerId, customer.fullName)}
                    >
                      <MessagesSquare className="mr-2 h-4 w-4" /> Nhắn tin
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
              Trước
            </Button>
            <span className="text-sm text-muted-foreground">
              Trang {page + 1}/{totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            >
              Sau
            </Button>
          </div>
        )}

        <Dialog open={!!selectedCustomer} onOpenChange={(open) => !open && setSelectedCustomer(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thông tin khách hàng</DialogTitle>
            </DialogHeader>
            {loadingDetail || !selectedCustomer ? (
              <div className="flex h-60 items-center justify-center text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg border bg-muted/30 p-4">
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="font-semibold text-lg text-foreground">{selectedCustomer.fullName || 'Khách hàng'}</div>
                    {selectedCustomer.email && <div>Email: {selectedCustomer.email}</div>}
                    {selectedCustomer.phone && <div>Điện thoại: {selectedCustomer.phone}</div>}
                    <div>Tổng đơn: {selectedCustomer.totalOrders.toLocaleString('vi-VN')}</div>
                    <div>Tổng chi tiêu: {formatCurrency(Number(selectedCustomer.totalSpent || 0))}</div>
                    <div>Lần đầu mua: {selectedCustomer.firstOrderAt ? new Date(selectedCustomer.firstOrderAt).toLocaleString('vi-VN') : '—'}</div>
                    <div>Lần mua gần nhất: {selectedCustomer.lastOrderAt ? new Date(selectedCustomer.lastOrderAt).toLocaleString('vi-VN') : '—'}</div>
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">Đơn gần đây</h3>
                  <ScrollArea className="h-48 rounded-lg border">
                    <div className="divide-y">
                      {selectedCustomer.recentOrders.map((order) => (
                        <div key={order.orderId} className="px-4 py-3 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">#{order.orderNumber}</span>
                            <Badge variant="outline">{order.status}</Badge>
                          </div>
                          <div className="flex items-center justify-between text-muted-foreground text-xs mt-1">
                            <span>{new Date(order.createdAt).toLocaleString('vi-VN')}</span>
                            <span>{formatCurrency(Number(order.finalTotal || 0))}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

