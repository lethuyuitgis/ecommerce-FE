import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Briefcase } from "lucide-react"

export default function CareersPage() {
  const jobs = [
    {
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Hà Nội",
      type: "Full-time",
      description: "Tìm kiếm Frontend Developer có kinh nghiệm với React và Next.js...",
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "TP.HCM",
      type: "Full-time",
      description: "Quản lý sản phẩm và phát triển tính năng mới cho nền tảng...",
    },
    {
      title: "Marketing Executive",
      department: "Marketing",
      location: "Hà Nội",
      type: "Full-time",
      description: "Xây dựng và thực hiện các chiến dịch marketing hiệu quả...",
    },
  ]

  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-muted/30">
        <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-center text-3xl font-bold">Tuyển Dụng</h1>
        <p className="mb-8 text-center text-muted-foreground">
          Gia nhập đội ngũ ShopCuaThuy và cùng chúng tôi xây dựng tương lai thương mại điện tử
        </p>

        <div className="space-y-6">
          {jobs.map((job, idx) => (
            <Card key={idx}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="mb-2">{job.title}</CardTitle>
                    <CardDescription>{job.description}</CardDescription>
                  </div>
                  <Badge>{job.department}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {job.type}
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {job.department}
                  </div>
                </div>
                <Button>Ứng tuyển ngay</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
