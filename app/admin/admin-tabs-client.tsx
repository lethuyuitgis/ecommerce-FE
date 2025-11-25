"use client"

import { useSearchParams, useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AdminUser, AdminSeller, AdminShipment, AdminVoucher, AdminOverview } from '@/lib/api/admin'
import { OverviewTab } from '@/components/admin/tabs/overview-tab'
import { UsersTab } from '@/components/admin/tabs/users-tab'
import { SellersTab } from '@/components/admin/tabs/sellers-tab'
import { ShipmentsTab } from '@/components/admin/tabs/shipments-tab'
import { VouchersTab } from '@/components/admin/tabs/vouchers-tab'
import { ComplaintsTab } from '@/components/admin/tabs/complaints-tab'
import { SystemTab } from '@/components/admin/tabs/system-tab'
import { SettingsTab } from '@/components/admin/tabs/settings-tab'

interface AdminTabsClientProps {
  users: AdminUser[]
  sellers: AdminSeller[]
  shipments: AdminShipment[]
  vouchers: AdminVoucher[]
  complaints: any[]
  overview: AdminOverview | null
  systemMetrics: { startedAt: string; requestCount: number; errorCount: number; avgResponseMs: number } | null
  startDate?: string
  endDate?: string
}

export function AdminTabsClient({
  users,
  sellers,
  shipments,
  vouchers,
  complaints,
  overview,
  systemMetrics,
  startDate,
  endDate,
}: AdminTabsClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentTab = searchParams.get('tab') ?? 'overview'

  const handleTabChange = (value: string) => {
    router.replace(`/admin?tab=${value}`, { scroll: false })
  }

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-6">
      <TabsList className="w-full flex flex-wrap gap-2 justify-start">
        <TabsTrigger value="overview">Tổng quan</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="sellers">Sellers</TabsTrigger>
        <TabsTrigger value="shipments">Shipments</TabsTrigger>
        <TabsTrigger value="vouchers">Vouchers</TabsTrigger>
        <TabsTrigger value="complaints">Complaints</TabsTrigger>
        <TabsTrigger value="system">System</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-4">
        <OverviewTab initialOverview={overview} initialStartDate={startDate} initialEndDate={endDate} />
      </TabsContent>

      <TabsContent value="users" className="mt-4">
        <UsersTab initialUsers={users} />
      </TabsContent>

      <TabsContent value="sellers" className="mt-4">
        <SellersTab initialSellers={sellers} />
      </TabsContent>

      <TabsContent value="shipments" className="mt-4">
        <ShipmentsTab initialShipments={shipments} sellers={sellers} />
      </TabsContent>

      <TabsContent value="vouchers" className="mt-4">
        <VouchersTab initialVouchers={vouchers} />
      </TabsContent>

      <TabsContent value="complaints" className="mt-4">
        <ComplaintsTab initialComplaints={complaints} />
      </TabsContent>

      <TabsContent value="system" className="mt-4">
        <SystemTab initialMetrics={systemMetrics} />
      </TabsContent>

      <TabsContent value="settings" className="mt-4">
        <SettingsTab />
      </TabsContent>
    </Tabs>
  )
}


