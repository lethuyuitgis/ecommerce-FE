import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Target, Award, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-4xl space-y-12">
            <div className="text-center">
              <h1 className="mb-4 text-3xl font-bold">Về ShopCuaThuy</h1>
              <p className="text-lg text-muted-foreground">
                ShopCuaThuy là nền tảng thương mại điện tử hàng đầu Việt Nam, mang đến trải nghiệm mua sắm trực tuyến tuyệt
                vời với hàng triệu sản phẩm chất lượng.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <Target className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>Sứ Mệnh</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Kết nối người mua và người bán, tạo ra một thị trường trực tuyến an toàn, tiện lợi và đáng tin cậy.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Award className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>Tầm Nhìn</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Trở thành nền tảng thương mại điện tử số 1 Việt Nam, phục vụ hàng triệu khách hàng mỗi ngày.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>Đội Ngũ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Hơn 1000 nhân viên tận tâm, luôn sẵn sàng hỗ trợ và mang đến trải nghiệm tốt nhất cho khách hàng.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Heart className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>Giá Trị Cốt Lõi</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Khách hàng là trung tâm, chất lượng là ưu tiên, đổi mới là động lực phát triển.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="rounded-lg bg-primary/10 p-8 text-center">
              <h2 className="mb-4 text-2xl font-bold">Con Số Ấn Tượng</h2>
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <div className="text-3xl font-bold text-primary">10M+</div>
                  <div className="text-muted-foreground">Người dùng</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">5M+</div>
                  <div className="text-muted-foreground">Sản phẩm</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">100K+</div>
                  <div className="text-muted-foreground">Đơn hàng/ngày</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
