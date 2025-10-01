import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function BlogPage() {
  const posts = [
    {
      title: "10 Mẹo Mua Sắm Online Tiết Kiệm",
      excerpt: "Khám phá những bí quyết giúp bạn mua sắm thông minh và tiết kiệm hơn...",
      category: "Mẹo hay",
      date: "15/12/2024",
      image: "/shopping-tips.jpg",
    },
    {
      title: "Xu Hướng Thời Trang 2025",
      excerpt: "Cập nhật những xu hướng thời trang hot nhất năm 2025...",
      category: "Thời trang",
      date: "10/12/2024",
      image: "/fashion-trends.png",
    },
    {
      title: "Hướng Dẫn Chọn Điện Thoại Phù Hợp",
      excerpt: "Những tiêu chí quan trọng khi chọn mua điện thoại mới...",
      category: "Công nghệ",
      date: "05/12/2024",
      image: "/smartphone-guide.jpg",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Blog ShopCuaThuy</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, idx) => (
          <Link key={idx} href={`/blog/${idx}`}>
            <Card className="h-full transition-shadow hover:shadow-lg">
              <img src={post.image || "/placeholder.svg"} alt={post.title} className="h-48 w-full object-cover" />
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <Badge>{post.category}</Badge>
                  <span className="text-sm text-muted-foreground">{post.date}</span>
                </div>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
