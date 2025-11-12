"use client"

import { useState } from "react"
import { Star, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { reviewsApi, CreateReviewRequest } from "@/lib/api/reviews"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

interface ReviewFormProps {
    productId: string
    onClose: () => void
    onSuccess?: () => void
}

export function ReviewForm({ productId, onClose, onSuccess }: ReviewFormProps) {
    const { isAuthenticated } = useAuth()
    const [rating, setRating] = useState(5)
    const [title, setTitle] = useState("")
    const [comment, setComment] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!isAuthenticated) {
            toast.error("Vui lòng đăng nhập để đánh giá")
            return
        }

        if (!title.trim() || !comment.trim()) {
            toast.error("Vui lòng điền đầy đủ thông tin")
            return
        }

        try {
            setLoading(true)
            const reviewData: CreateReviewRequest = {
                rating,
                title: title.trim(),
                comment: comment.trim(),
            }

            const response = await reviewsApi.createReview(productId, reviewData)
            if (response.success) {
                toast.success("Đánh giá đã được gửi!")
                onSuccess?.()
                onClose()
            }
        } catch (error: any) {
            toast.error(error.message || "Gửi đánh giá thất bại")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl rounded-lg bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Viết Đánh Giá</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Đánh giá</Label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="focus:outline-none"
                                >
                                    <Star
                                        className={`h-8 w-8 ${star <= rating
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="title">Tiêu đề đánh giá</Label>
                        <Input
                            id="title"
                            placeholder="Nhập tiêu đề đánh giá"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="comment">Nội dung đánh giá</Label>
                        <Textarea
                            id="comment"
                            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                            rows={6}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex gap-2 justify-end">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Hủy
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Đang gửi..." : "Gửi Đánh Giá"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

