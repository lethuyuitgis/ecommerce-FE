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
import { MoreHorizontal, Edit, Trash2, Copy } from "lucide-react"
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
import { adminApi, AdminVoucher } from "@/lib/api/admin"
import { toast } from "sonner"

const formatCurrency = (value?: number | null) => {
  if (!value) return "0₫"
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)
}

const formatValue = (type?: string, value?: number | null) => {
  if (!type || value == null) return "-"
  if (type.toUpperCase() === "PERCENTAGE") {
    return `${value}%`
  }
  return formatCurrency(value)
}

const formatDate = (iso?: string | null) => {
  if (!iso) return "-"
  try {
    return new Date(iso).toLocaleDateString("vi-VN")
  } catch {
    return iso
  }
}

const statusBadge = (status?: string, used?: number | null, limit?: number | null) => {
  if (used != null && limit != null && used >= limit) {
    return <Badge variant="secondary">Đã hết</Badge>
  }
  switch ((status || "").toUpperCase()) {
    case "ACTIVE":
      return <Badge variant="default">Đang chạy</Badge>
    case "INACTIVE":
      return <Badge variant="secondary">Tạm dừng</Badge>
    case "SCHEDULED":
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Đã lên lịch</Badge>
    case "EXPIRED":
      return <Badge variant="secondary">Đã kết thúc</Badge>
    default:
      return <Badge variant="outline">{status || "UNKNOWN"}</Badge>
  }
}

export function VouchersTable() {
  const [items, setItems] = useState<AdminVoucher[]>([])
  const [deleteVoucher, setDeleteVoucher] = useState<AdminVoucher | null>(null)

  const load = async () => {
    const res = await adminApi.listVouchers()
    if (res.success && res.data) {
      setItems(res.data)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <>
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
              <TableHead>Thời gian</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((voucher) => (
              <TableRow key={voucher.id}>
                <TableCell>
                  <div className="font-mono font-bold text-primary">{voucher.code}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{voucher.type}</Badge>
                </TableCell>
                <TableCell className="font-medium">{formatValue(voucher.type, voucher.value)}</TableCell>
                <TableCell>{voucher.minOrderValue ? formatCurrency(voucher.minOrderValue) : "Không"}</TableCell>
                <TableCell className="text-right">{voucher.usageLimit ?? "-"}</TableCell>
                <TableCell className="text-right">{voucher.usedCount ?? 0}</TableCell>
                <TableCell>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(voucher.startDate)} - {formatDate(voucher.endDate)}
                  </div>
                </TableCell>
                <TableCell>{statusBadge(voucher.status, voucher.usedCount, voucher.usageLimit)}</TableCell>
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
                      <DropdownMenuItem
                        onClick={() => navigator.clipboard.writeText(voucher.code)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Sao chép mã
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => setDeleteVoucher(voucher)}>
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
      <AlertDialog open={!!deleteVoucher} onOpenChange={(open) => { if (!open) setDeleteVoucher(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa voucher?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn chắc chắn muốn xóa mã "{deleteVoucher?.code}"? Hành động không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline">Hủy</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                className="text-destructive"
                onClick={async () => {
                  if (!deleteVoucher) return
                  const res = await adminApi.deleteVoucher(deleteVoucher.id)
                  if (res.success) {
                    toast.success("Đã xóa voucher")
                    setItems((prev) => prev.filter((v) => v.id !== deleteVoucher.id))
                  } else {
                    toast.error(res.message || "Xóa thất bại")
                  }
                  setDeleteVoucher(null)
                }}
              >
                Xóa
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
