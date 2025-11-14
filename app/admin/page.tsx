'use client'

import { useEffect, useState } from 'react'
import { adminApi, AdminUser, AdminSeller, AdminShipment } from '@/lib/api/admin'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [sellers, setSellers] = useState<AdminSeller[]>([])
  const [shipments, setShipments] = useState<AdminShipment[]>([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')

  const loadAll = async () => {
    try {
      setLoading(true)
      const [u, s, sh] = await Promise.all([
        adminApi.listUsers(),
        adminApi.listSellers(),
        adminApi.listShipments(),
      ])
      if (u.success) setUsers(u.data)
      if (s.success) setSellers(s.data)
      if (sh.success) setShipments(sh.data)
    } catch (e: any) {
      toast.error(e.message || 'Load admin data failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Bảng điều khiển Admin</h1>
      <p className="mt-2 text-muted-foreground">Quản trị hệ thống, người dùng, người bán và vận đơn</p>

      <Tabs defaultValue="users" className="mt-6">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="sellers">Sellers</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="vouchers">Vouchers</TabsTrigger>
          <TabsTrigger value="complaints">Complaints</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Users</CardTitle>
              <div className="flex gap-2">
                <Input placeholder="Tìm kiếm..." value={query} onChange={(e) => setQuery(e.target.value)} />
                <Button variant="outline" onClick={async () => {
                  const res = await adminApi.listUsers({ q: query })
                  if (res.success) setUsers(res.data)
                }}>Tìm</Button>
                <Button onClick={loadAll} disabled={loading}>Làm mới</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left text-sm text-muted-foreground">
                      <th className="p-2">Email</th>
                      <th className="p-2">Họ tên</th>
                      <th className="p-2">Role</th>
                      <th className="p-2">Trạng thái</th>
                      <th className="p-2">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-t">
                        <td className="p-2">{u.email}</td>
                        <td className="p-2">{u.fullName}</td>
                        <td className="p-2">
                          <Select defaultValue={u.userType} onValueChange={async (v) => {
                            const res = await adminApi.updateUserRole(u.id, v as any)
                            if (res.success) {
                              toast.success('Cập nhật vai trò thành công')
                              setUsers((prev) => prev.map((x) => x.id === u.id ? res.data : x))
                            }
                          }}>
                            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="CUSTOMER">CUSTOMER</SelectItem>
                              <SelectItem value="SELLER">SELLER</SelectItem>
                              <SelectItem value="SHIPPER">SHIPPER</SelectItem>
                              <SelectItem value="ADMIN">ADMIN</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-2">
                          <Select defaultValue={u.status} onValueChange={async (v) => {
                            const res = await adminApi.updateUserStatus(u.id, v as any)
                            if (res.success) {
                              toast.success('Cập nhật trạng thái thành công')
                              setUsers((prev) => prev.map((x) => x.id === u.id ? res.data : x))
                            }
                          }}>
                            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                              <SelectItem value="SUSPENDED">SUSPENDED</SelectItem>
                              <SelectItem value="PENDING">PENDING</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-2 flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(u.id)}>Copy ID</Button>
                          <Button variant="destructive" size="sm" onClick={async () => {
                            if (!confirm('Xóa user này?')) return
                            const res = await adminApi.deleteUser(u.id)
                            if (res.success) {
                              setUsers((prev) => prev.filter((x) => x.id !== u.id))
                              toast.success('Đã xóa user')
                            }
                          }}>Xóa</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" onClick={async () => {
                  const email = prompt('Email user mới:')
                  const name = prompt('Họ tên:')
                  if (!email || !name) return
                  const res = await adminApi.createUser({ email, fullName: name, userType: 'CUSTOMER', status: 'ACTIVE' })
                  if (res.success) {
                    setUsers((prev) => [res.data, ...prev])
                    toast.success('Đã tạo user')
                  }
                }}>Tạo user nhanh</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sellers" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Sellers</CardTitle>
              <Button onClick={loadAll} disabled={loading}>Làm mới</Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left text-sm text-muted-foreground">
                      <th className="p-2">Shop</th>
                      <th className="p-2">Slug</th>
                      <th className="p-2">Trạng thái</th>
                      <th className="p-2">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellers.map((s) => (
                      <tr key={s.id} className="border-t">
                        <td className="p-2">{s.shopName}</td>
                        <td className="p-2">{s.slug}</td>
                        <td className="p-2">
                          <Select defaultValue={s.status} onValueChange={async (v) => {
                            const res = await adminApi.updateSellerStatus(s.id, v as any)
                            if (res.success) {
                              toast.success('Cập nhật trạng thái thành công')
                              setSellers((prev) => prev.map((x) => x.id === s.id ? res.data : x))
                            }
                          }}>
                            <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="DRAFT">DRAFT</SelectItem>
                              <SelectItem value="PENDING_REVIEW">PENDING_REVIEW</SelectItem>
                              <SelectItem value="APPROVED">APPROVED</SelectItem>
                              <SelectItem value="SUSPENDED">SUSPENDED</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-2">
                          <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(s.id)}>Copy ID</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipments" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Shipments</CardTitle>
              <Button onClick={loadAll} disabled={loading}>Làm mới</Button>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex gap-2">
                <Button
                  variant="outline"
                  onClick={async () => {
                    // Quick create a mock shipment for demo
                    if (sellers.length === 0) {
                      toast.error('Chưa có seller để tạo vận đơn')
                      return
                    }
                    const sellerId = sellers[0].id
                    const res = await adminApi.createShipment({
                      id: '', // ignored by API
                      orderId: crypto.randomUUID(),
                      sellerId,
                      shipperId: null,
                      trackingNumber: '',
                      status: 'READY_FOR_PICKUP',
                      pickupAddress: { name: sellers[0].shopName, address: 'HCMC' },
                      deliveryAddress: { name: 'Khách hàng', address: 'HN' },
                      packageWeight: 1.0,
                      packageSize: 'S',
                      codAmount: 100000,
                      notes: 'Tạo nhanh',
                      createdAt: '',
                      updatedAt: '',
                    } as any)
                    if (res.success) {
                      toast.success('Tạo vận đơn thành công')
                      setShipments((prev) => [res.data, ...prev])
                    }
                  }}
                >
                  Tạo vận đơn nhanh
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left text-sm text-muted-foreground">
                      <th className="p-2">Tracking</th>
                      <th className="p-2">Status</th>
                      <th className="p-2">Seller</th>
                      <th className="p-2">Shipper</th>
                      <th className="p-2">COD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipments.map((sh) => (
                      <tr key={sh.id} className="border-t">
                        <td className="p-2">{sh.trackingNumber}</td>
                        <td className="p-2">{sh.status}</td>
                        <td className="p-2">{sh.sellerId.slice(0, 8)}…</td>
                        <td className="p-2">{sh.shipperId ? sh.shipperId.slice(0, 8) + '…' : '-'}</td>
                        <td className="p-2">{(sh.codAmount ?? 0).toLocaleString('vi-VN')}₫</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vouchers" className="mt-4">
          <VoucherTab />
        </TabsContent>

        <TabsContent value="complaints" className="mt-4">
          <ComplaintsTab />
        </TabsContent>

        <TabsContent value="system" className="mt-4">
          <SystemTab />
        </TabsContent>
      </Tabs>
    </main>
  )
}

function VoucherTab() {
  const [items, setItems] = useState<import('@/lib/api/admin').AdminVoucher[]>([])
  const [loading, setLoading] = useState(false)
  const [q, setQ] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const res = await adminApi.listVouchers()
      if (res.success) setItems(res.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Vouchers</CardTitle>
        <div className="flex gap-2">
          <Input placeholder="Tìm..." value={q} onChange={(e) => setQ(e.target.value)} />
          <Button variant="outline" onClick={async () => {
            const res = await adminApi.listVouchers({ q })
            if (res.success) setItems(res.data)
          }}>
            Tìm
          </Button>
          <Button onClick={load} disabled={loading}>Làm mới</Button>
          <Button variant="outline" onClick={async () => {
            const res = await adminApi.createVoucher({
              code: 'NEW' + Math.floor(Math.random() * 1000),
              description: 'Auto created',
              type: 'PERCENTAGE',
              value: 5,
              maxDiscount: 30000,
              minOrderValue: 150000,
              usageLimit: 100,
              usedCount: 0,
              startDate: new Date().toISOString(),
              endDate: null,
              status: 'ACTIVE',
              createdAt: '',
              updatedAt: '',
            } as any)
            if (res.success) {
              toast.success('Đã tạo voucher')
              setItems((prev) => [res.data, ...prev])
            }
          }}>
            Tạo nhanh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-sm text-muted-foreground">
                <th className="p-2">Code</th>
                <th className="p-2">Type</th>
                <th className="p-2">Value</th>
                <th className="p-2">Status</th>
                <th className="p-2">Used/Limit</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((v) => (
                <tr key={v.id} className="border-t">
                  <td className="p-2">{v.code}</td>
                  <td className="p-2">{v.type}</td>
                  <td className="p-2">{v.type === 'PERCENTAGE' ? `${v.value}%` : `${v.value.toLocaleString('vi-VN')}₫`}</td>
                  <td className="p-2">
                    <Select defaultValue={v.status} onValueChange={async (val) => {
                      const res = await adminApi.updateVoucher(v.id, { status: val as any })
                      if (res.success) {
                        toast.success('Cập nhật trạng thái thành công')
                        setItems((prev) => prev.map((x) => x.id === v.id ? res.data : x))
                      }
                    }}>
                      <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                        <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                        <SelectItem value="SCHEDULED">SCHEDULED</SelectItem>
                        <SelectItem value="EXPIRED">EXPIRED</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-2">{v.usedCount}/{v.usageLimit}</td>
                  <td className="p-2">
                    <Button variant="destructive" size="sm" onClick={async () => {
                      const ok = confirm(`Xóa voucher ${v.code}?`)
                      if (!ok) return
                      const res = await adminApi.deleteVoucher(v.id)
                      if (res.success) {
                        toast.success('Đã xóa')
                        setItems((prev) => prev.filter((x) => x.id !== v.id))
                      }
                    }}>Xóa</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

function ComplaintsTab() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await adminApi.listComplaints()
      if (res.success) setItems(res.data)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Complaints</CardTitle>
        <Button onClick={load} disabled={loading}>Làm mới</Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-sm text-muted-foreground">
                <th className="p-2">Tiêu đề</th>
                <th className="p-2">Danh mục</th>
                <th className="p-2">Trạng thái</th>
                <th className="p-2">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-2">{c.title}</td>
                  <td className="p-2">{c.category}</td>
                  <td className="p-2">
                    <Select defaultValue={c.status} onValueChange={async (v) => {
                      const res = await adminApi.updateComplaintStatus(c.id, v as any)
                      if (res.success) {
                        setItems((prev) => prev.map((x) => x.id === c.id ? res.data : x))
                        toast.success('Cập nhật trạng thái khiếu nại')
                      }
                    }}>
                      <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OPEN">OPEN</SelectItem>
                        <SelectItem value="IN_REVIEW">IN_REVIEW</SelectItem>
                        <SelectItem value="RESOLVED">RESOLVED</SelectItem>
                        <SelectItem value="REJECTED">REJECTED</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-2">{new Date(c.createdAt).toLocaleString('vi-VN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

function SystemTab() {
  const [metrics, setMetrics] = useState<{ startedAt: string; requestCount: number; errorCount: number; avgResponseMs: number } | null>(null)
  useEffect(() => {
    adminApi.getSystemMetrics().then((res) => {
      if (res.success) setMetrics(res.data)
    })
  }, [])
  return (
    <Card>
      <CardHeader><CardTitle>System Metrics</CardTitle></CardHeader>
      <CardContent>
        {!metrics ? (
          <div className="text-muted-foreground">Đang tải…</div>
        ) : (
          <div className="grid md:grid-cols-4 gap-4">
            <div className="rounded-md border p-4">
              <div className="text-sm text-muted-foreground">Started At</div>
              <div className="text-lg font-medium">{new Date(metrics.startedAt).toLocaleString('vi-VN')}</div>
            </div>
            <div className="rounded-md border p-4">
              <div className="text-sm text-muted-foreground">Requests</div>
              <div className="text-lg font-medium">{metrics.requestCount}</div>
            </div>
            <div className="rounded-md border p-4">
              <div className="text-sm text-muted-foreground">Errors</div>
              <div className="text-lg font-medium">{metrics.errorCount}</div>
            </div>
            <div className="rounded-md border p-4">
              <div className="text-sm text-muted-foreground">Avg Response (ms)</div>
              <div className="text-lg font-medium">{metrics.avgResponseMs}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
