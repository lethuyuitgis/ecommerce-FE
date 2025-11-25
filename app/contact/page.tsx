import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-4xl space-y-8">
            <h1 className="text-center text-3xl font-bold">Liên Hệ</h1>

            <div className="grid gap-8 md:grid-cols-2">
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle>Thông tin liên hệ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <Mail className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium text-foreground">Email</div>
                      support@shopcuathuy.vn
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium text-foreground">Hotline</div>
                      1900 1234
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium text-foreground">Địa chỉ</div>
                      123 Đường ABC, Quận 1, TP.HCM
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium text-foreground">Giờ làm việc</div>
                      <p>Thứ 2 - Thứ 7: 8:00 - 22:00</p>
                      <p>Chủ nhật: 9:00 - 21:00</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gửi tin nhắn</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <Input placeholder="Họ và tên" />
                    <Input type="email" placeholder="Email" />
                    <Input placeholder="Số điện thoại" />
                    <Textarea placeholder="Nội dung tin nhắn" rows={5} />
                    <Button className="w-full">Gửi tin nhắn</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
