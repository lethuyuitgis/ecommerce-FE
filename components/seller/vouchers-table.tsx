"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Copy } from "lucide-react"

const mockVouchers = [
  {
    id: "1",
    code: "WELCOME2024",
    type: "percentage",
    value: 15,
    minOrder: 200000,
    maxDiscount: 50000,
    quantity: 1000,
    used: 234,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    status: "active",
  },
  {
    id: "2",
    code: "FREESHIP50K",
    type: "shipping",
    value: 50000,
    minOrder: 0,
    maxDiscount: 50000,
    quantity: 500,
    used: 456,
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    status: "active",
  },
  {
    id: "3",
    code: "NEWYEAR100K",
    type: "fixed",
    value: 100000,
    minOrder: 500000,
    maxDiscount: 100000,
    quantity: 200,
    used: 89,
    startDate: "2024-01-01",
    endDate: "2024-01-15",
    status: "active",
  },
  {
    id: "4",
    code: "SUMMER2023",
    type: "percentage",
    value: 25,
    minOrder: 300000,
    maxDiscount: 100000,
    quantity: 500,
    used: 500,
    startDate: "2023-06-01",
    endDate: "2023-08-31",
    status: "expired",
  },
]

export function VouchersTable() {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const formatValue = (type: string, value: number) => {
    if (type === "percentage") {
      return `${value}%`
    }
    return formatPrice(value)
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "percentage":
        return <Badge variant="outline">Phần trăm</Badge>
      case "fixed":
        return <Badge variant="outline">Số tiền</Badge>
      case "shipping":
        return <Badge variant="outline">Miễn ship</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const getStatusBadge = (status: string, used: number, quantity: number) => {
    if (used >= quantity) {
      return <Badge variant="secondary">Đã hết</Badge>
    }
    switch (status) {
      case "active":
        return <Badge variant="default">Đang chạy</Badge>
      case "expired":
        return <Badge variant="secondary">Đã kết thúc</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã voucher</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Giá trị</TableHead>
            <TableHead>Đơn tối thiểu</TableHead>
            <TableHead className="text-right">Số lượng</TableHead>
            <TableHead className="text-right">Đã dùng</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockVouchers.map((voucher) => (
            <TableRow key={voucher.id}>
              <TableCell>
                <div className="font-mono font-bold text-primary">{voucher.code}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {voucher.startDate} - {voucher.endDate}
                </div>
              </TableCell>
              <TableCell>{getTypeBadge(voucher.type)}</TableCell>
              <TableCell className="font-medium">{formatValue(voucher.type, voucher.value)}</TableCell>
              <TableCell>{voucher.minOrder > 0 ? formatPrice(voucher.minOrder) : "Không"}</TableCell>
              <TableCell className="text-right">{voucher.quantity}</TableCell>
              <TableCell className="text-right">
                <span className={voucher.used >= voucher.quantity ? "text-destructive font-medium" : ""}>
                  {voucher.used}
                </span>
              </TableCell>
              <TableCell>{getStatusBadge(voucher.status, voucher.used, voucher.quantity)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="h-4 w-4 mr-2" />
                      Sao chép mã
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
