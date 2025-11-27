"use client"

import { useState } from "react"
import { complaintsApi, type Complaint, type ComplaintMessage } from "@/lib/api/complaints"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ComplaintDetailClientProps {
  complaint: Complaint
  initialMessages: ComplaintMessage[]
  allowCancel?: boolean
}

const STATUS_BADGES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  OPEN: "bg-amber-100 text-amber-800",
  IN_REVIEW: "bg-indigo-100 text-indigo-800",
  RESOLVED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-rose-100 text-rose-800",
  CANCELLED: "bg-gray-100 text-gray-600",
}

export function ComplaintDetailClient({ complaint, initialMessages, allowCancel = true }: ComplaintDetailClientProps) {
  const [messages, setMessages] = useState<ComplaintMessage[]>(initialMessages)
  const [content, setContent] = useState("")
  const [sending, setSending] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [status, setStatus] = useState(complaint.status || "PENDING")

  const canSend = content.trim().length >= 5
  const isClosed = ["RESOLVED", "REJECTED", "CANCELLED"].includes(status ?? "")

  const handleSend = async () => {
    if (!canSend) {
      toast.error("Nội dung tối thiểu 5 ký tự")
      return
    }
    try {
      setSending(true)
      const message = await complaintsApi.addMessage(complaint.id, { content: content.trim() })
      setMessages((prev) => [...prev, message])
      setContent("")
      toast.success("Đã gửi phản hồi cho admin")
    } catch (error: any) {
      toast.error(error?.message || "Không thể gửi tin nhắn")
    } finally {
      setSending(false)
    }
  }

  const handleCancel = async () => {
    if (!allowCancel || isClosed) return
    if (!confirm("Bạn chắc chắn muốn hủy khiếu nại này?")) return
    try {
      setCancelling(true)
      const updated = await complaintsApi.cancel(complaint.id)
      setStatus(updated.status || "CANCELLED")
      toast.success("Đã hủy khiếu nại")
    } catch (error: any) {
      toast.error(error?.message || "Không thể hủy khiếu nại")
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border bg-white p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Mã yêu cầu</p>
            <p className="text-lg font-semibold">{complaint.id}</p>
          </div>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
              STATUS_BADGES[status || "PENDING"] ?? "bg-gray-100 text-gray-700"
            )}
          >
            {status || "PENDING"}
          </span>
        </div>
        <div className="mt-4 grid gap-4 text-sm text-muted-foreground md:grid-cols-2">
          {complaint.orderId && (
            <div>
              <p className="text-xs uppercase tracking-wide">Đơn hàng</p>
              <p className="text-foreground font-medium">{complaint.orderId}</p>
            </div>
          )}
          {complaint.productId && (
            <div>
              <p className="text-xs uppercase tracking-wide">Sản phẩm</p>
              <p className="text-foreground font-medium">{complaint.productId}</p>
            </div>
          )}
          <div>
            <p className="text-xs uppercase tracking-wide">Loại yêu cầu</p>
            <p className="text-foreground font-medium">{complaint.category || "RETURN"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide">Hướng xử lý</p>
            <p className="text-foreground font-medium">{complaint.desiredResolution || "REFUND"}</p>
          </div>
        </div>
        {allowCancel && !isClosed && (
          <div className="mt-4">
            <Button variant="outline" onClick={handleCancel} disabled={cancelling}>
              {cancelling ? "Đang hủy..." : "Hủy khiếu nại"}
            </Button>
          </div>
        )}
      </section>

      <section className="rounded-lg border bg-white p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Trao đổi với admin</h2>
        <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2">
          {messages.length === 0 ? (
            <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
              Bạn chưa có trao đổi nào. Hãy mô tả vấn đề để admin hỗ trợ nhanh hơn.
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "rounded-lg border px-4 py-2 text-sm",
                  msg.senderType === "ADMIN" ? "bg-slate-50 border-slate-200" : "bg-emerald-50 border-emerald-100"
                )}
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{msg.senderType === "ADMIN" ? "Admin hỗ trợ" : "Bạn"}</span>
                  <span>
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleString("vi-VN") : ""}
                  </span>
                </div>
                <p className="mt-2 text-foreground whitespace-pre-line">{msg.content}</p>
              </div>
            ))
          )}
        </div>
        {!isClosed && (
          <div className="space-y-3">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Mô tả thêm tình trạng, phản hồi từ shop..."
              rows={4}
            />
            <div className="flex justify-end">
              <Button onClick={handleSend} disabled={!canSend || sending}>
                {sending ? "Đang gửi..." : "Gửi cho admin"}
              </Button>
            </div>
          </div>
        )}
        {isClosed && (
          <div className="rounded-md bg-muted/50 px-4 py-2 text-sm text-muted-foreground">
            Khiếu nại đã đóng, bạn không thể gửi thêm tin nhắn.
          </div>
        )}
      </section>
    </div>
  )
}





