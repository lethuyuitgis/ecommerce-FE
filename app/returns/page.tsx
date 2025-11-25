import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ReturnsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-muted/30">
        <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-center text-3xl font-bold">Chính Sách Trả Hàng & Hoàn Tiền</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Điều kiện đổi trả</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>✓ Sản phẩm còn nguyên tem mác, chưa qua sử dụng</p>
            <p>✓ Đầy đủ hộp, phụ kiện, hóa đơn kèm theo</p>
            <p>✓ Trong vòng 7 ngày kể từ khi nhận hàng</p>
            <p>✓ Không áp dụng với sản phẩm khuyến mãi đặc biệt</p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Các trường hợp được đổi trả</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Badge className="mb-2">Lỗi từ nhà sản xuất</Badge>
              <p className="text-muted-foreground">Sản phẩm bị lỗi kỹ thuật, hư hỏng do nhà sản xuất</p>
            </div>
            <div>
              <Badge className="mb-2">Giao sai sản phẩm</Badge>
              <p className="text-muted-foreground">Nhận được sản phẩm không đúng với đơn hàng</p>
            </div>
            <div>
              <Badge className="mb-2">Sản phẩm bị hư hại</Badge>
              <p className="text-muted-foreground">Sản phẩm bị hư hỏng trong quá trình vận chuyển</p>
            </div>
            <div>
              <Badge className="mb-2">Không vừa ý</Badge>
              <p className="text-muted-foreground">Sản phẩm không đúng mô tả hoặc không như mong đợi</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quy trình đổi trả</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-muted-foreground">
              <li>1. Liên hệ CSKH qua hotline hoặc chat</li>
              <li>2. Cung cấp thông tin đơn hàng và lý do đổi trả</li>
              <li>3. Đóng gói sản phẩm và gửi lại theo hướng dẫn</li>
              <li>4. Chờ kiểm tra và xác nhận (1-2 ngày)</li>
              <li>5. Nhận sản phẩm mới hoặc hoàn tiền (3-5 ngày)</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Phí đổi trả</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>• Lỗi từ shop: Miễn phí vận chuyển 2 chiều</p>
            <p>• Lỗi từ khách: Khách chịu phí vận chuyển</p>
            <p>• Đổi size/màu: Khách chịu phí vận chuyển</p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
