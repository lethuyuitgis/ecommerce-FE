'use client'

import { useState } from "react"
import { Truck, MapPin, Clock, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ShippingClient() {
  const [activeTab, setActiveTab] = useState("methods")

  const shippingMethods = [
    {
      id: 1,
      name: "GHN - Giao hàng nhanh",
      logo: "🚚",
      deliveryTime: "2-3 ngày",
      basePrice: 25000,
      coverage: "Toàn quốc",
      features: ["Miễn phí với đơn từ 500k", "Bảo hiểm đầy đủ", "Hỗ trợ 24/7"],
    },
    {
      id: 2,
      name: "Shopee Express",
      logo: "📦",
      deliveryTime: "1-2 ngày",
      basePrice: 35000,
      coverage: "Các thành phố lớn",
      features: ["Giao nhanh nhất", "Hỗ trợ tức thời", "Dễ hoàn trả"],
    },
    {
      id: 3,
      name: "Ahamove",
      logo: "🚗",
      deliveryTime: "Same day",
      basePrice: 50000,
      coverage: "TP.HCM, Hà Nội",
      features: ["Giao cùng ngày", "Xem real-time", "Tài xế lịch sự"],
    },
    {
      id: 4,
      name: "J&T Express",
      logo: "✈️",
      deliveryTime: "2-4 ngày",
      basePrice: 20000,
      coverage: "Toàn quốc",
      features: ["Giá rẻ", "Bao gồm đảo", "Hỗ trợ tốt"],
    },
  ]

  const faqs = [
    {
      q: "Phí vận chuyển được tính như thế nào?",
      a: "Phí vận chuyển phụ thuộc vào khoảng cách, trọng lượng và phương thức vận chuyển bạn chọn.",
    },
    {
      q: "Tôi có thể đổi địa chỉ giao hàng không?",
      a: "Có, bạn có thể đổi địa chỉ giao hàng trước khi đơn hàng được xác nhận.",
    },
    {
      q: "Làm sao để theo dõi đơn hàng?",
      a: "Bạn có thể theo dõi đơn hàng bằng mã vận đơn trên trang theo dõi đơn hàng.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Thông Tin Vận Chuyển</h1>

        {/* Tabs */}
        <div className="mb-8 border-b">
          <div className="flex gap-4">
            <Button
              variant={activeTab === "methods" ? "default" : "ghost"}
              onClick={() => setActiveTab("methods")}
            >
              Phương thức vận chuyển
            </Button>
            <Button
              variant={activeTab === "faq" ? "default" : "ghost"}
              onClick={() => setActiveTab("faq")}
            >
              Câu hỏi thường gặp
            </Button>
          </div>
        </div>

        {/* Content */}
        {activeTab === "methods" && (
          <div className="grid md:grid-cols-2 gap-6">
            {shippingMethods.map((method) => (
              <div key={method.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl">{method.logo}</span>
                  <div>
                    <h3 className="text-xl font-bold">{method.name}</h3>
                    <p className="text-gray-600">{method.coverage}</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Thời gian: {method.deliveryTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Giá cơ bản: {method.basePrice.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
                <ul className="space-y-1">
                  {method.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {activeTab === "faq" && (
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-bold mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

