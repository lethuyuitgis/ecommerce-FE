'use client'

import { useState } from "react"
import { Search, MessageCircle, Phone, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

export function HelpCenterClient() {
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
      ],
    },
    {
      title: "Vận chuyển & Giao hàng",
      icon: "🚚",
      questions: [
        {
          q: "Phí vận chuyển là bao nhiêu?",
          a: "Phí vận chuyển phụ thuộc vào địa chỉ giao hàng và phương thức vận chuyển bạn chọn.",
        },
        {
          q: "Thời gian giao hàng là bao lâu?",
          a: "Thời gian giao hàng thường từ 1-5 ngày tùy thuộc vào địa chỉ và phương thức vận chuyển.",
        },
      ],
    },
    {
      title: "Trả hàng & Hoàn tiền",
      icon: "↩️",
      questions: [
        {
          q: "Làm thế nào để trả hàng?",
          a: "Bạn có thể yêu cầu trả hàng trong vòng 7 ngày kể từ khi nhận hàng nếu sản phẩm có vấn đề.",
        },
      ],
    },
  ]

  const filteredCategories = categories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Trung Tâm Trợ Giúp</h1>
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm câu hỏi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>
        </div>

        {filteredCategories.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">Không tìm thấy câu hỏi nào</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredCategories.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{category.icon}</span>
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((item, qIndex) => (
                      <AccordionItem key={qIndex} value={`item-${index}-${qIndex}`}>
                        <AccordionTrigger>{item.q}</AccordionTrigger>
                        <AccordionContent>{item.a}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Vẫn chưa tìm thấy câu trả lời?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" className="flex flex-col h-auto py-4">
                <MessageCircle className="h-6 w-6 mb-2" />
                <span>Chat trực tuyến</span>
              </Button>
              <Button variant="outline" className="flex flex-col h-auto py-4">
                <Phone className="h-6 w-6 mb-2" />
                <span>Gọi 1900 1234</span>
              </Button>
              <Button variant="outline" className="flex flex-col h-auto py-4">
                <Mail className="h-6 w-6 mb-2" />
                <span>Gửi email</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

