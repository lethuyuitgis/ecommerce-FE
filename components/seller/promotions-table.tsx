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
import { MoreHorizontal, Edit, Trash2, Copy, Eye, EyeOff } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"

const mockPromotions = [
  {
    id: "1",
    name: "Flash Sale Cuối Tuần",
    type: "percentage",
    value: 30,
    startDate: "2024-01-10",
    endDate: "2024-01-12",
    products: 25,
    used: 156,
    status: "active",
  },
  {
    id: "2",
    name: "Giảm Giá Mùa Hè",
    type: "fixed",
    value: 100000,
    startDate: "2024-01-05",
    endDate: "2024-01-31",
    products: 50,
    used: 89,
    status: "active",
  },
  {
    id: "3",
    name: "Khuyến Mãi Tết",
    type: "percentage",
    value: 20,
    startDate: "2024-02-01",
    endDate: "2024-02-15",
    products: 100,
    used: 0,
    status: "scheduled",
  },
  {
    id: "4",
    name: "Black Friday",
    type: "percentage",
    value: 50,
    startDate: "2023-11-24",
    endDate: "2023-11-26",
    products: 80,
    used: 456,
    status: "expired",
  },
]

export function PromotionsTable() {
  const [deletePromo, setDeletePromo] = useState<any>(null)
  const formatValue = (type: string, value: number) => {
    if (type === "percentage") {
      return `${value}%`
    }
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Đang chạy</Badge>
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Đã lên lịch</Badge>
      case "expired":
        return <Badge variant="secondary">Đã kết thúc</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên chương trình</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Giá trị</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead className="text-right">Sản phẩm</TableHead>
              <TableHead className="text-right">Đã dùng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPromotions.map((promo) => (
              <TableRow key={promo.id}>
                <TableCell className="font-medium">{promo.name}</TableCell>
                <TableCell>{promo.type === "percentage" ? "Phần trăm" : "Số tiền"}</TableCell>
                <TableCell className="font-medium">{formatValue(promo.type, promo.value)}</TableCell>
                <TableCell className="text-sm">
                  <div>{promo.startDate}</div>
                  <div className="text-muted-foreground">đến {promo.endDate}</div>
                </TableCell>
                <TableCell className="text-right">{promo.products}</TableCell>
                <TableCell className="text-right">{promo.used}</TableCell>
                <TableCell>{getStatusBadge(promo.status)}</TableCell>
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
                        Sao chép
                      </DropdownMenuItem>
                      {promo.status === "active" ? (
                        <DropdownMenuItem>
                          <EyeOff className="h-4 w-4 mr-2" />
                          Tạm dừng
                        </DropdownMenuItem>
                      ) : promo.status === "scheduled" ? (
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Kích hoạt ngay
                        </DropdownMenuItem>
                      ) : null}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => setDeletePromo(promo)}>
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
      <AlertDialog open={!!deletePromo} onOpenChange={(open) => { if (!open) setDeletePromo(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa khuyến mãi?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn chắc chắn muốn xóa "{deletePromo?.name}"? Hành động không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline">Hủy</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button className="text-destructive" onClick={() => setDeletePromo(null)}>
                Xóa
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
