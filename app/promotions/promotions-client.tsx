"use client"

import { useState, useEffect } from "react"
import { promotionsApi, Promotion, PromotionPage } from "@/lib/api/promotions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tag, Percent, Calendar, ShoppingBag } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface PromotionsClientProps {
  initialPromotions?: Promotion[]
}

export function PromotionsClient({ initialPromotions = [] }: PromotionsClientProps) {
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    const loadPromotions = async () => {
      setLoading(true)
      try {
        const response = await promotionsApi.getActive(page, 20)
        if (response.success && response.data) {
          setPromotions(response.data.content || [])
          setTotalPages(response.data.totalPages || 0)
        }
      } catch (error) {
        console.error("Error loading promotions:", error)
      } finally {
        setLoading(false)
      }
    }

    if (initialPromotions.length === 0) {
      loadPromotions()
    }
  }, [page, initialPromotions.length])

  const formatDiscount = (promotion: Promotion) => {
    if (promotion.promotionType === "PERCENTAGE") {
      return `Giảm ${promotion.discountValue}%`
    } else if (promotion.promotionType === "FIXED_AMOUNT") {
      return `Giảm ₫${promotion.discountValue?.toLocaleString("vi-VN")}`
    }
    return "Khuyến mãi đặc biệt"
  }

  const getStatusBadge = (promotion: Promotion) => {
    if (promotion.status === "ACTIVE") {
      return <Badge className="bg-green-500">Đang diễn ra</Badge>
    }
    return <Badge variant="secondary">{promotion.status}</Badge>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Ưu đãi dành cho bạn</h1>
        <p className="text-muted-foreground">
          Khám phá các chương trình khuyến mãi hấp dẫn đang diễn ra
        </p>
      </div>

      {loading && promotions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Đang tải khuyến mãi...</p>
        </div>
      ) : promotions.length === 0 ? (
        <div className="text-center py-12">
          <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Hiện tại không có khuyến mãi nào</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {promotions.map((promotion) => (
              <Card key={promotion.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{promotion.name}</CardTitle>
                      {getStatusBadge(promotion)}
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-2xl font-bold text-primary">
                        {formatDiscount(promotion)}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {promotion.description && (
                    <CardDescription className="mb-4">
                      {promotion.description}
                    </CardDescription>
                  )}

                  <div className="space-y-2 mb-4">
                    {promotion.minPurchaseAmount && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ShoppingBag className="h-4 w-4" />
                        <span>
                          Áp dụng cho đơn hàng từ ₫{promotion.minPurchaseAmount.toLocaleString("vi-VN")}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {promotion.startDate && format(new Date(promotion.startDate), "dd/MM/yyyy", { locale: vi })} - {" "}
                        {promotion.endDate && format(new Date(promotion.endDate), "dd/MM/yyyy", { locale: vi })}
                      </span>
                    </div>

                    {promotion.quantityLimit && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Percent className="h-4 w-4" />
                        <span>
                          Còn lại: {promotion.quantityLimit - (promotion.quantityUsed || 0)}/{promotion.quantityLimit} lượt
                        </span>
                      </div>
                    )}
                  </div>

                  <Button className="w-full" variant="default">
                    Áp dụng ngay
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                Trước
              </Button>
              <span className="flex items-center px-4 text-sm text-muted-foreground">
                Trang {page + 1} / {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page >= totalPages - 1}
                onClick={() => setPage(page + 1)}
              >
                Sau
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

