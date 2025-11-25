'use client'

import { useState } from "react"
import Link from "next/link"
import { MessageCircle, Phone, Mail, Search, ChevronRight, Zap, Shield, Truck, CreditCard, Package } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function HelpClient() {
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
              className="pl-12 h-12 text-lg"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Liên Kết Nhanh</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className={`${link.color} p-6 rounded-lg hover:shadow-lg transition-shadow flex flex-col items-center gap-3`}
              >
                <link.icon className="h-8 w-8" />
                <span className="font-semibold">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Contact Methods */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Liên Hệ Với Chúng Tôi</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {contactMethods.map((method, index) => (
              <Link
                key={index}
                href={method.href}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <method.icon className="h-6 w-6 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{method.label}</h3>
                    <p className="text-gray-600">{method.value}</p>
                  </div>
                </div>
                <div className="flex items-center text-amber-600 font-medium">
                  Liên hệ ngay <ChevronRight className="ml-1 h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Help Categories */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Danh Mục Hỗ Trợ</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {helpCategories.map((category, index) => (
              <Link
                key={index}
                href={category.href}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <category.icon className="h-6 w-6 text-amber-700" />
                  </div>
                  <h3 className="font-semibold text-lg">{category.title}</h3>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-amber-600 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

