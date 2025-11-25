"use client"

import { useState, useEffect } from 'react'
import { adminApi, AdminVoucher } from '@/lib/api/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

interface VouchersTabProps {
  initialVouchers: AdminVoucher[]
}

export function VouchersTab({ initialVouchers }: VouchersTabProps) {
  const [items, setItems] = useState<AdminVoucher[]>(initialVouchers)
  const [loading, setLoading] = useState(false)
  const [q, setQ] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const data = await adminApi.listVouchers()
      setItems(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialVouchers.length === 0) {
      load()
    }
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Vouchers</CardTitle>
        <div className="flex gap-2">
          <Input placeholder="Tìm..." value={q} onChange={(e) => setQ(e.target.value)} />
          <Button
            variant="outline"
            onClick={async () => {
              const data = await adminApi.listVouchers({ q })
              setItems(data)
            }}
          >
            Tìm
          </Button>
          <Button onClick={load} disabled={loading}>Làm mới</Button>
          <Button
            variant="outline"
            onClick={async () => {
              const created = await adminApi.createVoucher({
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
              toast.success('Đã tạo voucher')
              setItems((prev) => [created, ...prev])
            }}
          >
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
                    <Select
                      defaultValue={v.status}
                      onValueChange={async (val) => {
                        const updated = await adminApi.updateVoucher(v.id, { status: val as any })
                        toast.success('Cập nhật trạng thái thành công')
                        setItems((prev) => prev.map((x) => (x.id === v.id ? updated : x)))
                      }}
                    >
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
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        const ok = confirm(`Xóa voucher ${v.code}?`)
                        if (!ok) return
                        await adminApi.deleteVoucher(v.id)
                        toast.success('Đã xóa')
                        setItems((prev) => prev.filter((x) => x.id !== v.id))
                      }}
                    >
                      Xóa
                    </Button>
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


