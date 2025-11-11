
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, Trash2, TrendingUp, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"
const ProductDetailStats = dynamic(() => import("@/components/product/product-detail-stats").then(m => m.ProductDetailStats), { ssr: false })
import { ProductInventoryHistory } from "@/components/seller/product-inventory-history"
import { SellerSidebar } from "@/components/seller/seller-sidebar"


export default function ProductDetailPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <SellerSidebar />
      <div className="flex-1">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link href="/seller/products">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Chi Tiết Sản Phẩm</h1>
                <p className="text-muted-foreground mt-1">Xem và quản lý thông tin sản phẩm</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </Button>
              <Button variant="outline">
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <div className="grid gap-6 lg:grid-cols-3 mb-6">
            <Card className="lg:col-span-2">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <div className="shrink-0">
                    <Image
                      src="/modern-smartphone.png"
                      alt="Product"
                      width={200}
                      height={200}
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h2 className="text-2xl font-bold">iPhone 15 Pro Max 256GB</h2>
                        <Badge>Đang bán</Badge>
                      </div>
                      <p className="text-muted-foreground">Mã SKU: IP15PM256</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold text-primary">29.990.000₫</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="font-medium">4.8</span>
                          <span className="text-muted-foreground">(234 đánh giá)</span>
                        </div>
                        <div className="text-muted-foreground">Đã bán: 128</div>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <h3 className="font-semibold mb-2">Mô tả sản phẩm</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        iPhone 15 Pro Max với chip A17 Pro mạnh mẽ, camera 48MP chuyên nghiệp, màn hình Super Retina XDR
                        6.7 inch. Thiết kế titan cao cấp, pin lâu dài cả ngày.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tồn kho</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">45</div>
                  <p className="text-sm text-muted-foreground mt-1">Còn hàng trong kho</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Lượt xem</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">2,456</div>
                  <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +12% so với tuần trước
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="stats" className="space-y-4">
            <TabsList>
              <TabsTrigger value="stats">Thống kê</TabsTrigger>
              <TabsTrigger value="inventory">Lịch sử kho</TabsTrigger>
              <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
            </TabsList>
            <TabsContent value="stats">
              <ProductDetailStats />
            </TabsContent>
            <TabsContent value="inventory">
              <ProductInventoryHistory />
            </TabsContent>
            <TabsContent value="reviews">
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground text-center py-8">Chức năng đánh giá đang được phát triển</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
