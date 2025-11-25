"use client"

import { useState } from 'react'
import { adminApi, AdminUser } from '@/lib/api/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

interface UsersTabProps {
  initialUsers: AdminUser[]
}

export function UsersTab({ initialUsers }: UsersTabProps) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers)
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')

  const loadAll = async () => {
    try {
      setLoading(true)
      const usersData = await adminApi.listUsers()
      setUsers(usersData)
    } catch (e: any) {
      toast.error(e.message || 'Load users failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Users</CardTitle>
        <div className="flex gap-2">
          <Input placeholder="Tìm kiếm..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <Button
            variant="outline"
            onClick={async () => {
              const result = await adminApi.listUsers({ q: query })
              setUsers(result)
            }}
          >
            Tìm
          </Button>
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
                    <Select
                      defaultValue={u.userType}
                      onValueChange={async (v) => {
                        const updated = await adminApi.updateUserRole(u.id, v as any)
                        toast.success('Cập nhật vai trò thành công')
                        setUsers((prev) => prev.map((x) => (x.id === u.id ? updated : x)))
                      }}
                    >
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
                    <Select
                      defaultValue={u.status}
                      onValueChange={async (v) => {
                        const updated = await adminApi.updateUserStatus(u.id, v as any)
                        toast.success('Cập nhật trạng thái thành công')
                        setUsers((prev) => prev.map((x) => (x.id === u.id ? updated : x)))
                      }}
                    >
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
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        if (!confirm('Xóa user này?')) return
                        await adminApi.deleteUser(u.id)
                        setUsers((prev) => prev.filter((x) => x.id !== u.id))
                        toast.success('Đã xóa user')
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
        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            onClick={async () => {
              const email = prompt('Email user mới:')
              const name = prompt('Họ tên:')
              if (!email || !name) return
              const created = await adminApi.createUser({
                email,
                fullName: name,
                userType: 'CUSTOMER',
                status: 'ACTIVE',
              })
              setUsers((prev) => [created, ...prev])
              toast.success('Đã tạo user')
            }}
          >
            Tạo user nhanh
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


