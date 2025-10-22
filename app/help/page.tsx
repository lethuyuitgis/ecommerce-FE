"use client"

import { useState } from "react"
import Link from "next/link"
import { MessageCircle, Phone, Mail, Search, ChevronRight, Zap, Shield, Truck, CreditCard, Package } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const quickLinks = [
    { icon: Package, label: "Đặt hàng", href: "/help-center", color: "bg-amber-100 text-amber-700" },
    { icon: CreditCard, label: "Thanh toán", href: "/help-center", color: "bg-amber-100 text-amber-700" },
    { icon: Truck, label: "Vận chuyển", href: "/shipping-info", color: "bg-amber-100 text-amber-700" },
    { icon: Shield, label: "Bảo mật", href: "/help-center", color: "bg-amber-100 text-amber-700" },
  ]

  const contactMethods = [
    { icon: MessageCircle, label: "Chat trực tuyến", value: "Hỗ trợ 24/7", href: "/seller/messages" },
    { icon: Phone, label: "Gọi điện", value: "1900 1234", href: "tel:19001234" },
    { icon: Mail, label: "Email", value: "support@shopcuathuy.com", href: "mailto:support@shopcuathuy.com" },
  ]

  const helpCategories = [
    { title: "Hướng dẫn mua hàng", href: "/help-center", icon: Zap },
    { title: "Hướng dẫn bán hàng", href: "/seller", icon: Zap },
    { title: "Chính sách trả hàng", href: "/returns", icon: Zap },
    { title: "Điều khoản dịch vụ", href: "/terms", icon: Zap },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Trung Tâm Hỗ Trợ</h1>
          <p className="text-amber-100 text-lg">Chúng tôi luôn sẵn sàng giúp bạn</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm câu hỏi hoặc chủ đề..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-3 text-lg border-2 border-amber-200 focus:border-amber-500"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Hỗ trợ nhanh</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link key={link.label} href={link.href}>
                  <div className="bg-white border-2 border-amber-200 rounded-lg p-6 hover:shadow-lg hover:border-amber-400 transition-all cursor-pointer">
                    <div className={`${link.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-gray-800">{link.label}</h3>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Contact Methods */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Liên hệ với chúng tôi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactMethods.map((method) => {
              const Icon = method.icon
              return (
                <a key={method.label} href={method.href} target="_blank" rel="noopener noreferrer">
                  <div className="bg-white border-2 border-amber-200 rounded-lg p-6 hover:shadow-lg hover:border-amber-400 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="bg-amber-100 text-amber-700 p-3 rounded-lg">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{method.label}</h3>
                        <p className="text-amber-600 text-sm mt-1">{method.value}</p>
                      </div>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        </div>

        {/* Help Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Danh mục hỗ trợ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {helpCategories.map((category) => {
              const Icon = category.icon
              return (
                <Link key={category.title} href={category.href}>
                  <div className="bg-white border-2 border-amber-200 rounded-lg p-6 hover:shadow-lg hover:border-amber-400 transition-all flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="bg-amber-100 text-amber-700 p-3 rounded-lg group-hover:bg-amber-200 transition-colors">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold text-gray-800">{category.title}</h3>
                    </div>
                    <ChevronRight className="h-5 w-5 text-amber-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white border-2 border-amber-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Câu hỏi thường gặp</h2>
          <div className="space-y-4">
            {[
              {
                q: "Làm cách nào để theo dõi đơn hàng của tôi?",
                a: 'Bạn có thể theo dõi đơn hàng trong phần "Đơn hàng của tôi" hoặc nhấp vào liên kết theo dõi trong email xác nhận.',
              },
              {
                q: "Chính sách hoàn trả là gì?",
                a: "Bạn có thể hoàn trả sản phẩm trong vòng 30 ngày nếu sản phẩm chưa được sử dụng.",
              },
              {
                q: "Tôi có thể thay đổi đơn hàng sau khi đặt không?",
                a: "Bạn có thể hủy hoặc thay đổi đơn hàng trong vòng 1 giờ sau khi đặt.",
              },
              {
                q: "Phương thức thanh toán nào được chấp nhận?",
                a: "Chúng tôi chấp nhận thẻ tín dụng, chuyển khoản ngân hàng, ví điện tử, và thanh toán khi nhận hàng.",
              },
            ].map((item, index) => (
              <details key={index} className="border-b border-amber-100 pb-4 last:border-b-0">
                <summary className="font-semibold text-gray-800 cursor-pointer hover:text-amber-600 transition-colors">
                  {item.q}
                </summary>
                <p className="text-gray-600 mt-3 ml-4">{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Vẫn cần giúp đỡ?</h2>
          <p className="mb-6 text-amber-100">Đội hỗ trợ của chúng tôi sẵn sàng giúp bạn 24/7</p>
          <Link href="/contact">
            <Button className="bg-white text-amber-600 hover:bg-amber-50">Liên hệ ngay</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
