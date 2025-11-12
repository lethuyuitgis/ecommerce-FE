"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Upload, Plus, Minus, Loader2 } from "lucide-react"
import Image from "next/image"
import { productsApi, Product } from "@/lib/api/products"
import { categoriesApi, Category } from "@/lib/api/categories"
import { shippingApi, ShippingMethod } from "@/lib/api/shipping"
import { useToast } from "@/hooks/use-toast"
import { apiClientWithFile } from "@/lib/api/client"
import { RichTextEditor } from "../ui/rick-text-editor"

interface EditProductDialogProps {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditProductDialog({ product, open, onOpenChange }: EditProductDialogProps) {
  const [name, setName] = useState(product.name || "")
  const [description, setDescription] = useState(product.description || "")
  const [sku, setSku] = useState(product.sku || "")
  const [price, setPrice] = useState(product.price?.toString() || "0")
  const [comparePrice, setComparePrice] = useState(product.comparePrice?.toString() || "")
  const [quantity, setQuantity] = useState(product.quantity?.toString() || "0")
  const [status, setStatus] = useState(product.status || "active")
  const [categoryId, setCategoryId] = useState(product.categoryId || "")
  const [shippingMethodId, setShippingMethodId] = useState<string>("")

  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>(product.images || [product.primaryImage || ""].filter(Boolean))
  const [variants, setVariants] = useState<Array<{ size: string; color: string; price: string; stock: string }>>([])

  const [categories, setCategories] = useState<Category[]>([])
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([])
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (open && product) {
      // Load categories and shipping methods
      Promise.all([categoriesApi.getAll(), shippingApi.getMethods()])
        .then(([catResp, shipResp]) => {
          if (catResp.success && catResp.data) setCategories(catResp.data)
          if (shipResp.success && shipResp.data) setShippingMethods(shipResp.data)
        })
        .catch(() => { })

      // Initialize form with product data
      setName(product.name || "")
      setDescription(product.description || "")
      setSku(product.sku || "")
      setPrice(product.price?.toString() || "0")
      setComparePrice(product.comparePrice?.toString() || "")
      setQuantity(product.quantity?.toString() || "0")
      setStatus(product.status || "active")
      setCategoryId(product.categoryId || "")
      setImagePreviews(product.images || [product.primaryImage || ""].filter(Boolean))

      // TODO: Load variants from API if available
      setVariants([{ size: "", color: "", price: "", stock: "" }])
    }
  }, [open, product])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + images.length + imagePreviews.length > 9) {
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
    if (index < imagePreviews.length - images.length) {
      // Remove existing image URL
      setImagePreviews(imagePreviews.filter((_, i) => i !== index))
    } else {
      // Remove uploaded file
      const fileIndex = index - (imagePreviews.length - images.length)
      const newImages = images.filter((_, i) => i !== fileIndex)
      const newPreviews = imagePreviews.filter((_, i) => i !== index)
      URL.revokeObjectURL(imagePreviews[index])
      setImages(newImages)
      setImagePreviews(newPreviews)
    }
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
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên sản phẩm",
        variant: "destructive",
      })
      return
    }

    if (!categoryId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn danh mục",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)

      // Upload new images
      const uploadedUrls: string[] = []
      if (images.length > 0) {
        for (const file of images) {
          const res = await apiClientWithFile<{ fileUrl: string }>('/upload/image', file, 'products')
          if (res.success && (res.data as any)?.fileUrl) {
            uploadedUrls.push((res.data as any).fileUrl)
          }
        }
      }

      // Combine existing image URLs with new uploaded URLs
      const existingUrls = imagePreviews.filter((url, idx) => idx < imagePreviews.length - images.length)
      const allImageUrls = [...existingUrls, ...uploadedUrls]

      // Prepare variants
      const preparedVariants = variants
        .filter(v => v.size || v.color || v.price || v.stock)
        .map(v => ({
          size: v.size || undefined,
          color: v.color || undefined,
          price: v.price ? Number(v.price) : undefined,
          stock: v.stock ? Number(v.stock) : undefined,
        }))

      // Get category name
      const selectedCategory = categories.find(c => c.id === categoryId)

      const resp = await productsApi.updateProduct(product.id, {
        name,
        description,
        sku: sku || undefined,
        price: Number(price),
        comparePrice: comparePrice ? Number(comparePrice) : undefined,
        quantity: Number(quantity),
        status,
        categoryId,
        categoryName: selectedCategory?.name,
        images: allImageUrls.length > 0 ? allImageUrls : undefined,
        variants: preparedVariants.length > 0 ? preparedVariants : undefined,
        shippingMethodId: shippingMethodId || undefined,
      })

      if (resp.success) {
        toast({
          title: "Thành công",
          description: "Sản phẩm đã được cập nhật thành công!",
        })
        onOpenChange(false)
        // Refresh page to show updated product
        if (typeof window !== "undefined") {
          window.location.reload()
        }
      } else {
        toast({
          title: "Lỗi",
          description: resp.message || "Không thể cập nhật sản phẩm",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Cập nhật sản phẩm thất bại",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh Sửa Sản Phẩm</DialogTitle>
          <DialogDescription>Cập nhật thông tin sản phẩm của bạn</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Images */}
          <div className="flex flex-col gap-2">
            <Label>Hình ảnh sản phẩm (tối đa 9 ảnh)</Label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {imagePreviews.map((image, index) => (
                <div key={index} className="relative group aspect-square">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Product ${index + 1}`}
                    fill
                    className="rounded-lg object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-primary text-white text-xs text-center py-1">
                      Ảnh bìa
                    </div>
                  )}
                </div>
              ))}
              {imagePreviews.length < 9 && (
                <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-primary cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors">
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="text-xs text-gray-500 text-center px-2">Thêm ảnh</span>
                </label>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-name">
                Tên sản phẩm <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên sản phẩm"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-category">
                Danh mục <span className="text-red-500">*</span>
              </Label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger id="edit-category">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-sku">Mã SKU</Label>
              <Input
                id="edit-sku"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="VD: SP001"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-status">Trạng thái</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="edit-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Đang bán</SelectItem>
                  <SelectItem value="inactive">Hết hàng</SelectItem>
                  <SelectItem value="draft">Nháp</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-price">
                Giá bán <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-compare-price">Giá so sánh</Label>
              <Input
                id="edit-compare-price"
                type="number"
                value={comparePrice}
                onChange={(e) => setComparePrice(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-quantity">Số lượng tồn kho</Label>
              <Input
                id="edit-quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-shipping">Phí vận chuyển</Label>
              <Select value={shippingMethodId} onValueChange={setShippingMethodId}>
                <SelectTrigger id="edit-shipping">
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

          {/* Description */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-description">Mô tả sản phẩm</Label>
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
                  <Input
                    placeholder="Kích thước"
                    value={variant.size}
                    onChange={(e) => updateVariant(index, "size", e.target.value)}
                  />
                  <Input
                    placeholder="Màu sắc"
                    value={variant.color}
                    onChange={(e) => updateVariant(index, "color", e.target.value)}
                  />
                  <Input
                    placeholder="Giá"
                    type="number"
                    value={variant.price}
                    onChange={(e) => updateVariant(index, "price", e.target.value)}
                  />
                  <Input
                    placeholder="Kho"
                    type="number"
                    value={variant.stock}
                    onChange={(e) => updateVariant(index, "stock", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeVariant(index)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
