"use client"

import { useState } from "react"
import { Search, Download, MessageSquare, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import Link from "next/link"

const customers = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0912345678",
    totalOrders: 15,
    totalSpent: 5200000,
    lastOrder: "2024-10-15",
    status: "VIP",
    avatar: "👨",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@email.com",
    phone: "0987654321",
    totalOrders: 8,
    totalSpent: 2100000,
    lastOrder: "2024-10-10",
    status: "Regular",
    avatar: "👩",
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "levanc@email.com",
    phone: "0901234567",
    totalOrders: 3,
    totalSpent: 890000,
    lastOrder: "2024-09-20",
    status: "New",
    avatar: "👨",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    email: "phamthid@email.com",
    phone: "0923456789",
    totalOrders: 22,
    totalSpent: 8500000,
    lastOrder: "2024-10-18",
    status: "VIP",
    avatar: "👩",
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    email: "hoangvane@email.com",
    phone: "0934567890",
    totalOrders: 5,
    totalSpent: 1500000,
    lastOrder: "2024-10-05",
    status: "Regular",
    avatar: "👨",
  },
]

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VIP":
        return "bg-amber-100 text-amber-800"
      case "Regular":
        return "bg-blue-100 text-blue-800"
      case "New":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Khách hàng</h1>
          <p className="text-muted-foreground mt-1">Quản lý và theo dõi khách hàng của bạn</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Download className="w-4 h-4 mr-2" />
          Xuất Excel
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Loại khách hàng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="VIP">VIP</SelectItem>
              <SelectItem value="Regular">Thường xuyên</SelectItem>
              <SelectItem value="New">Mới</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Tổng khách hàng</p>
          <p className="text-2xl font-bold text-foreground mt-2">{customers.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Khách VIP</p>
          <p className="text-2xl font-bold text-amber-600 mt-2">{customers.filter((c) => c.status === "VIP").length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Khách mới</p>
          <p className="text-2xl font-bold text-green-600 mt-2">{customers.filter((c) => c.status === "New").length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Doanh thu từ khách</p>
          <p className="text-2xl font-bold text-primary mt-2">
            {(customers.reduce((sum, c) => sum + c.totalSpent, 0) / 1000000).toFixed(1)}M
          </p>
        </Card>
      </div>

      {/* Customers Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Khách hàng</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Số điện thoại</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Đơn hàng</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Tổng chi tiêu</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Loại</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{customer.avatar}</div>
                      <div>
                        <p className="font-medium text-foreground">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">Mua lần cuối: {customer.lastOrder}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{customer.email}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{customer.phone}</td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{customer.totalOrders}</td>
                  <td className="px-6 py-4 text-sm font-medium text-primary">
                    {(customer.totalSpent / 1000000).toFixed(1)}M
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        customer.status,
                      )}`}
                    >
                      {customer.status === "VIP" && <Star className="w-3 h-3" />}
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link href={`/seller/customers/${customer.id}`}>
                        <Button variant="outline" size="sm" className="text-xs bg-transparent">
                          Chi tiết
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="text-xs bg-transparent">
                        <MessageSquare className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
