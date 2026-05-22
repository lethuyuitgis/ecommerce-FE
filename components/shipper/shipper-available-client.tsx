"use client"

import { useEffect, useState } from "react"
import { Loader2, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { adminApi, type AdminShipment } from "@/lib/api/admin"
import { toast } from "sonner"

export function ShipperAvailableClient() {
  const [items, setItems] = useState<AdminShipment[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    adminApi
      .listAvailableForShipper()
      .then((data) => {
        setItems(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        toast.error("Không tải được danh sách đơn có sẵn")
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang tải...
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-sm text-muted-foreground">
          Hiện không có đơn nào sẵn sàng để nhận.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {items.map((s) => (
        <Card key={s.id}>
          <CardContent className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">
                {s.trackingNumber || s.id}
              </span>
              <span className="rounded bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                {s.status}
              </span>
            </div>
            <div>
              <p className="font-medium">{(s as any).recipientName || (s.deliveryAddress as any)?.name || "—"}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {[
                  (s as any).recipientAddress || (s.deliveryAddress as any)?.address,
                  (s as any).recipientWard || (s.deliveryAddress as any)?.ward,
                  (s as any).recipientDistrict || (s.deliveryAddress as any)?.district,
                  (s as any).recipientProvince || (s.deliveryAddress as any)?.province,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Khối lượng: {s.packageWeight ?? "—"} kg</span>
              {s.codAmount ? (
                <span className="font-medium text-foreground">
                  COD:{" "}
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                    s.codAmount
                  )}
                </span>
              ) : null}
            </div>
            <Button className="w-full" disabled>
              Nhận đơn (sắp ra mắt)
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
