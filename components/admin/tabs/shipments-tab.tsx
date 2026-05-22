"use client"

import { useState, useEffect } from 'react'
import { adminApi, AdminShipment, AdminSeller } from '@/lib/api/admin'
import { logisticsApi, ShippingHub, TrackingUpdate } from '@/lib/api/logistics'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { 
  Search, 
  RefreshCcw, 
  MapPin, 
  Truck, 
  Package, 
  History, 
  ExternalLink,
  ChevronRight,
  MoreVertical,
  Plus
} from 'lucide-react'
import { ShipmentStatusBadge } from '../shipment-status-badge'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/popover' // Using Popover/Dialog pattern
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'

interface ShipmentsTabProps {
  initialShipments: AdminShipment[]
  sellers: AdminSeller[]
}

export function ShipmentsTab({ initialShipments, sellers }: ShipmentsTabProps) {
  const [shipments, setShipments] = useState<AdminShipment[]>(initialShipments)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [hubs, setHubs] = useState<ShippingHub[]>([])
  
  // Modal states
  const [selectedShipment, setSelectedShipment] = useState<AdminShipment | null>(null)
  const [history, setHistory] = useState<TrackingUpdate[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  useEffect(() => {
    logisticsApi.getHubs().then(res => {
      if (res.success && res.data) setHubs(res.data)
    })
  }, [])

  const loadAll = async () => {
    try {
      setLoading(true)
      const shipmentsData = await adminApi.listShipments()
      setShipments(shipmentsData)
    } catch (e: any) {
      toast.error(e.message || 'Lỗi khi tải danh sách vận chuyển')
    } finally {
      setLoading(false)
    }
  }

  const handleShowHistory = async (sh: AdminShipment) => {
    setSelectedShipment(sh)
    setLoadingHistory(true)
    try {
      const res = await logisticsApi.getHistory(sh.id)
      if (res.success && res.data) setHistory(res.data)
    } catch (e) {
      toast.error('Không thể tải lịch sử hành trình')
    } finally {
      setLoadingHistory(false)
    }
  }

  const handleAssignHub = async (shipmentId: string, hubId: string) => {
    try {
      const res = await logisticsApi.assignToHub(shipmentId, hubId)
      if (res.success) {
        toast.success('Đã điều chuyển đến kho mới')
        loadAll()
      }
    } catch (e) {
      toast.error('Lỗi khi điều chuyển kho')
    }
  }

  const filtered = shipments.filter(s => {
    const matchesSearch = s.trackingNumber.toLowerCase().includes(search.toLowerCase()) || 
                          s.orderId.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'ALL' || s.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <div>
            <CardTitle className="text-2xl font-bold">Quản lý Vận chuyển</CardTitle>
            <CardDescription>Theo dõi và điều phối toàn bộ hành trình đơn hàng</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadAll} disabled={loading}>
              <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Tạo vận đơn
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Tìm mã vận đơn, mã đơn hàng..." 
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 shrink-0 overflow-x-auto pb-1">
              {['ALL', 'READY_FOR_PICKUP', 'IN_TRANSIT', 'ARRIVED_HUB', 'DELIVERED', 'FAILED'].map((st) => (
                <Button 
                  key={st}
                  variant={filter === st ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(st)}
                  className="whitespace-nowrap"
                >
                  {st === 'ALL' ? 'Tất cả' : st}
                </Button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 text-muted-foreground font-medium border-b">
                  <th className="p-4 text-left">Vận đơn / Đơn hàng</th>
                  <th className="p-4 text-left">Trạng thái</th>
                  <th className="p-4 text-left text-center">Tiến độ</th>
                  <th className="p-4 text-left">Đối tác / Shipper</th>
                  <th className="p-4 text-left">COD</th>
                  <th className="p-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((sh) => (
                  <tr key={sh.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-primary flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          {sh.trackingNumber || 'CHƯA_TẠO'}
                        </span>
                        <span className="text-xs text-muted-foreground">Order: {sh.orderId.slice(0, 12)}...</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <ShipmentStatusBadge status={sh.status} />
                    </td>
                    <td className="p-4">
                       <div className="flex items-center justify-center">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4].map((step) => {
                              const isActive = getStepLevel(sh.status) >= step
                              return (
                                <div 
                                  key={step} 
                                  className={`h-1.5 w-6 rounded-full ${isActive ? 'bg-primary' : 'bg-muted'}`} 
                                />
                              )
                            })}
                          </div>
                       </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1 font-medium">
                          <Truck className="h-3 w-3" />
                          {sh.shipperId ? 'Partner Shipper' : 'Chưa gán'}
                        </div>
                        <span className="text-xs text-muted-foreground">{sh.shipperId?.slice(0, 8) || '---'}</span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-orange-600">
                      {(sh.codAmount ?? 0).toLocaleString('vi-VN')}₫
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleShowHistory(sh)}>
                            <History className="h-4 w-4 mr-2" />
                            Xem hành trình
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Chi tiết đơn hàng
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {hubs.length > 0 && (
                            <>
                              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase">Điều chuyển kho</div>
                              {hubs.map(hub => (
                                <DropdownMenuItem key={hub.id} onClick={() => handleAssignHub(sh.id, hub.id)}>
                                  <MapPin className="h-4 w-4 mr-2" />
                                  Gửi đến {hub.name}
                                </DropdownMenuItem>
                              ))}
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-20 text-center text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Không tìm thấy vận đơn nào phù hợp</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* History Dialog Mockup (Overlay) */}
      {selectedShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg bg-background rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-6 border-b flex justify-between items-center bg-muted/20">
              <div>
                <h3 className="font-bold text-lg">Hành trình chi tiết</h3>
                <p className="text-xs text-muted-foreground">Mã: {selectedShipment.trackingNumber}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedShipment(null)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {loadingHistory ? (
                <div className="flex justify-center p-12">
                  <RefreshCcw className="animate-spin h-8 w-8 text-muted-foreground" />
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">Chưa có dữ liệu hành trình</div>
              ) : (
                <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:h-full before:w-[2px] before:bg-muted">
                  {history.map((step, idx) => (
                    <div key={step.id} className="relative pl-8">
                      <div className={`absolute left-0 top-1 h-6 w-6 rounded-full border-4 border-background ${idx === 0 ? 'bg-primary scale-125' : 'bg-muted-foreground/30'}`} />
                      <div className="flex flex-col">
                        <span className={`text-sm font-bold ${idx === 0 ? 'text-primary' : ''}`}>{step.status}</span>
                        <span className="text-xs font-semibold flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {step.location}
                        </span>
                        <p className="text-sm text-muted-foreground mt-2 bg-muted/30 p-2 rounded">{step.description}</p>
                        <span className="text-[10px] text-muted-foreground mt-1">
                          {new Date(step.timestamp).toLocaleString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t bg-muted/10 flex justify-end">
              <Button onClick={() => setSelectedShipment(null)}>Đóng</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function getStepLevel(status: string): number {
  const s = status.toUpperCase()
  if (s === 'DELIVERED') return 4
  if (s === 'OUT_FOR_DELIVERY') return 3
  if (s === 'ARRIVED_HUB' || s === 'IN_TRANSIT') return 2
  if (s === 'PICKED_UP' || s === 'READY_FOR_PICKUP') return 1
  return 0
}


