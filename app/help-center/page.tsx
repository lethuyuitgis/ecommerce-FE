"use client"

import { useState } from "react"
import { Search, MessageCircle, Phone, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const categories = [
    {
      title: "Đặt hàng & Thanh toán",
      icon: "🛒",
      questions: [
        {
          q: "Làm thế nào để đặt hàng?",
          a: "Bạn có thể đặt hàng bằng cách thêm sản phẩm vào giỏ hàng và tiến hành thanh toán.",
        },
        {
          q: "Có những phương thức thanh toán nào?",
          a: "Chúng tôi hỗ trợ thanh toán qua COD, chuyển khoản, MoMo, ZaloPay và thẻ tín dụng.",
        },
        {
          q: "Làm sao để hủy đơn hàng?",
          a: "Bạn có thể hủy đơn hàng trong phần Quản lý đơn hàng nếu đơn chưa được xác nhận.",
        },
        {
          q: "Có thể thay đổi đơn hàng sau khi đặt không?",
          a: "Có thể thay đổi nếu đơn hàng chưa được xác nhận. Vui lòng liên hệ với chúng tôi ngay.",
        },
      ],
    },
    {
      title: "Vận chuyển & Giao hàng",
      icon: "🚚",
      questions: [
        { q: "Thời gian giao hàng là bao lâu?", a: "Thời gian giao hàng từ 2-5 ngày tùy theo khu vực." },
        {
          q: "Phí vận chuyển được tính như thế nào?",
          a: "Phí vận chuyển được tính dựa trên trọng lượng và khoảng cách giao hàng.",
        },
        { q: "Làm sao để theo dõi đơn hàng?", a: "Bạn có thể theo dõi đơn hàng trong phần Quản lý đơn hàng." },
        { q: "Giao hàng đến những nơi nào?", a: "Chúng tôi giao hàng đến toàn bộ các tỉnh thành trên cả nước." },
      ],
    },
    {
      title: "Trả hàng & Hoàn tiền",
      icon: "↩️",
      questions: [
        {
          q: "Chính sách đổi trả như thế nào?",
          a: "Bạn có thể đổi trả trong vòng 7 ngày nếu sản phẩm còn nguyên tem mác.",
        },
        {
          q: "Thời gian hoàn tiền là bao lâu?",
          a: "Thời gian hoàn tiền từ 5-7 ngày làm việc sau khi nhận được hàng trả.",
        },
        { q: "Ai chịu phí vận chuyển khi trả hàng?", a: "Nếu lỗi từ shop, chúng tôi sẽ chịu phí vận chuyển." },
        {
          q: "Sản phẩm bị hỏng khi giao có được đổi không?",
          a: "Có, bạn có thể yêu cầu đổi hoặc hoàn tiền nếu sản phẩm bị hỏng.",
        },
      ],
    },
    {
      title: "Tài khoản & Bảo mật",
      icon: "🔐",
      questions: [
        {
          q: "Làm sao để tạo tài khoản?",
          a: "Bạn có thể tạo tài khoản bằng cách nhấp vào nút Đăng ký và điền thông tin.",
        },
        { q: "Quên mật khẩu phải làm sao?", a: "Nhấp vào 'Quên mật khẩu' trên trang đăng nhập và làm theo hướng dẫn." },
        {
          q: "Tài khoản của tôi có an toàn không?",
          a: "Chúng tôi sử dụng mã hóa SSL để bảo vệ thông tin cá nhân của bạn.",
        },
        { q: "Làm sao để cập nhật thông tin cá nhân?", a: "Bạn có thể cập nhật thông tin trong phần Hồ sơ cá nhân." },
      ],
    },
    {
      title: "Sản phẩm & Tìm kiếm",
      icon: "🔍",
      questions: [
        { q: "Làm sao để tìm sản phẩm?", a: "Sử dụng thanh tìm kiếm hoặc duyệt theo danh mục sản phẩm." },
        { q: "Có thể so sánh sản phẩm không?", a: "Có, bạn có thể thêm sản phẩm vào danh sách so sánh." },
        { q: "Làm sao để xem đánh giá sản phẩm?", a: "Đánh giá được hiển thị trên trang chi tiết sản phẩm." },
        { q: "Có thể lưu sản phẩm yêu thích không?", a: "Có, nhấp vào biểu tượng trái tim để lưu sản phẩm yêu thích." },
      ],
    },
    {
      title: "Khuyến mãi & Mã giảm giá",
      icon: "🎁",
      questions: [
        {
          q: "Làm sao để sử dụng mã giảm giá?",
          a: "Nhập mã giảm giá trong phần thanh toán trước khi hoàn tất đơn hàng.",
        },
        {
          q: "Có thể kết hợp nhiều mã giảm giá không?",
          a: "Không, bạn chỉ có thể sử dụng một mã giảm giá cho mỗi đơn hàng.",
        },
        { q: "Mã giảm giá có hạn sử dụng không?", a: "Có, mỗi mã giảm giá có thời hạn sử dụng nhất định." },
        { q: "Làm sao để nhận thông báo về khuyến mãi?", a: "Đăng ký nhận thông báo trong phần cài đặt tài khoản." },
      ],
    },
  ]

  const filteredCategories = categories
    .map((cat) => ({
      ...cat,
      questions: cat.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((cat) => cat.questions.length > 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 py-12 text-white">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-center text-4xl font-bold">Trung Tâm Trợ Giúp</h1>
          <p className="text-center text-amber-100">Tìm câu trả lời cho các câu hỏi thường gặp</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Search Bar */}
          <div className="mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-500" />
              <Input
                placeholder="Tìm kiếm câu hỏi..."
                className="border-2 border-amber-200 pl-12 py-6 text-lg focus:border-amber-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="mb-12 grid gap-4 md:grid-cols-3">
            <Card className="border-amber-200 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <MessageCircle className="mx-auto mb-3 h-8 w-8 text-amber-500" />
                <h3 className="font-semibold">Chat với chúng tôi</h3>
                <p className="text-sm text-gray-600">Hỗ trợ 24/7</p>
              </CardContent>
            </Card>
            <Card className="border-amber-200 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <Phone className="mx-auto mb-3 h-8 w-8 text-amber-500" />
                <h3 className="font-semibold">Gọi cho chúng tôi</h3>
                <p className="text-sm text-gray-600">1900 1234</p>
              </CardContent>
            </Card>
            <Card className="border-amber-200 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <Mail className="mx-auto mb-3 h-8 w-8 text-amber-500" />
                <h3 className="font-semibold">Email</h3>
                <p className="text-sm text-gray-600">support@shopcuathuy.com</p>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-6">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category, idx) => (
                <Card key={idx} className="border-amber-200 hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100">
                    <CardTitle className="flex items-center gap-3">
                      <span className="text-2xl">{category.icon}</span>
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <Accordion type="single" collapsible>
                      {category.questions.map((item, qIdx) => (
                        <AccordionItem key={qIdx} value={`item-${idx}-${qIdx}`}>
                          <AccordionTrigger className="hover:text-amber-600">{item.q}</AccordionTrigger>
                          <AccordionContent className="text-gray-700">{item.a}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-amber-200">
                <CardContent className="py-12 text-center">
                  <p className="text-gray-600">Không tìm thấy câu hỏi phù hợp. Vui lòng thử tìm kiếm khác.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Still Need Help */}
          <Card className="mt-12 border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100">
            <CardContent className="py-8 text-center">
              <h3 className="mb-4 text-xl font-semibold">Vẫn cần giúp đỡ?</h3>
              <p className="mb-6 text-gray-700">Liên hệ với đội hỗ trợ khách hàng của chúng tôi</p>
              <Button className="bg-amber-500 hover:bg-amber-600">Liên hệ ngay</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
