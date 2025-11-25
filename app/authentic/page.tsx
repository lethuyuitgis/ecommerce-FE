import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, CheckCircle, Award, Lock } from "lucide-react"

export default function AuthenticPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="text-center">
              <Shield className="mx-auto mb-4 h-16 w-16 text-primary" />
              <h1 className="mb-4 text-3xl font-bold">Cam Kết Hàng Chính Hãng</h1>
              <p className="text-muted-foreground">
                ShopCuaThuy cam kết mọi sản phẩm đều là hàng chính hãng, có nguồn gốc xuất xứ rõ ràng và được bảo hành đầy đủ.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CheckCircle className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>Nguồn gốc rõ ràng</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Tất cả sản phẩm đều được nhập khẩu chính hãng từ các nhà phân phối ủy quyền hoặc trực tiếp từ thương hiệu.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Award className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>Bảo hành chính hãng</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Sản phẩm được bảo hành theo chính sách của hãng, có tem bảo hành và phiếu bảo hành đầy đủ.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Lock className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>Kiểm tra chặt chẽ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Mọi sản phẩm đều được kiểm tra kỹ lưỡng về chất lượng và tính xác thực trước khi giao đến tay khách hàng.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Shield className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>Hoàn tiền 200%</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Nếu phát hiện hàng giả, hàng nhái, chúng tôi cam kết hoàn lại 200% giá trị đơn hàng.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Cách nhận biết hàng chính hãng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground">
                <p>✓ Kiểm tra tem chống hàng giả trên sản phẩm</p>
                <p>✓ Xác thực mã vạch/QR code với hãng</p>
                <p>✓ Kiểm tra chất lượng bao bì, in ấn</p>
                <p>✓ So sánh với sản phẩm mẫu trên website chính thức</p>
                <p>✓ Yêu cầu hóa đơn VAT khi mua hàng</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
