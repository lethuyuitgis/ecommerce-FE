import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { serverComplaintsApi } from "@/lib/api/server"
import { cookies, headers } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { ComplaintDetailClient } from "@/components/complaints/complaint-detail-client"

interface ComplaintDetailPageProps {
  params: { id: string }
}

export default async function ComplaintDetailPage({ params }: ComplaintDetailPageProps) {
  const cookieStore = cookies()
  const headersList = headers()

  const [complaintRes, messagesRes] = await Promise.all([
    serverComplaintsApi.getById(params.id, cookieStore, headersList),
    serverComplaintsApi.getMessages(params.id, cookieStore, headersList),
  ])

  if (!complaintRes.success) {
    if ((complaintRes.message || "").includes("401")) {
      redirect(`/login?redirect=/complaints/${params.id}`)
    }
    notFound()
  }

  if (!messagesRes.success) {
    if ((messagesRes.message || "").includes("401")) {
      redirect(`/login?redirect=/complaints/${params.id}`)
    }
  }

  const complaint = complaintRes.data
  const messages = messagesRes.success && Array.isArray(messagesRes.data) ? messagesRes.data : []

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">
            <a href="/complaints" className="text-primary hover:underline">
              &larr; Quay lại danh sách khiếu nại
            </a>
          </p>
          <h1 className="text-2xl font-bold text-foreground mt-2">Chi tiết khiếu nại</h1>
          <p className="text-sm text-muted-foreground">
            Trao đổi trực tiếp với admin để được hỗ trợ nhanh chóng.
          </p>
        </div>

        <ComplaintDetailClient complaint={complaint} initialMessages={messages} />
      </main>
      <Footer />
    </div>
  )
}





