import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-center text-3xl font-bold">Liên Hệ</h1>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Thông tin liên hệ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-muted-foreground">support@shopcuathuy.vn</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Hotline</div>
                    <div className="text-muted-foreground">1900 1234</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Địa chỉ</div>
                    <div className="text-muted-foreground">123 Đường ABC, Quận 1, TP.HCM</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Giờ làm việc</div>
                    <div className="text-muted-foreground">
                      Thứ 2 - Thứ 7: 8:00 - 22:00
                      <br />
                      Chủ nhật: 9:00 - 21:00
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Gửi tin nhắn</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Input placeholder="Họ và tên" />
                </div>
                <div>
                  <Input type="email" placeholder="Email" />
                </div>
                <div>
                  <Input placeholder="Số điện thoại" />
                </div>
                <div>
                  <Textarea placeholder="Nội dung tin nhắn" rows={5} />
                </div>
                <Button className="w-full">Gửi tin nhắn</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
