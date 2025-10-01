"use client"

import type React from "react"

import { useState } from "react"
import { Star, X, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface ReviewFormProps {
  productId: string
  onClose: () => void
}

export function ReviewForm({ productId, onClose }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const { toast } = useToast()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + images.length > 5) {
      toast({
        title: "Lỗi",
        description: "Bạn chỉ có thể tải lên tối đa 5 hình ảnh",
        variant: "destructive",
      })
      return
    }

    setImages([...images, ...files])

    // Create preview URLs
    const newPreviews = files.map((file) => URL.createObjectURL(file))
    setImagePreviews([...imagePreviews, ...newPreviews])
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)

    // Revoke the URL to free memory
    URL.revokeObjectURL(imagePreviews[index])

    setImages(newImages)
    setImagePreviews(newPreviews)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn số sao đánh giá",
        variant: "destructive",
      })
      return
    }

    if (comment.trim().length < 10) {
      toast({
        title: "Lỗi",
        description: "Đánh giá phải có ít nhất 10 ký tự",
        variant: "destructive",
      })
      return
    }

    // Here you would typically send the review to your backend
    console.log("[v0] Submitting review:", { productId, rating, comment, images })

    toast({
      title: "Thành công",
      description: "Đánh giá của bạn đã được gửi thành công!",
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold">Viết đánh giá sản phẩm</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Rating */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              Đánh giá của bạn <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoverRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="mt-2 text-sm text-gray-600">
                {rating === 5 && "Tuyệt vời"}
                {rating === 4 && "Hài lòng"}
                {rating === 3 && "Bình thường"}
                {rating === 2 && "Không hài lòng"}
                {rating === 1 && "Rất tệ"}
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <Label htmlFor="comment" className="text-base font-medium mb-3 block">
              Nhận xét của bạn <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Hãy chia sẻ cảm nhận, đánh giá của bạn về sản phẩm này..."
              className="min-h-32 resize-none"
              maxLength={500}
            />
            <p className="mt-2 text-sm text-gray-500 text-right">{comment.length}/500 ký tự</p>
          </div>

          {/* Image Upload */}
          <div>
            <Label className="text-base font-medium mb-3 block">Thêm hình ảnh (Tối đa 5 ảnh)</Label>

            <div className="grid grid-cols-5 gap-3">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-lg border overflow-hidden group">
                  <img
                    src={preview || "/placeholder.svg"}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
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
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="text-xs text-gray-500 text-center px-2">Tải ảnh</span>
                </label>
              )}
            </div>

            <p className="mt-2 text-sm text-gray-500">Hình ảnh giúp người mua khác hiểu rõ hơn về sản phẩm</p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Hủy
            </Button>
            <Button type="submit" className="flex-1">
              Gửi đánh giá
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
