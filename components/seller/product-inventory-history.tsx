"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, TrendingUp, RefreshCw, Loader2 } from "lucide-react"
import { inventoryApi, InventoryHistory } from "@/lib/api/inventory"

interface ProductInventoryHistoryProps {
  productId: string
}

export function ProductInventoryHistory({ productId }: ProductInventoryHistoryProps) {
  const [history, setHistory] = useState<InventoryHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    fetchHistory()
  }, [productId, page])

  const fetchHistory = async () => {
    try {
      setLoading(true)
      const resp = await inventoryApi.getProductHistory(productId, page, 20)
      if (resp.success && resp.data) {
        setHistory(resp.data.content || [])
        setTotalPages(resp.data.totalPages || 0)
      }
    } catch (error) {
      console.error("Error fetching inventory history:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTypeInfo = (reason: string) => {
    switch (reason) {
      case 'restock':
        return { label: 'Nhập hàng', icon: TrendingUp, color: 'bg-green-100 text-green-600' }
      case 'purchase':
        return { label: 'Bán hàng', icon: Package, color: 'bg-blue-100 text-blue-600' }
      case 'return':
        return { label: 'Trả hàng', icon: RefreshCw, color: 'bg-green-100 text-green-600' }
      case 'adjustment':
        return { label: 'Điều chỉnh', icon: RefreshCw, color: 'bg-amber-100 text-amber-600' }
      case 'damage':
        return { label: 'Hàng lỗi', icon: RefreshCw, color: 'bg-red-100 text-red-600' }
      default:
        return { label: 'Khác', icon: RefreshCw, color: 'bg-gray-100 text-gray-600' }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Đang tải lịch sử kho...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        {history.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">Chưa có lịch sử kho hàng</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => {
              const typeInfo = getTypeInfo(item.reason)
              const Icon = typeInfo.icon
              return (
                <div
                  key={item.id}
                  className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${typeInfo.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1 gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm sm:text-base">
                          {item.note || typeInfo.label}
                          {item.referenceId && (
                            <span className="text-muted-foreground ml-2">#{item.referenceId}</span>
                          )}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          {formatDate(item.createdAt)}
                          {item.user && ` • ${item.user}`}
                        </p>
                      </div>
                      <Badge
                        variant={item.quantityChange > 0 ? "default" : "secondary"}
                        className={`shrink-0 ${item.quantityChange > 0 ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}`}
                      >
                        {item.quantityChange > 0 ? "+" : ""}
                        {item.quantityChange}
                      </Badge>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Trang {page + 1} / {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="px-3 py-1 text-xs sm:text-sm border rounded hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Trước
                  </button>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={page >= totalPages - 1}
                    className="px-3 py-1 text-xs sm:text-sm border rounded hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
