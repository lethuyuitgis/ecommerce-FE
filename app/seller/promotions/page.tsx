import { CreatePromotionDialog } from "@/components/seller/create-promotion-dialog"
import { CreateVoucherDialog } from "@/components/seller/create-voucher-dialog"
import { PromotionsTable } from "@/components/seller/promotions-table"
import { SellerSidebar } from "@/components/seller/seller-sidebar"
import { VouchersTable } from "@/components/seller/vouchers-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus } from 'lucide-react'

export default function PromotionsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <SellerSidebar />
      <div className="flex-1">
        <div className="p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Quản Lý Khuyến Mãi</h1>
            <p className="text-muted-foreground mt-1">Tạo và quản lý các chương trình khuyến mãi</p>
          </div>

          <Tabs defaultValue="promotions" className="space-y-6">
            <TabsList>
              <TabsTrigger value="promotions">Khuyến mãi</TabsTrigger>
              <TabsTrigger value="vouchers">Mã giảm giá</TabsTrigger>
            </TabsList>

            <TabsContent value="promotions">
              <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Tìm kiếm khuyến mãi..." className="pl-9" />
                </div>
                <CreatePromotionDialog>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo khuyến mãi
                  </Button>
                </CreatePromotionDialog>
              </div>
              <PromotionsTable />
            </TabsContent>

            <TabsContent value="vouchers">
              <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Tìm kiếm mã giảm giá..." className="pl-9" />
                </div>
                <CreateVoucherDialog>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo mã giảm giá
                  </Button>
                </CreateVoucherDialog>
              </div>
              <VouchersTable />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
