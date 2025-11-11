"use client"

import { useState, useEffect } from "react"
import { Truck, Package, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SellerSidebar } from "@/components/seller/seller-sidebar"
import { shippingApi, Shipment } from "@/lib/api/shipping"
import { ordersApi } from "@/lib/api/orders"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function SellerShippingPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    pending: 0,
    shipping: 0,
    delivered: 0,
    failed: 0,
  })

  useEffect(() => {
    if (!isAuthenticated || user?.userType !== 'SELLER') {
      router.push('/login')
      return
    }

    fetchShipments()
    fetchStats()
  }, [isAuthenticated, user, router])

  const fetchShipments = async () => {
    try {
      setLoading(true)
      // Get seller orders first, then fetch shipments for each order
      const ordersResponse = await ordersApi.getSellerOrders(0, 100)
      if (ordersResponse.success && ordersResponse.data) {
        const orders = ordersResponse.data.content || []
        const shipmentPromises = orders.map(async (order) => {
          try {
            const shipmentResponse = await shippingApi.getShipmentByOrder(order.id)
            if (shipmentResponse.success && shipmentResponse.data) {
              return shipmentResponse.data
            }
          } catch (error) {
            // Order might not have shipment yet
            return null
          }
          return null
        })

        const shipmentResults = await Promise.all(shipmentPromises)
        setShipments(shipmentResults.filter((s): s is Shipment => s !== null))
      }
    } catch (error) {
      console.error('Failed to fetch shipments:', error)
      toast.error("Tải danh sách vận đơn thất bại")
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      // Calculate stats from orders
      const ordersResponse = await ordersApi.getSellerOrders(0, 1000)
      if (ordersResponse.success && ordersResponse.data) {
        const orders = ordersResponse.data.content || []
        const newStats = {
          pending: orders.filter(o => o.shippingStatus === 'PENDING').length,
          shipping: orders.filter(o => o.shippingStatus === 'IN_TRANSIT' || o.shippingStatus === 'PICKED_UP').length,
          delivered: orders.filter(o => o.shippingStatus === 'DELIVERED').length,
          failed: orders.filter(o => o.shippingStatus === 'FAILED').length,
        }
        setStats(newStats)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const shippingStats = [
    { label: "Cần giao", value: String(stats.pending), icon: Package, color: "bg-orange-100 text-orange-600" },
    { label: "Đã giao", value: String(stats.delivered), icon: CheckCircle, color: "bg-green-100 text-green-600" },
    { label: "Lỗi giao", value: String(stats.failed), icon: AlertCircle, color: "bg-red-100 text-red-600" },
    { label: "Đang giao", value: String(stats.shipping), icon: Truck, color: "bg-blue-100 text-blue-600" },
  ]

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: "Chuẩn bị giao",
      PICKED_UP: "Đã lấy hàng",
      IN_TRANSIT: "Đang giao",
      DELIVERED: "Đã giao",
      FAILED: "Lỗi giao",
    }
    return statusMap[status] || status
  }

  const getStatusColor = (status: string) => {
    if (status === "DELIVERED") return "bg-green-100 text-green-700"
    if (status === "IN_TRANSIT" || status === "PICKED_UP") return "bg-blue-100 text-blue-700"
    if (status === "FAILED") return "bg-red-100 text-red-700"
    return "bg-yellow-100 text-yellow-700"
  }

  if (!isAuthenticated || user?.userType !== 'SELLER') {
    return null
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SellerSidebar />
      <div className="flex-1">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Truck className="h-8 w-8 text-primary" />
              Quản lý vận chuyển
            </h1>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {shippingStats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="bg-white rounded-lg p-6 border">
                  <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
              )
            })}
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-3 font-semibold ${activeTab === "overview" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
                }`}
            >
              Tổng quan
            </button>
            <button
              onClick={() => setActiveTab("shipments")}
              className={`pb-3 font-semibold ${activeTab === "shipments" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
                }`}
            >
              Vận đơn
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`pb-3 font-semibold ${activeTab === "settings" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
                }`}
            >
              Cài đặt
            </button>
          </div>

          {/* Shipments Table */}
          {activeTab === "shipments" && (
            <div className="bg-white rounded-lg border overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">Đang tải vận đơn...</p>
                </div>
              ) : shipments.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">Chưa có vận đơn nào</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted border-b">
                      <th className="text-left px-6 py-3 font-semibold">Mã vận đơn</th>
                      <th className="text-left px-6 py-3 font-semibold">Khách hàng</th>
                      <th className="text-left px-6 py-3 font-semibold">Địa chỉ</th>
                      <th className="text-left px-6 py-3 font-semibold">Trạng thái</th>
                      <th className="text-left px-6 py-3 font-semibold">Ngày tạo</th>
                      <th className="text-right px-6 py-3 font-semibold">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipments.map((shipment) => (
                      <tr key={shipment.id} className="border-b hover:bg-muted/50">
                        <td className="px-6 py-3 font-mono text-sm">{shipment.trackingNumber}</td>
                        <td className="px-6 py-3">
                          <div>
                            <p className="font-medium">{shipment.recipientName}</p>
                            <p className="text-sm text-muted-foreground">{shipment.recipientPhone}</p>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-sm">
                          {shipment.recipientAddress}, {shipment.recipientWard}, {shipment.recipientDistrict}, {shipment.recipientProvince}
                        </td>
                        <td className="px-6 py-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(shipment.status)}`}>
                            {getStatusLabel(shipment.status)}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm text-muted-foreground">
                          {new Date(shipment.createdAt).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/seller/shipping/${shipment.id}`)}
                          >
                            Xem
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <ShippingSettingsTab />
          )}
        </div>
      </div>
    </div>
  )
}

function ShippingSettingsTab() {
  const [shippingMethods, setShippingMethods] = useState<any[]>([])
  const [selectedMethod, setSelectedMethod] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchShippingMethods()
  }, [])

  const fetchShippingMethods = async () => {
    try {
      setLoading(true)
      const response = await shippingApi.getShippingMethods()
      if (response.success && response.data) {
        setShippingMethods(response.data)
        const activeMethod = response.data.find((m: any) => m.isActive)
        if (activeMethod) {
          setSelectedMethod(activeMethod.id)
        }
      }
    } catch (error) {
      console.error('Failed to fetch shipping methods:', error)
      toast.error("Tải phương thức vận chuyển thất bại")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      if (!selectedMethod) {
        toast.error("Vui lòng chọn phương thức vận chuyển")
        return
      }
      await shippingApi.setDefaultShippingMethod(selectedMethod)
      toast.success("Lưu cài đặt thành công")
    } catch (error: any) {
      toast.error(error.message || "Lưu cài đặt thất bại")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-xl font-bold mb-6">Cài đặt vận chuyển</h2>
      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-semibold">Vận chuyển mặc định</p>
              <p className="text-sm text-muted-foreground">Chọn đối tác vận chuyển ưa thích</p>
            </div>
            <select
              className="px-4 py-2 border rounded-lg"
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
            >
              <option value="">Chọn phương thức</option>
              {shippingMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.name}
                </option>
              ))}
            </select>
          </div>
          <Button
            className="w-full"
            onClick={handleSave}
            disabled={saving || !selectedMethod}
          >
            {saving ? "Đang lưu..." : "Lưu cài đặt"}
          </Button>
        </div>
      )}
    </div>
  )
}
