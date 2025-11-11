import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"

export default function DataDeletionPage() {
    return (
        <div className="min-h-screen">
            <Header />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <h1 className="text-3xl font-bold mb-6">Hướng dẫn Xóa Dữ liệu Người dùng</h1>

                <div className="space-y-6 text-foreground">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">1. Gỡ bỏ ứng dụng khỏi tài khoản Facebook của bạn</h2>
                        <ol className="list-decimal list-inside space-y-2 ml-4">
                            <li>Truy cập <strong>Cài đặt & Quyền riêng tư</strong> trên Facebook</li>
                            <li>Chọn <strong>Cài đặt</strong></li>
                            <li>Nhấp vào <strong>Ứng dụng và Trang web</strong></li>
                            <li>Tìm ứng dụng của chúng tôi trong danh sách và nhấp vào <strong>Gỡ bỏ</strong></li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">2. Gửi yêu cầu xóa dữ liệu</h2>
                        <p className="mb-4">
                            Nếu bạn muốn xóa dữ liệu của mình khỏi ứng dụng của chúng tôi, vui lòng thực hiện các bước sau:
                        </p>
                        <p className="mb-4">
                            Vui lòng gửi email đến <a href="mailto:privacy@shopcuathuy.com" className="text-primary hover:underline">privacy@shopcuathuy.com</a> với tiêu đề &quot;Yêu cầu Xóa Dữ liệu&quot;.
                            Trong email, vui lòng cung cấp:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Tên đầy đủ của bạn</li>
                            <li>Địa chỉ email liên kết với tài khoản của bạn</li>
                            <li>Facebook User ID (nếu có)</li>
                            <li>Bất kỳ thông tin nhận dạng nào khác để xác minh yêu cầu</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">3. Thời gian xử lý</h2>
                        <p>
                            Chúng tôi sẽ xử lý yêu cầu của bạn trong vòng <strong>7 ngày làm việc</strong> và xác nhận qua email khi hoàn tất.
                        </p>
                    </section>

                    <section className="mt-8 p-4 bg-muted rounded-lg">
                        <h3 className="text-xl font-semibold mb-2">Liên hệ</h3>
                        <p>
                            Nếu bạn có bất kỳ câu hỏi nào về việc xóa dữ liệu, vui lòng liên hệ với chúng tôi tại:{" "}
                            <a href="mailto:privacy@shopcuathuy.com" className="text-primary hover:underline">
                                privacy@shopcuathuy.com
                            </a>
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    )
}

