import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function HelpCenterPage() {
  const categories = [
    {
      title: "Đặt hàng & Thanh toán",
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
      questions: [
        { q: "Thời gian giao hàng là bao lâu?", a: "Thời gian giao hàng từ 2-5 ngày tùy theo khu vực." },
        {
          q: "Phí vận chuyển được tính như thế nào?",
          a: "Phí vận chuyển được tính dựa trên trọng lượng và khoảng cách giao hàng.",
        },
        { q: "Làm sao để theo dõi đơn hàng?", a: "Bạn có thể theo dõi đơn hàng trong phần Quản lý đơn hàng." },
      ],
    },
    {
      title: "Trả hàng & Hoàn tiền",
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
      ],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-center text-3xl font-bold">Trung Tâm Trợ Giúp</h1>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Tìm kiếm câu hỏi..." className="pl-10" />
          </div>
        </div>

        <div className="space-y-6">
          {categories.map((category, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  {category.questions.map((item, qIdx) => (
                    <AccordionItem key={qIdx} value={`item-${idx}-${qIdx}`}>
                      <AccordionTrigger>{item.q}</AccordionTrigger>
                      <AccordionContent>{item.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
