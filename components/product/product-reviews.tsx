"use client"

import { useState } from "react"
import { Star, ThumbsUp, Camera } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ReviewForm } from "@/components/review-form"

interface ProductReviewsProps {
  productId: string
}

const reviews = [
  {
    id: 1,
    user: "Nguyễn Văn A",
    avatar: "/user-avatar-1.jpg",
    rating: 5,
    date: "2025-01-15",
    comment: "Sản phẩm rất tốt, chất lượng như mô tả. Giao hàng nhanh, đóng gói cẩn thận.",
    images: ["/review-1.jpg", "/review-2.jpg"],
    helpful: 24,
  },
  {
    id: 2,
    user: "Trần Thị B",
    avatar: "/user-avatar-2.jpg",
    rating: 4,
    date: "2025-01-10",
    comment: "Sản phẩm đẹp, giá cả hợp lý. Tuy nhiên giao hàng hơi lâu.",
    images: [],
    helpful: 12,
  },
  {
    id: 3,
    user: "Lê Văn C",
    avatar: "/user-avatar-3.jpg",
    rating: 5,
    date: "2025-01-05",
    comment: "Rất hài lòng với sản phẩm. Sẽ ủng hộ shop lần sau.",
    images: ["/review-3.jpg"],
    helpful: 8,
  },
]

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [activeFilter, setActiveFilter] = useState("all")

  return (
    <div className="mt-6 rounded-lg bg-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">ĐÁNH GIÁ SẢN PHẨM</h2>
        <Button onClick={() => setShowReviewForm(true)} className="gap-2">
          <Star className="w-4 h-4" />
          Viết đánh giá
        </Button>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && <ReviewForm productId={productId} onClose={() => setShowReviewForm(false)} />}

      {/* Rating Overview */}
      <div className="mb-6 grid gap-6 md:grid-cols-2">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold text-primary">4.8</div>
            <div className="mb-2 flex justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <div className="text-sm text-muted-foreground">2,341 đánh giá</div>
          </div>
        </div>

        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-2">
              <span className="w-12 text-sm text-muted-foreground">{star} sao</span>
              <Progress value={star === 5 ? 80 : star === 4 ? 15 : 5} className="flex-1" />
              <span className="w-12 text-right text-sm text-muted-foreground">
                {star === 5 ? "1,872" : star === 4 ? "351" : "118"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button
          variant={activeFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("all")}
        >
          Tất Cả
        </Button>
        <Button variant={activeFilter === "5" ? "default" : "outline"} size="sm" onClick={() => setActiveFilter("5")}>
          5 Sao (1,872)
        </Button>
        <Button variant={activeFilter === "4" ? "default" : "outline"} size="sm" onClick={() => setActiveFilter("4")}>
          4 Sao (351)
        </Button>
        <Button variant={activeFilter === "3" ? "default" : "outline"} size="sm" onClick={() => setActiveFilter("3")}>
          3 Sao (89)
        </Button>
        <Button
          variant={activeFilter === "images" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("images")}
        >
          <Camera className="w-4 h-4 mr-1" />
          Có Hình Ảnh (456)
        </Button>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-6 last:border-0">
            <div className="mb-3 flex items-start gap-3">
              <Avatar>
                <AvatarImage src={review.avatar || "/placeholder.svg"} />
                <AvatarFallback>{review.user[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="mb-1 font-medium text-foreground">{review.user}</div>
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">{review.date}</span>
                </div>
                <p className="mb-3 text-sm text-foreground">{review.comment}</p>
                {review.images.length > 0 && (
                  <div className="mb-3 flex gap-2">
                    {review.images.map((image, index) => (
                      <div key={index} className="h-20 w-20 overflow-hidden rounded border">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Review ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
                <Button variant="ghost" size="sm" className="h-auto p-0 text-muted-foreground hover:text-primary">
                  <ThumbsUp className="mr-1 h-4 w-4" />
                  Hữu ích ({review.helpful})
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="mt-6 text-center">
        <Button variant="outline">Xem Thêm Đánh Giá</Button>
      </div>
    </div>
  )
}
