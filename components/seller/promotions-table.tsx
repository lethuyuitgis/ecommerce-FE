"use client"

import { useEffect, useState } from "react"
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
import { promotionsApi, Promotion } from "@/lib/api/promotions"

export function PromotionsTable() {
  const [items, setItems] = useState<Promotion[]>([])
  const [deletePromo, setDeletePromo] = useState<Promotion | null>(null)

  useEffect(() => {
    const load = async () => {
      const res = await promotionsApi.getSellerPromotions(0, 50)
      if (res.success && res.data) {
        setItems(res.data.content || [])
      }
    }
    load()
  }, [])

  const formatValue = (type: string, value: number) => {
    if ((type || '').toLowerCase().includes("percent")) {
      return `${value}%`
    }
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value)
  }

  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase()
    if (s === "active") return <Badge variant="default">Đang chạy</Badge>
    if (s === "scheduled") return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Đã lên lịch</Badge>
    if (s === "expired") return <Badge variant="secondary">Đã kết thúc</Badge>
    return <Badge variant="outline">{status}</Badge>
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
              <TableHead className="text-right">Giới hạn</TableHead>
              <TableHead className="text-right">Đã dùng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((promo) => (
              <TableRow key={promo.id}>
                <TableCell className="font-medium">{promo.name}</TableCell>
                <TableCell>{promo.promotionType === "PERCENTAGE" ? "Phần trăm" : "Số tiền"}</TableCell>
                <TableCell className="font-medium">{formatValue(promo.promotionType, promo.discountValue)}</TableCell>
                <TableCell className="text-sm">
                  <div>{new Date(promo.startDate).toLocaleDateString("vi-VN")}</div>
                  <div className="text-muted-foreground">đến {new Date(promo.endDate).toLocaleDateString("vi-VN")}</div>
                </TableCell>
                <TableCell className="text-right">{promo.quantityLimit ?? '-'}</TableCell>
                <TableCell className="text-right">{promo.quantityUsed ?? 0}</TableCell>
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
                      {String(promo.status).toLowerCase() === "active" ? (
                        <DropdownMenuItem>
                          <EyeOff className="h-4 w-4 mr-2" />
                          Tạm dừng
                        </DropdownMenuItem>
                      ) : String(promo.status).toLowerCase() === "scheduled" ? (
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
