import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-4xl space-y-6">
            <h1 className="text-3xl font-bold">Điều Khoản Sử Dụng</h1>

            <div className="space-y-6 text-muted-foreground">
              <section>
                <h2 className="text-2xl font-semibold text-foreground">1. Giới thiệu</h2>
                <p>
                  Chào mừng bạn đến với ShopCuaThuy. Khi sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản
                  và điều kiện sau đây.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">2. Tài khoản người dùng</h2>
                <p>
                  Bạn có trách nhiệm bảo mật thông tin tài khoản và mật khẩu của mình. Mọi hoạt động dưới tài khoản của bạn sẽ là trách nhiệm của bạn.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">3. Quy định giao dịch</h2>
                <p>
                  Mọi giao dịch trên nền tảng phải tuân thủ pháp luật Việt Nam. Chúng tôi có quyền từ chối hoặc hủy bỏ các giao dịch vi phạm.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">4. Quyền sở hữu trí tuệ</h2>
                <p>
                  Tất cả nội dung trên ShopCuaThuy đều thuộc quyền sở hữu của chúng tôi hoặc các đối tác. Nghiêm cấm sao chép, phân phối mà không có sự cho phép.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">5. Giới hạn trách nhiệm</h2>
                <p>
                  ShopCuaThuy không chịu trách nhiệm về các thiệt hại phát sinh từ việc sử dụng dịch vụ, trừ trường hợp do lỗi của chúng tôi.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">6. Thay đổi điều khoản</h2>
                <p>
                  Chúng tôi có quyền thay đổi các điều khoản này bất cứ lúc nào. Việc tiếp tục sử dụng dịch vụ đồng nghĩa với việc bạn chấp nhận các thay đổi.
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
