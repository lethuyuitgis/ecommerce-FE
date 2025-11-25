"use client"

import { useState } from 'react'
import { adminApi, AdminSeller } from '@/lib/api/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

interface SellersTabProps {
  initialSellers: AdminSeller[]
}

export function SellersTab({ initialSellers }: SellersTabProps) {
  const [sellers, setSellers] = useState<AdminSeller[]>(initialSellers)
  const [loading, setLoading] = useState(false)

  const loadAll = async () => {
    try {
      setLoading(true)
      const sellersData = await adminApi.listSellers()
      setSellers(sellersData)
    } catch (e: any) {
      toast.error(e.message || 'Load sellers failed')
    } finally {
      setLoading(false)
    }
  }

  return (
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
                    <Select
                      defaultValue={s.status}
                      onValueChange={async (v) => {
                        const updated = await adminApi.updateSellerStatus(s.id, v as any)
                        toast.success('Cập nhật trạng thái thành công')
                        setSellers((prev) => prev.map((x) => (x.id === s.id ? updated : x)))
                      }}
                    >
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
  )
}


