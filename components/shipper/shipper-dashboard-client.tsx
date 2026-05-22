"use client"

import { useEffect, useState } from "react"
import { Loader2, Package, Truck, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { shipperApi, type AdminShipmentDTO } from "@/lib/api/shipper"
import { toast } from "sonner"

const statusLabel: Record<string, string> = {
  PENDING: "Chờ xử lý",
  READY_FOR_PICKUP: "Sẵn sàng lấy hàng",
  PICKED_UP: "Đã lấy hàng",
  IN_TRANSIT: "Đang vận chuyển",
  OUT_FOR_DELIVERY: "Đang giao",
  DELIVERED: "Đã giao",
  FAILED: "Thất bại",
  RETURNED: "Trả hàng",
}

export function ShipperDashboardClient() {
  const [shipments, setShipments] = useState<AdminShipmentDTO[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    shipperApi.getMyShipments().then((res) => {
      if (cancelled) return
      if (res.success && Array.isArray(res.data)) {
        setShipments(res.data)
      } else if (!res.success) {
        toast.error(res.message || "Không tải được shipment")
      }
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const counts = shipments.reduce<Record<string, number>>((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1
    return acc
  }, {})

  const activeCount = (counts.PICKED_UP || 0) + (counts.IN_TRANSIT || 0) + (counts.OUT_FOR_DELIVERY || 0)
  const deliveredCount = counts.DELIVERED || 0
  const pendingCount = (counts.PENDING || 0) + (counts.READY_FOR_PICKUP || 0)
  const failedCount = (counts.FAILED || 0) + (counts.RETURNED || 0)

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <KPI icon={<Package className="h-5 w-5" />} label="Đang chờ lấy" value={pendingCount} tone="amber" />
        <KPI icon={<Truck className="h-5 w-5" />} label="Đang vận chuyển" value={activeCount} tone="blue" />
        <KPI icon={<CheckCircle2 className="h-5 w-5" />} label="Đã giao" value={deliveredCount} tone="green" />
        <KPI icon={<AlertCircle className="h-5 w-5" />} label="Sự cố" value={failedCount} tone="red" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Button asChild variant="outline" className="h-auto justify-start py-4">
          <Link href="/shipper/shipments">
            <div className="flex flex-col items-start">
              <span className="font-medium">Đơn của tôi</span>
              <span className="text-xs text-muted-foreground">Danh sách shipment đang phụ trách</span>
            </div>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto justify-start py-4">
          <Link href="/shipper/available">
            <div className="flex flex-col items-start">
              <span className="font-medium">Đơn có sẵn</span>
              <span className="text-xs text-muted-foreground">Nhận đơn chưa có shipper</span>
            </div>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto justify-start py-4">
          <Link href="/tracking">
            <div className="flex flex-col items-start">
              <span className="font-medium">Tra cứu mã vận đơn</span>
              <span className="text-xs text-muted-foreground">Tìm theo tracking number</span>
            </div>
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Đơn gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang tải...
            </div>
          ) : shipments.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Chưa có đơn nào được phân công cho bạn.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="py-2">Mã vận đơn</th>
                    <th>Đơn hàng</th>
                    <th>Trạng thái</th>
                    <th>COD</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.slice(0, 10).map((s) => (
                    <tr key={s.id} className="border-b last:border-0">
                      <td className="py-2 font-mono text-xs">{s.trackingNumber || "—"}</td>
                      <td>{s.orderId}</td>
                      <td>
                        <span className="rounded bg-muted px-2 py-0.5 text-xs">
                          {statusLabel[s.status] || s.status}
                        </span>
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
                        <Button asChild size="sm" variant="ghost">
                          <Link href={`/shipper/shipments/${s.id}`}>Chi tiết</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function KPI({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: number
  tone: "amber" | "blue" | "green" | "red"
}) {
  const toneClass = {
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    red: "bg-red-50 text-red-700",
  }[tone]
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${toneClass}`}>{icon}</div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}
