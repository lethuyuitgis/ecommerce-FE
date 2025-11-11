'use client'

import { useEffect } from "react"
import { SellerSidebar } from "@/components/seller/seller-sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShopSettings } from "@/components/settings/shop-settings"
import { ShippingSettings } from "@/components/settings/shipping-settings"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { PaymentSettings } from "@/components/settings/payment-settings"

export default function SettingsPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || user?.userType !== 'SELLER') {
      router.push('/login')
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.userType !== 'SELLER') {
    return null
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SellerSidebar />
      <div className="flex-1">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Cài Đặt</h1>
            <p className="text-muted-foreground mt-1">Quản lý thông tin và cấu hình cửa hàng</p>
          </div>

          {/* Settings Tabs */}
          <Tabs defaultValue="shop" className="space-y-6">
            <TabsList>
              <TabsTrigger value="shop">Thông tin shop</TabsTrigger>
              <TabsTrigger value="shipping">Vận chuyển</TabsTrigger>
              <TabsTrigger value="payment">Thanh toán</TabsTrigger>
              <TabsTrigger value="notifications">Thông báo</TabsTrigger>
            </TabsList>

            <TabsContent value="shop">
              <ShopSettings />
            </TabsContent>

            <TabsContent value="shipping">
              <ShippingSettings />
            </TabsContent>

            <TabsContent value="payment">
              <PaymentSettings />
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationSettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
