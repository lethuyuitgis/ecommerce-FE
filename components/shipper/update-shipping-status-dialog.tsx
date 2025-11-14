"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface UpdateShippingStatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentStatus: string
  onUpdate: (status: string, location?: string, description?: string, failureReason?: string) => Promise<void>
}

export function UpdateShippingStatusDialog({
  open,
  onOpenChange,
  currentStatus,
  onUpdate,
}: UpdateShippingStatusDialogProps) {
  const [status, setStatus] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [failureReason, setFailureReason] = useState("")
  const [loading, setLoading] = useState(false)

  const getNextStatusOptions = () => {
    const statusLower = currentStatus.toLowerCase()
    const options = []

    if (statusLower.includes("pending") || statusLower.includes("chờ")) {
      options.push({ value: "PICKED_UP", label: "Đã lấy hàng" })
    }
    if (statusLower.includes("picked") || statusLower.includes("đã lấy")) {
      options.push({ value: "IN_TRANSIT", label: "Đang vận chuyển" })
    }
    if (statusLower.includes("transit") || statusLower.includes("vận chuyển")) {
      options.push({ value: "OUT_FOR_DELIVERY", label: "Đang giao hàng" })
    }
    if (statusLower.includes("delivery") || statusLower.includes("giao")) {
      options.push(
        { value: "DELIVERED", label: "Đã giao hàng" },
        { value: "FAILED", label: "Giao hàng thất bại" }
      )
    }

    return options.length > 0 ? options : [
      { value: "PICKED_UP", label: "Đã lấy hàng" },
      { value: "IN_TRANSIT", label: "Đang vận chuyển" },
      { value: "OUT_FOR_DELIVERY", label: "Đang giao hàng" },
      { value: "DELIVERED", label: "Đã giao hàng" },
      { value: "FAILED", label: "Giao hàng thất bại" },
    ]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!status) return

    setLoading(true)
    try {
      await onUpdate(
        status,
        location || undefined,
        description || undefined,
        status === "FAILED" ? failureReason || undefined : undefined
      )
      // Reset form
      setStatus("")
      setLocation("")
      setDescription("")
      setFailureReason("")
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setLoading(false)
    }
  }

  const showFailureReason = status === "FAILED"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cập nhật trạng thái vận chuyển</DialogTitle>
          <DialogDescription>
            Cập nhật trạng thái vận chuyển cho đơn hàng này
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái *</Label>
              <Select value={status} onValueChange={setStatus} required>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {getNextStatusOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Vị trí hiện tại</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Nhập vị trí hiện tại"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả (tùy chọn)"
                rows={3}
              />
            </div>

            {showFailureReason && (
              <div className="space-y-2">
                <Label htmlFor="failureReason">Lý do thất bại *</Label>
                <Select value={failureReason} onValueChange={setFailureReason} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn lý do" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CUSTOMER_NOT_AVAILABLE">Khách hàng không có mặt</SelectItem>
                    <SelectItem value="WRONG_ADDRESS">Sai địa chỉ</SelectItem>
                    <SelectItem value="REFUSED">Khách hàng từ chối</SelectItem>
                    <SelectItem value="OTHER">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading || !status}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cập nhật
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}


