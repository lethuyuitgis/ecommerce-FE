import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-4xl space-y-6">
            <h1 className="text-3xl font-bold">Chính Sách Bảo Mật</h1>

            <div className="space-y-6 text-muted-foreground">
              <section>
                <h2 className="text-2xl font-semibold text-foreground">1. Thu thập thông tin</h2>
                <p>
                  Chúng tôi thu thập thông tin cá nhân như tên, email, số điện thoại, địa chỉ khi bạn đăng ký tài khoản hoặc
                  đặt hàng.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">2. Sử dụng thông tin</h2>
                <p>
                  Thông tin của bạn được sử dụng để xử lý đơn hàng, cải thiện dịch vụ, và gửi thông báo về các chương trình
                  khuyến mãi.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">3. Bảo mật thông tin</h2>
                <p>
                  Chúng tôi áp dụng các biện pháp bảo mật tiên tiến để bảo vệ thông tin cá nhân của bạn khỏi truy cập trái phép.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">4. Chia sẻ thông tin</h2>
                <p>
                  Chúng tôi không bán hoặc chia sẻ thông tin cá nhân của bạn với bên thứ ba, trừ khi cần thiết để hoàn thành đơn
                  hàng hoặc theo yêu cầu pháp luật.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">5. Cookie</h2>
                <p>
                  Website sử dụng cookie để cải thiện trải nghiệm người dùng. Bạn có thể tắt cookie trong cài đặt trình duyệt.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">6. Quyền của người dùng</h2>
                <p>
                  Bạn có quyền truy cập, chỉnh sửa hoặc xóa thông tin cá nhân của mình bất cứ lúc nào thông qua trang cài đặt tài khoản.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
