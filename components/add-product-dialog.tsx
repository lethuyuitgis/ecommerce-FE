"use client"

import type React from "react"

import { useState } from "react"
import { X, Upload, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface AddProductDialogProps {
  onClose: () => void
}

export function AddProductDialog({ onClose }: AddProductDialogProps) {
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [variants, setVariants] = useState([{ size: "", color: "", price: "", stock: "" }])
  const { toast } = useToast()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + images.length > 9) {
      toast({
        title: "Lỗi",
        description: "Bạn chỉ có thể tải lên tối đa 9 hình ảnh",
        variant: "destructive",
      })
      return
    }

    setImages([...images, ...files])
    const newPreviews = files.map((file) => URL.createObjectURL(file))
    setImagePreviews([...imagePreviews, ...newPreviews])
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    URL.revokeObjectURL(imagePreviews[index])
    setImages(newImages)
    setImagePreviews(newPreviews)
  }

  const addVariant = () => {
    setVariants([...variants, { size: "", color: "", price: "", stock: "" }])
  }

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Submitting product")
    toast({
      title: "Thành công",
      description: "Sản phẩm đã được thêm thành công!",
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between z-10">
          <h3 className="text-xl font-semibold">Thêm sản phẩm mới</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Images */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              Hình ảnh sản phẩm <span className="text-red-500">*</span>
            </Label>
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
                  {index === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-primary text-white text-xs text-center py-1">
                      Ảnh bìa
                    </div>
                  )}
                </div>
              ))}

              {images.length < 9 && (
                <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-primary cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors">
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="text-xs text-gray-500 text-center px-2">Thêm ảnh</span>
                </label>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-500">Ảnh đầu tiên sẽ là ảnh bìa. Tối đa 9 ảnh.</p>
          </div>

          {/* Product Info */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="name">
                Tên sản phẩm <span className="text-red-500">*</span>
              </Label>
              <Input id="name" placeholder="Nhập tên sản phẩm" required />
            </div>

            <div>
              <Label htmlFor="category">
                Danh mục <span className="text-red-500">*</span>
              </Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fashion-men">Thời Trang Nam</SelectItem>
                  <SelectItem value="fashion-women">Thời Trang Nữ</SelectItem>
                  <SelectItem value="electronics">Điện Tử</SelectItem>
                  <SelectItem value="home">Nhà Cửa & Đời Sống</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">
              Mô tả sản phẩm <span className="text-red-500">*</span>
            </Label>
            <Textarea id="description" placeholder="Nhập mô tả chi tiết về sản phẩm" className="min-h-32" required />
          </div>

          {/* Variants */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-base font-medium">Phân loại hàng</Label>
              <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                <Plus className="w-4 h-4 mr-1" />
                Thêm phân loại
              </Button>
            </div>

            <div className="space-y-3">
              {variants.map((variant, index) => (
                <div key={index} className="grid gap-3 md:grid-cols-5 p-4 border rounded-lg">
                  <Input placeholder="Kích thước" value={variant.size} />
                  <Input placeholder="Màu sắc" value={variant.color} />
                  <Input placeholder="Giá" type="number" value={variant.price} />
                  <Input placeholder="Kho" type="number" value={variant.stock} />
                  <Button type="button" variant="outline" size="icon" onClick={() => removeVariant(index)}>
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="weight">Cân nặng (gram)</Label>
              <Input id="weight" type="number" placeholder="0" />
            </div>

            <div>
              <Label htmlFor="shipping">Phí vận chuyển</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phương thức" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Miễn phí vận chuyển</SelectItem>
                  <SelectItem value="standard">Tiêu chuẩn</SelectItem>
                  <SelectItem value="express">Nhanh</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Hủy
            </Button>
            <Button type="submit" className="flex-1">
              Thêm sản phẩm
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
