import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { serverComplaintsApi } from "@/lib/api/server"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { submitComplaintAction } from "./actions"
import Link from "next/link"

type Complaint = {
  id: string
  orderId?: string
  productId?: string
  sellerId?: string
  category?: string
  title?: string
  description?: string
  status?: string
  desiredResolution?: string
  createdAt?: string
  updatedAt?: string
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Chờ xử lý",
  OPEN: "Chờ xử lý",
  REVIEWING: "Đang xem xét",
  IN_REVIEW: "Đang xem xét",
  APPROVED: "Đã chấp nhận",
  RESOLVED: "Đã giải quyết",
  REFUND_APPROVED: "Đã duyệt hoàn tiền",
  REJECTED: "Từ chối",
  CANCELLED: "Đã hủy",
}

const STATUS_CLASS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  OPEN: "bg-amber-100 text-amber-800",
  REVIEWING: "bg-indigo-100 text-indigo-800",
  IN_REVIEW: "bg-indigo-100 text-indigo-800",
  APPROVED: "bg-emerald-100 text-emerald-800",
  RESOLVED: "bg-emerald-100 text-emerald-800",
  REFUND_APPROVED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-rose-100 text-rose-800",
  CANCELLED: "bg-gray-100 text-gray-700",
}

function formatDate(value?: string) {
  if (!value) return "-"
  try {
    return new Date(value).toLocaleString("vi-VN")
  } catch {
    return value
  }
}

export default async function ComplaintsPage({
  searchParams,
}: {
  searchParams?: { submitted?: string; error?: string }
}) {
  const cookieStore = cookies()
  const headersList = headers()
  const response = await serverComplaintsApi.getAll(cookieStore, headersList)

  if (!response.success) {
    if ((response.message || "").includes("401")) {
      redirect("/login?redirect=/complaints")
    }
    throw new Error(response.message || "Không thể tải khiếu nại")
  }

  const complaints: Complaint[] = Array.isArray(response.data) ? response.data : []

  const successMessage = searchParams?.submitted ? "Đã gửi yêu cầu khiếu nại / trả hàng" : null
  const errorMessage = searchParams?.error
    ? decodeURIComponent(searchParams.error)
    : null

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <main>
        <div className="container mx-auto px-4 py-6 space-y-6">
          <section className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Khiếu nại & Trả hàng</h1>
            <p className="text-sm text-muted-foreground">
              Gửi yêu cầu khi có vấn đề với đơn hàng hoặc sản phẩm. Bộ phận Admin sẽ liên hệ và xử lý.
            </p>
            {successMessage && (
              <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
                {errorMessage}
              </div>
            )}
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-lg border bg-white p-6 lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Danh sách yêu cầu</h2>
                <span className="text-sm text-muted-foreground">
                  Tổng cộng {complaints.length} yêu cầu
                </span>
              </div>

              {complaints.length === 0 ? (
                <div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground">
                  Bạn chưa có yêu cầu nào. Hãy gửi yêu cầu khiếu nại / trả hàng khi cần hỗ trợ.
                </div>
              ) : (
                <div className="space-y-4">
                  {complaints.map((complaint) => (
                    <article key={complaint.id} className="rounded-lg border p-4">
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Mã yêu cầu: <span className="font-medium text-foreground">{complaint.id}</span>
                          </p>
                          {complaint.orderId && (
                            <p className="text-sm text-muted-foreground">
                              Đơn hàng: <span className="font-medium text-foreground">{complaint.orderId}</span>
                            </p>
                          )}
                        </div>
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${STATUS_CLASS[complaint.status || "PENDING"] || "bg-gray-100 text-gray-700"}`}
                        >
                          {STATUS_LABELS[complaint.status || "PENDING"] || complaint.status || "Chờ xử lý"}
                        </span>
                      </div>
                      <h3 className="mt-3 text-base font-semibold text-foreground">
                        {complaint.title || "Yêu cầu"}
                      </h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {complaint.description}
                      </p>
                      <div className="mt-3 grid gap-4 text-sm text-muted-foreground md:grid-cols-2">
                        <div>
                          <p>Loại yêu cầu: <span className="font-medium text-foreground">{complaint.category || "RETURN"}</span></p>
                          {complaint.productId && (
                            <p>Sản phẩm: <span className="font-medium text-foreground">{complaint.productId}</span></p>
                          )}
                        </div>
                        <div>
                          <p>Hướng xử lý: <span className="font-medium text-foreground">{complaint.desiredResolution || "REFUND"}</span></p>
                          <p>Cập nhật: <span className="font-medium text-foreground">{formatDate(complaint.updatedAt)}</span></p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-end">
                        <Link
                          href={`/complaints/${complaint.id}`}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          Xem chi tiết &rarr;
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-lg border bg-white p-6">
              <h2 className="mb-3 text-lg font-semibold text-foreground">Gửi yêu cầu mới</h2>
              <form action={submitComplaintAction} className="space-y-4">
                <div>
                  <label htmlFor="category" className="mb-1 block text-sm font-medium text-foreground">
                    Loại yêu cầu
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    defaultValue="RETURN"
                  >
                    <option value="RETURN">Trả hàng / Hoàn tiền</option>
                    <option value="PRODUCT">Khiếu nại sản phẩm</option>
                    <option value="DELIVERY">Vấn đề giao hàng</option>
                    <option value="SERVICE">Dịch vụ khách hàng</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="orderId" className="mb-1 block text-sm font-medium text-foreground">
                    Mã đơn hàng
                  </label>
                  <input
                    id="orderId"
                    name="orderId"
                    type="text"
                    placeholder="Nhập mã đơn hàng"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="productId" className="mb-1 block text-sm font-medium text-foreground">
                    Mã sản phẩm (nếu có)
                  </label>
                  <input
                    id="productId"
                    name="productId"
                    type="text"
                    placeholder="Ví dụ: SKU-123"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="title" className="mb-1 block text-sm font-medium text-foreground">
                    Tiêu đề
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    placeholder="Ví dụ: Sản phẩm lỗi, xin trả hàng"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="mb-1 block text-sm font-medium text-foreground">
                    Mô tả chi tiết
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    required
                    placeholder="Mô tả vấn đề bạn gặp phải…"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="desiredResolution" className="mb-1 block text-sm font-medium text-foreground">
                    Mong muốn xử lý
                  </label>
                  <select
                    id="desiredResolution"
                    name="desiredResolution"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    defaultValue="REFUND"
                  >
                    <option value="REFUND">Hoàn tiền</option>
                    <option value="EXCHANGE">Đổi sản phẩm</option>
                    <option value="VOUCHER">Voucher bồi thường</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                >
                  Gửi yêu cầu
                </button>
                <p className="text-xs text-muted-foreground">
                  Bộ phận Admin sẽ phản hồi trong vòng 24 giờ làm việc. Bạn sẽ nhận thông báo khi trạng thái thay đổi.
                </p>
              </form>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}


