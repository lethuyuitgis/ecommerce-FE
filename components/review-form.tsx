"use client"

import { useState, useRef } from "react"
import { Star, X, Upload, Video, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { reviewsApi } from "@/lib/api/reviews"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import Image from "next/image"

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
    const [images, setImages] = useState<File[]>([])
    const [videos, setVideos] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])
    const [videoPreviews, setVideoPreviews] = useState<string[]>([])
    const imageInputRef = useRef<HTMLInputElement>(null)
    const videoInputRef = useRef<HTMLInputElement>(null)

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length + images.length > 5) {
            toast.error("Bạn chỉ có thể tải lên tối đa 5 hình ảnh")
            return
        }

        const validFiles = files.filter(file => {
            if (!file.type.startsWith('image/')) {
                toast.error(`${file.name} không phải là file ảnh`)
                return false
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`${file.name} vượt quá 5MB`)
                return false
            }
            return true
        })

        setImages([...images, ...validFiles])
        const newPreviews = validFiles.map(file => URL.createObjectURL(file))
        setImagePreviews([...imagePreviews, ...newPreviews])
    }

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length + videos.length > 2) {
            toast.error("Bạn chỉ có thể tải lên tối đa 2 video")
            return
        }

        const validFiles = files.filter(file => {
            if (!file.type.startsWith('video/')) {
                toast.error(`${file.name} không phải là file video`)
                return false
            }
            if (file.size > 50 * 1024 * 1024) {
                toast.error(`${file.name} vượt quá 50MB`)
                return false
            }
            return true
        })

        setVideos([...videos, ...validFiles])
        const newPreviews = validFiles.map(file => URL.createObjectURL(file))
        setVideoPreviews([...videoPreviews, ...newPreviews])
    }

    const removeImage = (index: number) => {
        URL.revokeObjectURL(imagePreviews[index])
        setImages(images.filter((_, i) => i !== index))
        setImagePreviews(imagePreviews.filter((_, i) => i !== index))
    }

    const removeVideo = (index: number) => {
        URL.revokeObjectURL(videoPreviews[index])
        setVideos(videos.filter((_, i) => i !== index))
        setVideoPreviews(videoPreviews.filter((_, i) => i !== index))
    }

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
            
            const reviewData = {
                rating,
                title: title.trim(),
                comment: comment.trim(),
            }

            // Use createReviewWithMedia if there are images or videos
            if (images.length > 0 || videos.length > 0) {
                const response = await reviewsApi.createReviewWithMedia(productId, reviewData, images, videos)
                if (response.success) {
                    toast.success("Đánh giá đã được gửi!")
                    onSuccess?.()
                    onClose()
                }
            } else {
                const response = await reviewsApi.createReview(productId, reviewData)
                if (response.success) {
                    toast.success("Đánh giá đã được gửi!")
                    onSuccess?.()
                    onClose()
                }
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

                    {/* Image Upload */}
                    <div>
                        <Label>Hình ảnh (Tối đa 5 ảnh, mỗi ảnh tối đa 5MB)</Label>
                        <div className="mt-2 grid grid-cols-5 gap-2">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative aspect-square rounded-lg border overflow-hidden group">
                                    <Image
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {images.length < 5 && (
                                <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-primary cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors">
                                    <input
                                        ref={imageInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                    <ImageIcon className="w-6 h-6 text-gray-400" />
                                    <span className="text-xs text-gray-500 text-center px-2">Thêm ảnh</span>
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Video Upload */}
                    <div>
                        <Label>Video (Tối đa 2 video, mỗi video tối đa 50MB)</Label>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                            {videoPreviews.map((preview, index) => (
                                <div key={index} className="relative aspect-video rounded-lg border overflow-hidden group">
                                    <video
                                        src={preview}
                                        className="w-full h-full object-cover"
                                        controls
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeVideo(index)}
                                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {videos.length < 2 && (
                                <label className="aspect-video rounded-lg border-2 border-dashed border-gray-300 hover:border-primary cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors">
                                    <input
                                        ref={videoInputRef}
                                        type="file"
                                        accept="video/*"
                                        multiple
                                        onChange={handleVideoUpload}
                                        className="hidden"
                                    />
                                    <Video className="w-6 h-6 text-gray-400" />
                                    <span className="text-xs text-gray-500 text-center px-2">Thêm video</span>
                                </label>
                            )}
                        </div>
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





