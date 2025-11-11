"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { promotionsApi } from "@/lib/api/promotions"

interface CreatePromotionDialogProps {
  children: React.ReactNode
}

export function CreatePromotionDialog({ children }: CreatePromotionDialogProps) {
  const [open, setOpen] = useState(false)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [name, setName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [type, setType] = useState<string>("percentage")
  const [value, setValue] = useState<string>("")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo Chương Trình Khuyến Mãi</DialogTitle>
          <DialogDescription>Thiết lập khuyến mãi cho sản phẩm của bạn</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="promo-name">Tên chương trình</Label>
            <Input id="promo-name" placeholder="VD: Flash Sale Cuối Tuần" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="promo-description">Mô tả</Label>
            <Textarea id="promo-description" placeholder="Mô tả chi tiết về chương trình khuyến mãi" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="promo-type">Loại giảm giá</Label>
              <Select defaultValue="percentage" onValueChange={setType}>
                <SelectTrigger id="promo-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Phần trăm (%)</SelectItem>
                  <SelectItem value="fixed">Số tiền cố định</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="promo-value">Giá trị</Label>
              <Input id="promo-value" type="number" placeholder="VD: 30" value={value} onChange={(e) => setValue(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ngày bắt đầu</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "dd/MM/yyyy") : "Chọn ngày"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Ngày kết thúc</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "dd/MM/yyyy") : "Chọn ngày"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="promo-products">Áp dụng cho sản phẩm</Label>
            <Select defaultValue="all">
              <SelectTrigger id="promo-products">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả sản phẩm</SelectItem>
                <SelectItem value="category">Theo danh mục</SelectItem>
                <SelectItem value="specific">Sản phẩm cụ thể</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button onClick={async () => {
            const payload = {
              name,
              description,
              promotionType: type === 'percentage' ? 'PERCENTAGE' : 'FIXED',
              discountValue: Number(value) || 0,
              startDate: startDate ? startDate.toISOString() : new Date().toISOString(),
              endDate: endDate ? endDate.toISOString() : new Date(Date.now() + 86400000).toISOString(),
              status: 'ACTIVE',
            }
            const resp = await promotionsApi.createPromotion(payload)
            if (resp.success) {
              setOpen(false)
              setName("")
              setDescription("")
              setType("percentage")
              setValue("")
              setStartDate(undefined)
              setEndDate(undefined)
            }
          }}>Tạo khuyến mãi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
