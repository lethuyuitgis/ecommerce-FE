"use client"

import { useState, useEffect } from "react"
import { Star, ThumbsUp, Camera, Play } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ReviewForm } from "@/components/review-form"
import { reviewsApi, ProductReview } from "@/lib/api/reviews"
import { ordersApi, PurchaseStatus } from "@/lib/api/orders"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

interface ProductReviewsProps {
  productId: string
  initialReviews?: ProductReview[]
  initialTotalPages?: number
  initialPurchaseStatus?: { hasPurchased: boolean; orderItemId?: string; orderId?: string; orderNumber?: string }
}

export function ProductReviews({ productId, initialReviews = [], initialTotalPages = 0, initialPurchaseStatus }: ProductReviewsProps) {
  const { isAuthenticated } = useAuth()
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [activeFilter, setActiveFilter] = useState("all")
  const [reviews, setReviews] = useState<ProductReview[]>(initialReviews)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(initialTotalPages)
  const [averageRating, setAverageRating] = useState(0)
  const [ratingDistribution, setRatingDistribution] = useState<Record<number, number>>({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  })
  const [purchaseStatus, setPurchaseStatus] = useState<PurchaseStatus | null>(
    initialPurchaseStatus ? {
      hasPurchased: initialPurchaseStatus.hasPurchased,
      orderItemId: initialPurchaseStatus.orderItemId,
      orderId: initialPurchaseStatus.orderId,
      orderNumber: initialPurchaseStatus.orderNumber,
    } : null
  )

  // Calculate initial average rating and distribution from initial reviews
  useEffect(() => {
    if (initialReviews.length > 0) {
      const avg = initialReviews.reduce((sum, r) => sum + r.rating, 0) / initialReviews.length
      setAverageRating(avg)

      const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      initialReviews.forEach(r => {
        dist[r.rating] = (dist[r.rating] || 0) + 1
      })
      setRatingDistribution(dist)
    }
  }, [initialReviews])

  // Only check purchase status if not provided from server
  useEffect(() => {
    if (isAuthenticated && productId && !initialPurchaseStatus) {
      checkPurchaseStatus()
    }
  }, [isAuthenticated, productId, initialPurchaseStatus])

  // Only fetch when page changes (not on initial load)
  useEffect(() => {
    if (page > 0) {
      fetchReviews()
    }
  }, [page])

  const checkPurchaseStatus = async () => {
    try {
      const response = await ordersApi.checkPurchase(productId)
      if (response.success && response.data) {
        setPurchaseStatus(response.data)
      } else {
        setPurchaseStatus({ hasPurchased: false })
      }
    } catch (error) {
      console.error('Failed to check purchase status:', error)
      // Set default: not purchased
      setPurchaseStatus({ hasPurchased: false })
    }
  }

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await reviewsApi.getProductReviews(productId, page, 10)
      if (response.success && response.data) {
        setReviews(response.data.content)
        setTotalPages(response.data.totalPages)

        // Calculate average rating and distribution
        const allReviews = response.data.content
        if (allReviews.length > 0) {
          const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
          setAverageRating(avg)

          const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
          allReviews.forEach(r => {
            dist[r.rating] = (dist[r.rating] || 0) + 1
          })
          setRatingDistribution(dist)
        }
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReviewSuccess = () => {
    fetchReviews()
  }

  const filteredReviews = reviews.filter((review) => {
    if (activeFilter === "all") return true
    if (activeFilter === "images") return false // TODO: Add image support
    return review.rating === Number.parseInt(activeFilter)
  })

  return (
    <div className="mt-6 rounded-lg bg-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">ĐÁNH GIÁ SẢN PHẨM</h2>
        {isAuthenticated ? (
          purchaseStatus?.hasPurchased ? (
            <Button onClick={() => setShowReviewForm(true)} className="gap-2">
              <Star className="w-4 h-4" />
              Viết đánh giá
            </Button>
          ) : (
            <div className="text-sm text-muted-foreground">
              Bạn cần mua sản phẩm để đánh giá
            </div>
          )
        ) : (
          <div className="text-sm text-muted-foreground">
            Đăng nhập để viết đánh giá
          </div>
        )}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && purchaseStatus?.hasPurchased && (
        <ReviewForm
          productId={productId}
          orderItemId={purchaseStatus.orderItemId}
          onClose={() => setShowReviewForm(false)}
          onSuccess={handleReviewSuccess}
        />
      )}

      {/* Rating Overview */}
      {loading ? (
        <div className="mb-6 text-center py-4">
          <p className="text-muted-foreground">Đang tải đánh giá...</p>
        </div>
      ) : reviews.length > 0 ? (
        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary">
                {averageRating.toFixed(1)}
              </div>
              <div className="mb-2 flex justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${star <= Math.round(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                      }`}
                  />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">{reviews.length} đánh giá</div>
            </div>
          </div>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingDistribution[star] || 0
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="w-12 text-sm text-muted-foreground">{star} sao</span>
                  <Progress value={percentage} className="flex-1" />
                  <span className="w-12 text-right text-sm text-muted-foreground">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="mb-6 text-center py-4">
          <p className="text-muted-foreground">Chưa có đánh giá nào</p>
        </div>
      )}

      {/* Filter Buttons */}
      {reviews.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={activeFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("all")}
          >
            Tất Cả
          </Button>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingDistribution[star] || 0
            if (count === 0) return null
            return (
              <Button
                key={star}
                variant={activeFilter === String(star) ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(String(star))}
              >
                {star} Sao ({count})
              </Button>
            )
          })}
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Đang tải đánh giá...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Không có đánh giá nào</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-0">
              <div className="mb-3 flex items-start gap-3">
                <Avatar>
                  <AvatarImage src={review.userAvatar || "/placeholder.svg"} />
                  <AvatarFallback>{review.userName?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="mb-1 font-medium text-foreground">{review.userName || 'Người dùng'}</div>
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  {review.title && (
                    <h4 className="mb-2 font-semibold text-foreground">{review.title}</h4>
                  )}
                  {review.comment && (
                    <p className="mb-3 text-sm text-foreground">{review.comment}</p>
                  )}

                  {/* Review Images */}
                  {review.images && review.images.length > 0 && (
                    <div className="mb-3 grid grid-cols-4 gap-2">
                      {review.images.map((imageUrl, index) => (
                        <div key={index} className="relative aspect-square overflow-hidden rounded-lg border">
                          <Image
                            src={imageUrl}
                            alt={`Review image ${index + 1}`}
                            fill
                            className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => window.open(imageUrl, '_blank')}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Review Videos */}
                  {review.videos && review.videos.length > 0 && (
                    <div className="mb-3 grid grid-cols-2 gap-2">
                      {review.videos.map((videoUrl, index) => (
                        <div key={index} className="relative aspect-video overflow-hidden rounded-lg border">
                          <video
                            src={videoUrl}
                            controls
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <Button variant="ghost" size="sm" className="h-auto p-0 text-muted-foreground hover:text-primary">
                    <ThumbsUp className="mr-1 h-4 w-4" />
                    Hữu ích ({review.helpfulCount || 0})
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      {totalPages > page + 1 && (
        <div className="mt-6 text-center">
          <Button variant="outline" onClick={() => setPage(page + 1)}>
            Xem Thêm Đánh Giá
          </Button>
        </div>
      )}
    </div>
  )
}
