import { redirect } from 'next/navigation'
import { serverAdminApi, serverUserApi } from '@/lib/api/server'
import { AdminShell } from '@/components/admin/admin-shell'
import { AdminTabsClient } from './admin-tabs-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cookies, headers } from 'next/headers'

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: { tab?: string }
}) {
  const cookieStore = await cookies()
  const headersList = await headers()

  // Check auth on server
  const profileResponse = await serverUserApi.getProfile(cookieStore, headersList)
  if (!profileResponse.success || !profileResponse.data) {
    redirect('/login?redirect=/admin')
  }

  const user = profileResponse.data as any
  const userType = (user?.userType || '').toUpperCase()

  if (userType !== 'ADMIN') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="max-w-md text-center">
          <CardHeader>
            <CardTitle>Không có quyền truy cập</CardTitle>
            <p className="text-sm text-muted-foreground">
              Tài khoản hiện tại không phải Admin nên không thể xem trung tâm quản trị.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/">Về trang chủ</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/seller">Đến trang Seller</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Fetch all admin data in parallel with authentication
  const [usersRes, sellersRes, shipmentsRes, vouchersRes, complaintsRes, overviewRes, metricsRes] = await Promise.all([
    serverAdminApi.listUsers(undefined, cookieStore, headersList),
    serverAdminApi.listSellers(undefined, cookieStore, headersList),
    serverAdminApi.listShipments(undefined, cookieStore, headersList),
    serverAdminApi.listVouchers(undefined, cookieStore, headersList),
    serverAdminApi.listComplaints(undefined, cookieStore, headersList),
    serverAdminApi.getAdminOverview(undefined, cookieStore, headersList),
    serverAdminApi.getSystemMetrics(cookieStore, headersList),
  ])

  const users = usersRes.success && usersRes.data ? (Array.isArray(usersRes.data) ? usersRes.data : []) : []
  const sellers = sellersRes.success && sellersRes.data ? (Array.isArray(sellersRes.data) ? sellersRes.data : []) : []
  const shipments = shipmentsRes.success && shipmentsRes.data ? (Array.isArray(shipmentsRes.data) ? shipmentsRes.data : []) : []
  const vouchers = vouchersRes.success && vouchersRes.data ? (Array.isArray(vouchersRes.data) ? vouchersRes.data : []) : []
  const complaints = complaintsRes.success && complaintsRes.data ? (Array.isArray(complaintsRes.data) ? complaintsRes.data : []) : []
  const overview = (overviewRes.success && overviewRes.data && typeof overviewRes.data === 'object' && 'totalRevenue' in overviewRes.data)
    ? (overviewRes.data as any)
    : null
  const systemMetrics = (metricsRes.success && metricsRes.data && typeof metricsRes.data === 'object' && 'startedAt' in metricsRes.data)
    ? (metricsRes.data as any)
    : null

  // Calculate date range for overview (last 30 days)
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 30)

  return (
    <AdminShell>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Bảng điều khiển Admin</h1>
          <p className="mt-2 text-muted-foreground">
            Quản trị người dùng, người bán, vận chuyển và theo dõi sức khỏe hệ thống
          </p>
        </div>

        <AdminTabsClient
          users={users}
          sellers={sellers}
          shipments={shipments}
          vouchers={vouchers}
          complaints={complaints}
          overview={overview}
          systemMetrics={systemMetrics}
          startDate={startDate.toISOString().split('T')[0]}
          endDate={endDate.toISOString().split('T')[0]}
        />
      </div>
    </AdminShell>
  )
}
