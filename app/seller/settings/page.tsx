import { SellerSidebar } from "@/components/seller/seller-sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShopSettings } from "@/components/settings/shop-settings"
import { ShippingSettings } from "@/components/settings/shipping-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { PaymentSettings } from "@/components/settings/payment-settings"
import { serverUserApi } from "@/lib/api/server"
import { redirect } from "next/navigation"

export default async function SettingsPage() {
  // Check authentication by fetching profile
  const response = await serverUserApi.getProfile()
  
  // If not authenticated, redirect to login
  if (!response.success) {
    redirect('/login')
  }

  // Check if user is seller
  const user = response.data
  if (user?.userType !== 'SELLER') {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SellerSidebar />
      <div className="flex-1">
        <div className="p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Cài Đặt</h1>
            <p className="text-muted-foreground mt-1">Quản lý thông tin và cấu hình cửa hàng</p>
          </div>

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
