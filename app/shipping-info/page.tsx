import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Package, Clock, MapPin } from "lucide-react"

export default function ShippingInfoPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-muted/30">
        <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-center text-3xl font-bold">Thông Tin Vận Chuyển</h1>

        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Truck className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Đơn vị vận chuyển</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Chúng tôi hợp tác với các đơn vị vận chuyển uy tín: GHN, GHTK, Viettel Post, J&T Express.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Clock className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Thời gian giao hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Nội thành: 1-2 ngày</li>
                <li>• Ngoại thành: 2-3 ngày</li>
                <li>• Tỉnh xa: 3-5 ngày</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Package className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Phí vận chuyển</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Đơn từ 500k: Miễn phí</li>
                <li>• Đơn dưới 500k: 30k</li>
                <li>• Hàng cồng kềnh: Tính riêng</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <MapPin className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Khu vực giao hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Giao hàng toàn quốc 63 tỉnh thành. Một số khu vực xa có thể phát sinh phí.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lưu ý khi nhận hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>• Kiểm tra kỹ sản phẩm trước khi thanh toán với shipper</p>
            <p>• Quay video khi mở hàng để làm bằng chứng nếu có vấn đề</p>
            <p>• Liên hệ ngay với CSKH nếu phát hiện sai sót</p>
            <p>• Giữ lại hóa đơn và bao bì để đổi trả nếu cần</p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
