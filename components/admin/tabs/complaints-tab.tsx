"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { adminApi } from '@/lib/api/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

interface ComplaintsTabProps {
  initialComplaints: any[]
}

export function ComplaintsTab({ initialComplaints }: ComplaintsTabProps) {
  const [items, setItems] = useState<any[]>(initialComplaints)
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const data = await adminApi.listComplaints()
      setItems(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialComplaints.length === 0) {
      load()
    }
  }, [])

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
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-2">{c.title}</td>
                  <td className="p-2">{c.category}</td>
                  <td className="p-2">
                    <Select
                      defaultValue={c.status}
                      onValueChange={async (v) => {
                        const updated = await adminApi.updateComplaintStatus(c.id, v as any)
                        setItems((prev) => prev.map((x) => (x.id === c.id ? updated : x)))
                        toast.success('Cập nhật trạng thái khiếu nại')
                      }}
                    >
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
                  <td className="p-2">
                    <Link href={`/admin/complaints/${c.id}`} className="text-primary text-sm hover:underline" prefetch={false}>
                      Chi tiết
                    </Link>
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


