"use client"

import { useState } from "react"
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
import { MoreHorizontal, Edit, Trash2, Copy, Eye, EyeOff } from "lucide-react"
import { EditProductDialog } from "@/components/edit-product-dialog"

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

export function ProductsTable() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [editingProduct, setEditingProduct] = useState<any>(null)

  const toggleSelectAll = () => {
    if (selectedProducts.length === mockProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(mockProducts.map((p) => p.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedProducts((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
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
            {mockProducts.map((product) => (
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
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={60}
                      height={60}
                      className="rounded-md object-cover"
                    />
                    <div>
                      <Link href={`/seller/products/${product.id}`} className="font-medium hover:text-primary">
                        {product.name}
                      </Link>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="text-right font-medium">{formatPrice(product.price)}</TableCell>
                <TableCell className="text-right">
                  <span className={product.stock === 0 ? "text-destructive font-medium" : ""}>{product.stock}</span>
                </TableCell>
                <TableCell className="text-right">{product.sold}</TableCell>
                <TableCell>
                  {product.status === "active" ? (
                    <Badge variant="default">Đang bán</Badge>
                  ) : product.status === "inactive" ? (
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
                        {product.status === "active" ? (
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
                      <DropdownMenuItem className="text-destructive">
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
      </div>

      {editingProduct && (
        <EditProductDialog
          product={editingProduct}
          open={!!editingProduct}
          onOpenChange={(open) => !open && setEditingProduct(null)}
        />
      )}
    </>
  )
}
