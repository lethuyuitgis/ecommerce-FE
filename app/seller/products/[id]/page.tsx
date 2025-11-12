"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, Trash2, TrendingUp, Star, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"
import { productsApi, Product } from "@/lib/api/products"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { EditProductDialog } from "@/components/seller/edit-product-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
const ProductDetailStats = dynamic(() => import("@/components/product/product-detail-stats").then(m => m.ProductDetailStats), { ssr: false })
import { ProductInventoryHistory } from "@/components/seller/product-inventory-history"
import { ProductReviews } from "@/components/product/product-reviews"
import { SellerSidebar } from "@/components/seller/seller-sidebar"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const resp = await productsApi.getById(params.id)
      if (resp.success && resp.data) {
        setProduct(resp.data)
      } else {
        toast({
          title: "Lỗi",
          description: resp.message || "Không tìm thấy sản phẩm",
          variant: "destructive",
        })
        router.push("/seller/products")
      }
    } catch (error: any) {
      console.error("Error fetching product:", error)
      toast({
        title: "Lỗi",
        description: error.message || "Không thể tải thông tin sản phẩm",
        variant: "destructive",
      })
      router.push("/seller/products")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteProduct) return

    try {
      const resp = await productsApi.deleteProduct(deleteProduct.id)
      if (resp.success) {
        toast({
          title: "Thành công",
          description: "Đã xóa sản phẩm",
        })
        router.push("/seller/products")
      } else {
        toast({
          title: "Lỗi",
          description: resp.message || "Xóa sản phẩm thất bại",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Xóa sản phẩm thất bại",
        variant: "destructive",
      })
    } finally {
      setDeleteProduct(null)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <SellerSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Đang tải thông tin sản phẩm...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-screen bg-background">
        <SellerSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-4">Không tìm thấy sản phẩm</p>
            <Link href="/seller/products">
              <Button>Quay lại danh sách</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const primaryImage = product.primaryImage || product.images?.[0] || "/placeholder.svg"
  const allImages = product.images && product.images.length > 0 ? product.images : [primaryImage]
  return (
    <div className="flex min-h-screen bg-background">
      <SellerSidebar />
      <div className="flex-1">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/seller/products">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Chi Tiết Sản Phẩm</h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">Xem và quản lý thông tin sản phẩm</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" className="flex-1 sm:flex-initial" onClick={() => setEditingProduct(product)}>
                <Edit className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Chỉnh sửa</span>
              </Button>
              <Button variant="outline" size="sm" className="flex-1 sm:flex-initial" onClick={() => setDeleteProduct(product)}>
                <Trash2 className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Xóa</span>
              </Button>
            </div>
          </div>

          {/* Product Images & Basic Info */}
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-5 mb-6">
            {/* Product Images - Left Side */}
            <Card className="lg:col-span-3">
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  {/* Main Image */}
                  <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                    <Image
                      src={allImages[selectedImageIndex] || primaryImage}
                      alt={product.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  {/* Thumbnail Gallery */}
                  {allImages.length > 1 && (
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                      {allImages.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${selectedImageIndex === index ? "border-primary" : "border-transparent hover:border-muted-foreground/50"
                            }`}
                        >
                          <Image
                            src={img}
                            alt={`${product.name} ${index + 1}`}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Product Info - Right Side */}
            <div className="lg:col-span-2 space-y-4">
              {/* Basic Info Card */}
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {/* Title & Status */}
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h2 className="text-xl sm:text-2xl font-bold break-word flex-1">{product.name}</h2>
                        <Badge variant={product.status?.toLowerCase() === "active" ? "default" : "secondary"} className="shrink-0">
                          {product.status?.toLowerCase() === "active" ? "Đang bán" :
                            product.status?.toLowerCase() === "inactive" ? "Hết hàng" : "Nháp"}
                        </Badge>
                      </div>
                      {product.sku && (
                        <p className="text-sm text-muted-foreground">Mã SKU: {product.sku}</p>
                      )}
                    </div>

                    {/* Price */}
                    <div className="space-y-2 pb-4 border-b">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl font-bold text-primary">{formatPrice(product.price)}</span>
                        {product.comparePrice && product.comparePrice > product.price && (
                          <span className="text-lg text-muted-foreground line-through">
                            {formatPrice(product.comparePrice)}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        {product.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="font-medium">{product.rating.toFixed(1)}</span>
                            {product.totalReviews && (
                              <span className="text-muted-foreground">({product.totalReviews} đánh giá)</span>
                            )}
                          </div>
                        )}
                        {product.totalSold !== undefined && (
                          <div className="text-muted-foreground">Đã bán: {product.totalSold}</div>
                        )}
                      </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Tồn kho</p>
                        <p className={`text-2xl font-bold ${product.quantity === 0 ? "text-destructive" : ""}`}>
                          {product.quantity}
                        </p>
                      </div>
                      {product.totalViews !== undefined && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Lượt xem</p>
                          <p className="text-2xl font-bold">{product.totalViews.toLocaleString("vi-VN")}</p>
                        </div>
                      )}
                      {product.categoryName && (
                        <div className="col-span-2">
                          <p className="text-xs text-muted-foreground mb-1">Danh mục</p>
                          <p className="text-base font-semibold break-word">{product.categoryName}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="description" className="space-y-4">
            <div className="overflow-x-auto">
              <TabsList className="w-full sm:w-auto min-w-max">
                <TabsTrigger value="description" className="text-xs sm:text-sm">Mô tả</TabsTrigger>
                <TabsTrigger value="stats" className="text-xs sm:text-sm">Thống kê</TabsTrigger>
                <TabsTrigger value="inventory" className="text-xs sm:text-sm">Lịch sử kho</TabsTrigger>
                <TabsTrigger value="reviews" className="text-xs sm:text-sm">Đánh giá</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="description">
              <Card>
                <CardContent className="p-4 sm:p-6">
                  {product.description ? (
                    <div
                      className="prose max-w-none prose-sm sm:prose-base text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                  ) : (
                    <p className="text-muted-foreground text-center py-8">Chưa có mô tả sản phẩm</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="stats">
              {product && <ProductDetailStats productId={product.id} />}
            </TabsContent>
            <TabsContent value="inventory">
              {product && <ProductInventoryHistory productId={product.id} />}
            </TabsContent>
            <TabsContent value="reviews">
              {product && <ProductReviews productId={product.id} />}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {editingProduct && (
        <EditProductDialog
          product={editingProduct}
          open={!!editingProduct}
          onOpenChange={(open) => {
            if (!open) {
              setEditingProduct(null)
              fetchProduct() // Refresh sau khi edit
            }
          }}
        />
      )}

      <AlertDialog open={!!deleteProduct} onOpenChange={(open) => { if (!open) setDeleteProduct(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa sản phẩm?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Sản phẩm "{deleteProduct?.name}" sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline">Hủy</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" onClick={handleDelete}>
                Xóa
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
