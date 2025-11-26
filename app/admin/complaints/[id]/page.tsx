import { AdminShell } from "@/components/admin/admin-shell"
import { serverAdminApi } from "@/lib/api/server"
import { cookies, headers } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { AdminComplaintDetailClient } from "@/components/admin/complaints/admin-complaint-detail-client"
import Link from "next/link"

interface AdminComplaintDetailPageProps {
  params: { id: string }
}

export default async function AdminComplaintDetailPage({ params }: AdminComplaintDetailPageProps) {
  const cookieStore = cookies()
  const headersList = headers()

  const [complaintRes, messagesRes] = await Promise.all([
    serverAdminApi.getComplaint(params.id, cookieStore, headersList),
    serverAdminApi.getComplaintMessages(params.id, cookieStore, headersList),
  ])

  if (!complaintRes.success) {
    if ((complaintRes.message || "").includes("401")) {
      redirect(`/login?redirect=/admin/complaints/${params.id}`)
    }
    notFound()
  }

  const complaint = complaintRes.data
  const messages = messagesRes.success && Array.isArray(messagesRes.data) ? messagesRes.data : []

  return (
    <AdminShell>
      <div className="p-6 lg:p-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              <Link href="/admin?tab=complaints" className="text-primary hover:underline">
                &larr; Quay lại danh sách khiếu nại
              </Link>
            </p>
            <h1 className="text-2xl font-bold text-foreground mt-2">Chi tiết khiếu nại</h1>
            <p className="text-sm text-muted-foreground">Theo dõi và phản hồi yêu cầu từ khách hàng.</p>
          </div>
        </div>

        <AdminComplaintDetailClient complaint={complaint} initialMessages={messages} />
      </div>
    </AdminShell>
  )
}



