"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Copy, Eye, EyeOff, Star, Zap } from "lucide-react"
import { EditProductDialog } from "./edit-product-dialog"
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
import { productsApi, Product } from "@/lib/api/products"
import { toast } from "sonner"

const mockProducts = [
  {
    id: "1",
    name: "iPhone 15 Pro Max 256GB",
    image: "/modern-smartphone.png",
    sku: "IP15PM256",
    category: "Điện tử",
    price: 29990000,
    stock: 45,
    sold: 128,
    status: "active",
  },
  {
    id: "2",
    name: "Áo Thun Nam Basic",
    image: "/plain-white-tshirt.png",
    sku: "ATN001",
    category: "Thời trang",
    price: 199000,
    stock: 0,
    sold: 456,
    status: "inactive",
  },
  {
    id: "3",
    name: "Son Môi Lì Cao Cấp",
    image: "/assorted-lipsticks.png",
    sku: "SML002",
    category: "Làm đẹp",
    price: 350000,
    stock: 89,
    sold: 234,
    status: "active",
  },
]

export function ProductsTable({
  q,
  categoryId,
  status,
}: {
  q?: string
  categoryId?: string
  status?: string
}) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [deleteProduct, setDeleteProduct] = useState<any>(null)
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [page, setPage] = useState<number>(0)
  const [size, setSize] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(0)

  useEffect(() => {
    fetchPage(page, size, { q, categoryId, status })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, q, categoryId, status])

  const fetchPage = async (p: number, s: number, params?: { q?: string; categoryId?: string; status?: string }) => {
    try {
      setLoading(true)
      const resp = await productsApi.getSellerProducts(p, s, params)
      if (resp.success && resp.data) {
        // Transform products to ensure images are properly mapped
        const transformedProducts = (resp.data.content || []).map((product: any) => {
          // Log để debug
          if (process.env.NODE_ENV === 'development') {
            console.log('Product from API:', product)
          }

          // Map các field ảnh có thể có từ backend
          let primaryImage = product.primaryImage
          let images = product.images

          // Nếu backend trả về productImages (array of objects)
          if (product.productImages && Array.isArray(product.productImages)) {
            images = product.productImages.map((img: any) =>
              typeof img === 'string' ? img : (img.imageUrl || img.url || img.image_url)
            )
            // Lấy ảnh primary (isPrimary = true) hoặc ảnh đầu tiên
            const primaryImg = product.productImages.find((img: any) => img.isPrimary || img.is_primary)
            if (primaryImg) {
              primaryImage = typeof primaryImg === 'string' ? primaryImg : (primaryImg.imageUrl || primaryImg.url || primaryImg.image_url)
            } else if (images.length > 0) {
              primaryImage = images[0]
            }
          }

          // Nếu backend trả về imageUrls (array)
          if (product.imageUrls && Array.isArray(product.imageUrls)) {
            images = product.imageUrls
            if (!primaryImage && images.length > 0) {
              primaryImage = images[0]
            }
          }

          // Nếu backend trả về imageUrl (single string)
          if (product.imageUrl && !primaryImage) {
            primaryImage = product.imageUrl
            images = [product.imageUrl]
          }

          return {
            ...product,
            primaryImage,
            images: images || [],
          }
        })

        setItems(transformedProducts)
        setTotalPages(resp.data.totalPages || 0)
      }
    } catch (e) {
      console.error('Error fetching products:', e)
      toast.error("Tải sản phẩm thất bại")
    } finally {
      setLoading(false)
    }
  }

  const toggleSelectAll = () => {
    if (selectedProducts.length === items.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(items.map((p) => p.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedProducts((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }

  const handleSetFeatured = async (product: Product, featured: boolean) => {
    try {
      const response = await productsApi.setFeatured(product.id, featured)
      if (response.success) {
        toast.success(featured ? "Đã đặt làm sản phẩm nổi bật" : "Đã bỏ đặt làm sản phẩm nổi bật")
        // Refresh products
        fetchPage(page, size, { q, categoryId, status })
      } else {
        toast.error(response.message || "Thao tác thất bại")
      }
    } catch (error: any) {
      toast.error(error.message || "Thao tác thất bại")
    }
  }

  const handleSetFlashSale = async (product: Product, enabled: boolean) => {
    try {
      // If enabling, prompt for flash price
      let flashPrice: number | undefined = undefined
      if (enabled) {
        const priceInput = prompt("Nhập giá flash sale (VNĐ):", product.price?.toString() || "")
        if (!priceInput) {
          return // User cancelled
        }
        flashPrice = parseFloat(priceInput)
        if (isNaN(flashPrice) || flashPrice <= 0) {
          toast.error("Giá không hợp lệ")
          return
        }
      }
      
      const response = await productsApi.setFlashSale(product.id, enabled, flashPrice)
      if (response.success) {
        toast.success(enabled ? "Đã bật flash sale" : "Đã tắt flash sale")
        // Refresh products
        fetchPage(page, size, { q, categoryId, status })
      } else {
        toast.error(response.message || "Thao tác thất bại")
      }
    } catch (error: any) {
      toast.error(error.message || "Thao tác thất bại")
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  return (
    <>
      <div className="rounded-lg border bg-card">
        {selectedProducts.length > 0 && (
          <div className="flex items-center gap-2 p-4 border-b bg-muted/50">
            <span className="text-sm text-muted-foreground">Đã chọn {selectedProducts.length} sản phẩm</span>
            <Button variant="outline" size="sm">
              Xóa
            </Button>
            <Button variant="outline" size="sm">
              Ẩn
            </Button>
            <Button variant="outline" size="sm">
              Sao chép
            </Button>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox checked={selectedProducts.length === mockProducts.length} onCheckedChange={toggleSelectAll} />
              </TableHead>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead className="text-right">Giá</TableHead>
              <TableHead className="text-right">Kho</TableHead>
              <TableHead className="text-right">Đã bán</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  Đang tải sản phẩm...
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  Không có sản phẩm
                </TableCell>
              </TableRow>
            ) : items.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={() => toggleSelect(product.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image
                      src={product.primaryImage || product.images?.[0] || "/placeholder.svg"}
                      alt={product.name}
                      width={60}
                      height={60}
                      className="rounded-md object-cover"
                      unoptimized
                    />
                    <div>
                      <Link href={`/seller/products/${product.id}`} className="font-medium hover:text-primary">
                        {product.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        {product.isFeatured && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Nổi bật
                          </Badge>
                        )}
                        {product.flashSaleEnabled && (
                          <Badge variant="destructive" className="text-xs">
                            <Zap className="h-3 w-3 mr-1" />
                            Flash Sale
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{product.sku || '-'}</TableCell>
                <TableCell>{product.categoryName || '-'}</TableCell>
                <TableCell className="text-right font-medium">{formatPrice(product.price || 0)}</TableCell>
                <TableCell className="text-right">
                  <span className={product.quantity === 0 ? "text-destructive font-medium" : ""}>{product.quantity}</span>
                </TableCell>
                <TableCell className="text-right">{product.totalSold || 0}</TableCell>
                <TableCell>
                  {product.status?.toLowerCase() === "active" ? (
                    <Badge variant="default">Đang bán</Badge>
                  ) : product.status?.toLowerCase() === "inactive" ? (
                    <Badge variant="secondary">Hết hàng</Badge>
                  ) : (
                    <Badge variant="outline">Nháp</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingProduct(product)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="h-4 w-4 mr-2" />
                        Sao chép
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        {product.status?.toLowerCase() === "active" ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-2" />
                            Ẩn sản phẩm
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-2" />
                            Hiện sản phẩm
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleSetFeatured(product, !product.isFeatured)}>
                        <Star className={`h-4 w-4 mr-2 ${product.isFeatured ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                        {product.isFeatured ? "Bỏ đặt nổi bật" : "Đặt làm nổi bật"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSetFlashSale(product, !product.flashSaleEnabled)}>
                        <Zap className={`h-4 w-4 mr-2 ${product.flashSaleEnabled ? 'text-yellow-400' : ''}`} />
                        {product.flashSaleEnabled ? "Tắt Flash Sale" : "Bật Flash Sale"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => setDeleteProduct(product)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between p-4">
          <div className="text-sm text-muted-foreground">
            Trang {page + 1}{totalPages ? ` / ${totalPages}` : ''}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page <= 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={totalPages === 0 || page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Sau
            </Button>
          </div>
        </div>
      </div>

      {editingProduct && (
        <EditProductDialog
          product={editingProduct}
          open={!!editingProduct}
          onOpenChange={(open) => !open && setEditingProduct(null)}
        />
      )}
      <AlertDialog open={!!deleteProduct} onOpenChange={(open) => { if (!open) setDeleteProduct(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa sản phẩm?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Sản phẩm "{deleteProduct?.name}" sẽ bị xóa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline">Hủy</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                className="text-destructive"
                onClick={async () => {
                  if (deleteProduct?.id) {
                    const id = deleteProduct.id as string
                    setDeleteProduct(null)
                    const resp = await productsApi.deleteProduct(id)
                    if (resp.success) {
                      toast.success("Đã xóa sản phẩm")
                      fetchPage(page, size)
                    } else {
                      toast.error(resp.message || "Xóa sản phẩm thất bại")
                    }
                  }
                }}
              >
                Xóa
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
