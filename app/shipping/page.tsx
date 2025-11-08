"use client"

import { useState } from "react"
import { Truck, MapPin, Clock, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ShippingPage() {
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
      a: "Phí vận chuyển phụ thuộc vào khoảng cách, cân nặng hàng hóa, và phương thức vận chuyển bạn chọn. Bạn có thể dùng công cụ tính phí trước khi thanh toán.",
    },
    {
      q: "Tôi có thể thay đổi phương thức vận chuyển không?",
      a: "Có thể thay đổi trong vòng 1 giờ sau khi đặt hàng. Truy cập chi tiết đơn hàng và nhấp vào 'Thay đổi vận chuyển'.",
    },
    {
      q: "Bao lâu thì hàng đến?",
      a: "Thời gian giao hàng tùy thuộc vào phương thức bạn chọn, thường từ 1-4 ngày. Bạn sẽ nhận được thông báo cập nhật.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Truck className="h-10 w-10" />
            <h1 className="text-4xl font-bold">Thông tin vận chuyển</h1>
          </div>
          <p className="text-amber-100 text-lg">Chọn phương thức giao hàng phù hợp cho bạn</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-amber-200">
          <button
            onClick={() => setActiveTab("methods")}
            className={`pb-3 font-semibold transition-colors ${
              activeTab === "methods"
                ? "border-b-2 border-amber-500 text-amber-600"
                : "text-gray-600 hover:text-amber-600"
            }`}
          >
            Phương thức vận chuyển
          </button>
          <button
            onClick={() => setActiveTab("faqs")}
            className={`pb-3 font-semibold transition-colors ${
              activeTab === "faqs" ? "border-b-2 border-amber-500 text-amber-600" : "text-gray-600 hover:text-amber-600"
            }`}
          >
            Câu hỏi thường gặp
          </button>
        </div>

        {/* Shipping Methods */}
        {activeTab === "methods" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {shippingMethods.map((method) => (
                <div
                  key={method.id}
                  className="bg-white border-2 border-amber-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{method.logo}</div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Từ</p>
                      <p className="text-2xl font-bold text-amber-600">{method.basePrice.toLocaleString()}đ</p>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{method.name}</h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="h-5 w-5 text-amber-500" />
                      <span>{method.deliveryTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="h-5 w-5 text-amber-500" />
                      <span>{method.coverage}</span>
                    </div>
                  </div>

                  <div className="mb-6 bg-amber-50 p-3 rounded-lg">
                    <p className="text-sm font-semibold text-gray-800 mb-2">Ưu điểm:</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {method.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">Chọn phương thức này</Button>
                </div>
              ))}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 flex gap-4">
              <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 mb-2">Lưu ý khi vận chuyển</p>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Hàng hóa sẽ được kiểm tra trước khi giao</li>
                  <li>• Vui lòng cung cấp số điện thoại chính xác</li>
                  <li>• Nếu không liên lạc được, hàng sẽ trả về sau 3 ngày</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* FAQs */}
        {activeTab === "faqs" && (
          <div className="bg-white border-2 border-amber-200 rounded-lg p-8">
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <details key={i} className="border-b border-amber-100 pb-6 last:border-b-0">
                  <summary className="font-semibold text-lg text-gray-800 cursor-pointer hover:text-amber-600 transition-colors">
                    {faq.q}
                  </summary>
                  <p className="text-gray-600 mt-4 ml-4">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
