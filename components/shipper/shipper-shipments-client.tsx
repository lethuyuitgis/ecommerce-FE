"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { shipperApi, type AdminShipmentDTO } from "@/lib/api/shipper"
import { toast } from "sonner"

const TABS: { value: string; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "READY_FOR_PICKUP", label: "Chờ lấy" },
  { value: "PICKED_UP", label: "Đã lấy" },
  { value: "IN_TRANSIT", label: "Đang vận chuyển" },
  { value: "OUT_FOR_DELIVERY", label: "Đang giao" },
  { value: "DELIVERED", label: "Đã giao" },
]

const NEXT_STATUS: Record<string, string> = {
  READY_FOR_PICKUP: "PICKED_UP",
  PICKED_UP: "IN_TRANSIT",
  IN_TRANSIT: "OUT_FOR_DELIVERY",
  OUT_FOR_DELIVERY: "DELIVERED",
}

const NEXT_LABEL: Record<string, string> = {
  READY_FOR_PICKUP: "Lấy hàng",
  PICKED_UP: "Bắt đầu vận chuyển",
  IN_TRANSIT: "Đi giao",
  OUT_FOR_DELIVERY: "Xác nhận đã giao",
}

export function ShipperShipmentsClient() {
  const [tab, setTab] = useState<string>("all")
  const [items, setItems] = useState<AdminShipmentDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)

  const load = (status?: string) => {
    setLoading(true)
    shipperApi.getMyShipments(status).then((res) => {
      if (res.success && Array.isArray(res.data)) {
        setItems(res.data)
      } else if (!res.success) {
        toast.error(res.message || "Không tải được shipment")
      }
      setLoading(false)
    })
  }

  useEffect(() => {
    load(tab === "all" ? undefined : tab)
  }, [tab])

  const handleAdvance = async (s: AdminShipmentDTO) => {
    const next = NEXT_STATUS[s.status]
    if (!next) return
    setBusy(s.id)
    const res = await shipperApi.updateShipmentStatus(s.id, next)
    setBusy(null)
    if (res.success) {
      toast.success(`Đã cập nhật: ${next}`)
      load(tab === "all" ? undefined : tab)
    } else {
      toast.error(res.message || "Cập nhật thất bại")
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="flex flex-wrap gap-1">
            {TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="mt-4 overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang tải...
            </div>
          ) : items.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Không có shipment.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="py-2">Mã vận đơn</th>
                  <th>Đơn hàng</th>
                  <th>Người nhận</th>
                  <th>Trạng thái</th>
                  <th>COD</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {items.map((s) => (
                  <tr key={s.id} className="border-b last:border-0">
                    <td className="py-2 font-mono text-xs">{s.trackingNumber || "—"}</td>
                    <td>{s.orderId}</td>
                    <td>
                      <div className="font-medium">{s.deliveryAddress?.name || "—"}</div>
                      <div className="text-xs text-muted-foreground">{s.deliveryAddress?.phone}</div>
                    </td>
                    <td>
                      <span className="rounded bg-muted px-2 py-0.5 text-xs">{s.status}</span>
                    </td>
                    <td>
                      {s.codAmount
                        ? new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(s.codAmount)
                        : "—"}
                    </td>
                    <td>
                      {NEXT_STATUS[s.status] ? (
                        <Button
                          size="sm"
                          onClick={() => handleAdvance(s)}
                          disabled={busy === s.id}
                        >
                          {busy === s.id ? (
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                          ) : null}
                          {NEXT_LABEL[s.status]}
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
