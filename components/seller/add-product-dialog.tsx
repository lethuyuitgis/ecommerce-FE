"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { X, Upload, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { sellerApi } from "@/lib/api/seller"
import { useToast } from "@/hooks/use-toast"
import { apiClientWithFile } from "@/lib/api/client"
import { categoriesApi, Category } from "@/lib/api/categories"
import { shippingApi, ShippingMethod } from "@/lib/api/shipping"
import { RichTextEditor } from "../ui/rick-text-editor"
import { Textarea } from "../ui/textarea"

interface AddProductDialogProps {
  onClose?: () => void
  children?: React.ReactNode
}

export function AddProductDialog({ onClose, children }: AddProductDialogProps) {
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [variants, setVariants] = useState([{ size: "", color: "", price: "", stock: "" }])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<string>("")
  const [categories, setCategories] = useState<Category[]>([])
  const [shippingMethod, setShippingMethod] = useState<string>("")
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(!children) // If children provided, start closed. Otherwise, start open.
  const { toast } = useToast()

  useEffect(() => {
    let mounted = true
    Promise.all([categoriesApi.getAll(), shippingApi.getMethods()])
      .then(([catResp, shipResp]) => {
        if (!mounted) return
        if (catResp.success && catResp.data) setCategories(catResp.data)
        if (shipResp.success && shipResp.data) setShippingMethods(shipResp.data)
      })
      .catch(() => { })
    return () => {
      mounted = false
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    onClose?.()
  }

  const handleOpen = () => {
    setIsOpen(true)
  }

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

  const updateVariant = (index: number, field: "size" | "color" | "price" | "stock", value: string) => {
    setVariants((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast({ title: "Lỗi", description: "Vui lòng nhập tên sản phẩm", variant: "destructive" })
      return
    }
    if (!description.trim()) {
      toast({ title: "Lỗi", description: "Vui lòng nhập mô tả sản phẩm", variant: "destructive" })
      return
    }
    if (!category) {
      toast({ title: "Lỗi", description: "Vui lòng chọn danh mục", variant: "destructive" })
      return
    }
    if (images.length === 0 && imagePreviews.length === 0) {
      toast({ title: "Lỗi", description: "Vui lòng tải lên ít nhất 1 hình ảnh", variant: "destructive" })
      return
    }
    try {
      setSubmitting(true)
      // Upload images to MinIO via backend
      const uploadedUrls: string[] = []
      if (images.length > 0) {
        for (const file of images) {
          const res = await apiClientWithFile<{ fileUrl: string }>('/upload/image', file, 'products')
          if (res.success && (res.data as any)?.fileUrl) {
            uploadedUrls.push((res.data as any).fileUrl)
          }
        }
      } else {
        uploadedUrls.push(...imagePreviews)
      }

      // Prepare variants
      const preparedVariants = variants
        .filter(v => v.size || v.color || v.price || v.stock)
        .map(v => ({
          size: v.size || undefined,
          color: v.color || undefined,
          price: v.price ? Number(v.price) : undefined,
          stock: v.stock ? Number(v.stock) : undefined,
        }))

      // Fallback product price: lowest variant price or 0
      const productPrice =
        preparedVariants.length > 0
          ? Math.min(...preparedVariants.map(v => v.price || 0).filter(n => !isNaN(n)))
          : 0

      const chosenCategory = categories.find((c) => c.id === category)
      const resp = await sellerApi.createProduct({
        name,
        description,
        price: productPrice,
        categoryId: category || undefined,
        categoryName: chosenCategory?.name,
        images: uploadedUrls,
        variants: preparedVariants,
        status: "active",
        shippingMethodId: shippingMethod || undefined,
      })

      if (resp.success) {
        toast({ title: "Thành công", description: "Sản phẩm đã được thêm thành công!" })
        handleClose()
        // refresh page to show new product
        if (typeof window !== "undefined") {
          window.location.reload()
        }
      } else {
        toast({ title: "Lỗi", description: resp.message || "Không thể tạo sản phẩm", variant: "destructive" })
      }
    } catch (error: any) {
      toast({ title: "Lỗi", description: error.message || "Tạo sản phẩm thất bại", variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  const renderDialogContent = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between z-10">
          <h3 className="text-xl font-semibold">Thêm sản phẩm mới</h3>
          <Button variant="ghost" size="icon" onClick={handleClose}>
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
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Nhập tên sản phẩm"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="category">
                    Danh mục <span className="text-red-500">*</span>
                  </Label>
                  <Select required value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter((c) => c.isActive !== false).map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="description">
                  Mô tả sản phẩm <span className="text-red-500">*</span>
                </Label>
                <RichTextEditor
                  value={description}
                  onChange={setDescription}
                  placeholder="Nhập mô tả chi tiết, chèn ảnh và định dạng nội dung..."
                />
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
                      <Input placeholder="Kích thước" value={variant.size} onChange={(e) => updateVariant(index, "size", e.target.value)} />
                      <Input placeholder="Màu sắc" value={variant.color} onChange={(e) => updateVariant(index, "color", e.target.value)} />
                      <Input placeholder="Giá" type="number" value={variant.price} onChange={(e) => updateVariant(index, "price", e.target.value)} />
                      <Input placeholder="Kho" type="number" value={variant.stock} onChange={(e) => updateVariant(index, "stock", e.target.value)} />
                      <Button type="button" variant="outline" size="icon" onClick={() => removeVariant(index)}>
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="weight">Cân nặng (gram)</Label>
                  <Input id="weight" type="number" placeholder="0" />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="shipping">Phí vận chuyển</Label>
                  <Select value={shippingMethod} onValueChange={setShippingMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phương thức" />
                    </SelectTrigger>
                    <SelectContent>
                      {shippingMethods.filter((method) => method.isActive !== false).map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          {method.name}{method.fee > 0 ? ` - ${method.fee.toLocaleString("vi-VN")}₫` : " (Miễn phí)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
              Hủy
            </Button>
            <Button type="submit" className="flex-1" disabled={submitting}>
              {submitting ? "Đang tạo..." : "Thêm sản phẩm"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )

  // If children provided, render as trigger component
  if (children) {
    return (
      <>
        <div onClick={handleOpen}>
          {children}
        </div>
        {isOpen && renderDialogContent()}
      </>
    )
  }

  // If no children, render as controlled component (original behavior)
  return renderDialogContent()
}
