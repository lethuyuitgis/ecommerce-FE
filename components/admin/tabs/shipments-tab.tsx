"use client"

import { useState } from 'react'
import { adminApi, AdminShipment, AdminSeller } from '@/lib/api/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ShipmentsTabProps {
  initialShipments: AdminShipment[]
  sellers: AdminSeller[]
}

export function ShipmentsTab({ initialShipments, sellers }: ShipmentsTabProps) {
  const [shipments, setShipments] = useState<AdminShipment[]>(initialShipments)
  const [loading, setLoading] = useState(false)

  const loadAll = async () => {
    try {
      setLoading(true)
      const shipmentsData = await adminApi.listShipments()
      setShipments(shipmentsData)
    } catch (e: any) {
      toast.error(e.message || 'Load shipments failed')
    } finally {
      setLoading(false)
    }
  }

  return (
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
              if (sellers.length === 0) {
                toast.error('Chưa có seller để tạo vận đơn')
                return
              }
              const sellerId = sellers[0].id
              const created = await adminApi.createShipment({
                id: '' as any,
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
              })
              toast.success('Tạo vận đơn thành công')
              setShipments((prev) => [created, ...prev])
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
  )
}


