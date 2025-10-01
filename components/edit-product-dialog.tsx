"use client"

import { useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Upload, Plus, Minus } from "lucide-react"
import Image from "next/image"

interface EditProductDialogProps {
  product: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditProductDialog({ product, open, onOpenChange }: EditProductDialogProps) {
  const [images, setImages] = useState<string[]>([
    product.image,
    "/abstract-product-display.png",
    "/abstract-geometric-product.png",
  ])
  const [variants, setVariants] = useState([
    { name: "Màu đen", price: product.price, stock: 20 },
    { name: "Màu trắng", price: product.price, stock: 25 },
  ])

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const addVariant = () => {
    setVariants([...variants, { name: "", price: 0, stock: 0 }])
  }

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const updateVariant = (index: number, field: "name" | "price" | "stock", value: string | number) => {
    const newVariants = [...variants]
    newVariants[index] = { ...newVariants[index], [field]: value }
    setVariants(newVariants)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh Sửa Sản Phẩm</DialogTitle>
          <DialogDescription>Cập nhật thông tin sản phẩm của bạn</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Images */}
          <div className="space-y-2">
            <Label>Hình ảnh sản phẩm</Label>
            <div className="grid grid-cols-5 gap-3">
              {images.map((image, index) => (
                <div key={index} className="relative group aspect-square">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Product ${index + 1}`}
                    fill
                    className="rounded-lg object-cover"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <button className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center hover:border-primary transition-colors">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Tên sản phẩm</Label>
              <Input id="edit-name" defaultValue={product.name} placeholder="Nhập tên sản phẩm" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Mô tả</Label>
              <Textarea
                id="edit-description"
                placeholder="Mô tả chi tiết về sản phẩm"
                rows={4}
                defaultValue="Sản phẩm chất lượng cao, được nhập khẩu chính hãng..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Danh mục</Label>
                <Select defaultValue={product.category}>
                  <SelectTrigger id="edit-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Điện tử">Điện tử</SelectItem>
                    <SelectItem value="Thời trang">Thời trang</SelectItem>
                    <SelectItem value="Làm đẹp">Làm đẹp</SelectItem>
                    <SelectItem value="Nhà cửa">Nhà cửa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-sku">Mã SKU</Label>
                <Input id="edit-sku" defaultValue={product.sku} placeholder="VD: SP001" />
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Phân loại hàng</Label>
              <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                <Plus className="h-4 w-4 mr-1" />
                Thêm phân loại
              </Button>
            </div>
            <div className="space-y-2">
              {variants.map((variant, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <Input
                    placeholder="Tên phân loại"
                    value={variant.name}
                    onChange={(e) => updateVariant(index, "name", e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Giá"
                    value={variant.price}
                    onChange={(e) => updateVariant(index, "price", Number(e.target.value))}
                    className="w-32"
                  />
                  <Input
                    type="number"
                    placeholder="Kho"
                    value={variant.stock}
                    onChange={(e) => updateVariant(index, "stock", Number(e.target.value))}
                    className="w-24"
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeVariant(index)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="edit-status">Trạng thái</Label>
            <Select defaultValue={product.status}>
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={() => onOpenChange(false)}>Lưu thay đổi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
