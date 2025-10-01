import { SellerSidebar } from "@/components/seller-sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShopSettings } from "@/components/shop-settings"
import { ShippingSettings } from "@/components/shipping-settings"
import { PaymentSettings } from "@/components/payment-settings"
import { NotificationSettings } from "@/components/notification-settings"

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <SellerSidebar />
      <div className="flex-1 lg:ml-64">
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
