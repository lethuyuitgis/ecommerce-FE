import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SellerSidebar } from "@/components/seller-sidebar"
import { ProductsTable } from "@/components/products-table"
import { AddProductDialog } from "@/components/add-product-dialog"
import { Search, Plus, Download, Upload } from "lucide-react"

export default function SellerProductsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <SellerSidebar />
      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Quản Lý Sản Phẩm</h1>
            <p className="text-muted-foreground mt-1">Quản lý toàn bộ sản phẩm của shop</p>
          </div>

          {/* Filters and Actions */}
          <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Tìm kiếm sản phẩm..." className="pl-9" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder="Danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  <SelectItem value="electronics">Điện tử</SelectItem>
                  <SelectItem value="fashion">Thời trang</SelectItem>
                  <SelectItem value="beauty">Làm đẹp</SelectItem>
                  <SelectItem value="home">Nhà cửa</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="active">Đang bán</SelectItem>
                  <SelectItem value="inactive">Hết hàng</SelectItem>
                  <SelectItem value="draft">Nháp</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Xuất Excel
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Nhập Excel
              </Button>
              <AddProductDialog>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm Sản Phẩm
                </Button>
              </AddProductDialog>
            </div>
          </div>

          {/* Products Table */}
          <ProductsTable />
        </div>
      </div>
    </div>
  )
}
