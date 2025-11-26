"use client"

import { useState } from "react"
import { adminApi } from "@/lib/api/admin"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const STATUS_OPTIONS = ["OPEN", "IN_REVIEW", "RESOLVED", "REJECTED"]

interface AdminComplaintDetailClientProps {
  complaint: any
  initialMessages: any[]
}

export function AdminComplaintDetailClient({ complaint, initialMessages }: AdminComplaintDetailClientProps) {
  const [currentComplaint, setCurrentComplaint] = useState(complaint)
  const [messages, setMessages] = useState(initialMessages)
  const [content, setContent] = useState("")
  const [sending, setSending] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const handleStatusChange = async (status: string) => {
    try {
      setUpdatingStatus(true)
      const updated = await adminApi.updateComplaintStatus(currentComplaint.id, status as any)
      setCurrentComplaint(updated)
      toast.success("Đã cập nhật trạng thái khiếu nại")
    } catch (error: any) {
      toast.error(error?.message || "Không thể cập nhật trạng thái")
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleSend = async () => {
    if (!content.trim()) {
      toast.error("Nội dung không được để trống")
      return
    }
    try {
      setSending(true)
      const message = await adminApi.addComplaintMessage(currentComplaint.id, { content: content.trim() })
      setMessages((prev) => [...prev, message])
      setContent("")
      toast.success("Đã gửi phản hồi cho khách")
    } catch (error: any) {
      toast.error(error?.message || "Không thể gửi phản hồi")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border bg-white p-6 space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Mã yêu cầu</p>
            <p className="text-xl font-semibold">{currentComplaint.id}</p>
          </div>
          <Select defaultValue={currentComplaint.status} onValueChange={handleStatusChange} disabled={updatingStatus}>
            <SelectTrigger className="w-[220px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-4 text-sm text-muted-foreground md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide">Reporter</p>
            <p className="text-foreground font-medium">{currentComplaint.reporterId || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide">Seller/SellerId</p>
            <p className="text-foreground font-medium">{currentComplaint.targetId || "N/A"}</p>
          </div>
          {currentComplaint.orderId && (
            <div>
              <p className="text-xs uppercase tracking-wide">Đơn hàng</p>
              <p className="text-foreground font-medium">{currentComplaint.orderId}</p>
            </div>
          )}
          {currentComplaint.productId && (
            <div>
              <p className="text-xs uppercase tracking-wide">Sản phẩm</p>
              <p className="text-foreground font-medium">{currentComplaint.productId}</p>
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{currentComplaint.title}</p>
          <p className="text-sm text-muted-foreground whitespace-pre-line mt-1">{currentComplaint.content}</p>
        </div>
      </section>

      <section className="rounded-lg border bg-white p-6 space-y-4">
        <h2 className="text-lg font-semibold">Trao đổi với khách</h2>
        <div className="max-h-[420px] overflow-y-auto space-y-3 pr-2">
          {messages.length === 0 ? (
            <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
              Chưa có trao đổi nào
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "rounded-lg border px-4 py-2 text-sm",
                  msg.senderType === "ADMIN" ? "bg-primary/5 border-primary/20" : "bg-muted"
                )}
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{msg.senderType === "ADMIN" ? "Admin" : "Khách"}</span>
                  <span>{msg.createdAt ? new Date(msg.createdAt).toLocaleString("vi-VN") : ""}</span>
                </div>
                <p className="mt-2 text-foreground whitespace-pre-line">{msg.content}</p>
              </div>
            ))
          )}
        </div>
        <div className="space-y-3">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Nhập phản hồi tới khách..."
            rows={4}
          />
          <div className="flex justify-end">
            <Button onClick={handleSend} disabled={!content.trim() || sending}>
              {sending ? "Đang gửi..." : "Gửi phản hồi"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}



