"use client"

import { useEffect, useState } from "react"
import { AddProductDialog } from "@/components/seller/add-product-dialog"
import { ProductsTable } from "@/components/seller/products-table"
import { SellerSidebar } from "@/components/seller/seller-sidebar"
import { CrawlCategoryDialog } from "@/components/seller/crawl-category-dialog"
import { ImportExcelDialog } from "@/components/seller/import-excel-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Search, Plus, Download, Upload, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { categoriesApi, Category } from "@/lib/api/categories"

export default function SellerProductsPage() {
  const [showCrawlCategory, setShowCrawlCategory] = useState(false)
  const [showImportExcel, setShowImportExcel] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [q, setQ] = useState("")
  const [categoryId, setCategoryId] = useState<string>("all")
  const [status, setStatus] = useState<string>("all")
  const [categories, setCategories] = useState<Category[]>([])
  const { toast } = useToast()
  useEffect(() => {
    categoriesApi.getAll().then((resp) => {
      if (resp.success && resp.data) setCategories(resp.data)
    }).catch(() => { })
  }, [])

  const handleImportSuccess = () => {
    // Refresh products table or show success message
    window.location.reload()
  }

  const handleExportExcel = async () => {
    setIsExporting(true)
    try {
      // Get auth headers
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }

      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      if (userId) {
        headers['X-User-Id'] = userId
      }

      // Get products from API
      const response = await fetch('/api/seller/products?page=0&size=1000', {
        headers,
      })
      const data = await response.json()

      if (data.success && data.data) {
        const products = data.data.content || data.data.products || []

        if (products.length === 0) {
          toast({
            title: "Thông báo",
            description: "Không có sản phẩm nào để xuất",
            variant: "destructive",
          })
          return
        }

        // Import XLSX dynamically
        const XLSX = await import('xlsx')

        // Prepare data for Excel
        const excelData = products.map((product: any, index: number) => ({
          STT: index + 1,
          "Tên sản phẩm": product.name || "",
          "Mô tả": product.description || "",
          "Giá": product.price || 0,
          "Giá so sánh": product.comparePrice || "",
          "Danh mục": product.categoryName || product.category?.name || "",
          "SKU": product.sku || "",
          "Hình ảnh": Array.isArray(product.images)
            ? product.images.join(", ")
            : (product.primaryImage || product.image || ""),
          "Số lượng": product.quantity || product.stock || 0,
          "Đã bán": product.totalSold || product.sold || 0,
          "Trạng thái": product.status || "",
        }))

        // Create workbook and worksheet
        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.json_to_sheet(excelData)

        // Set column widths
        ws["!cols"] = [
          { wch: 5 },
          { wch: 30 },
          { wch: 50 },
          { wch: 15 },
          { wch: 15 },
          { wch: 20 },
          { wch: 15 },
          { wch: 100 },
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
        ]

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, "Sản phẩm")

        // Generate filename with timestamp
        const timestamp = new Date().toISOString().split("T")[0]
        const filename = `products_${timestamp}.xlsx`

        // Write file
        XLSX.writeFile(wb, filename)

        toast({
          title: "Thành công",
          description: `Đã xuất ${products.length} sản phẩm ra file Excel: ${filename}`,
        })
      } else {
        toast({
          title: "Lỗi",
          description: data.message || "Không thể lấy danh sách sản phẩm",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error('Export error:', error)
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xuất file Excel. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SellerSidebar />
      <div className="flex-1">
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
                <Input placeholder="Tìm kiếm sản phẩm..." className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder="Danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  {categories.filter(c => c.isActive !== false).map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={setStatus}>
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
            <div className="flex gap-2 flex-wrap">

              <Button
                variant="outline"
                size="sm"
                onClick={handleExportExcel}
                disabled={isExporting}
              >
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? "Đang xuất..." : "Xuất Excel"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowImportExcel(true)}
              >
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
          <ProductsTable q={q || undefined} categoryId={categoryId !== 'all' ? categoryId : undefined} status={status !== 'all' ? status : undefined} />
        </div>
      </div>

      {/* Dialogs */}
      <CrawlCategoryDialog
        open={showCrawlCategory}
        onOpenChange={setShowCrawlCategory}
      />
      <ImportExcelDialog
        open={showImportExcel}
        onOpenChange={setShowImportExcel}
        onImportSuccess={handleImportSuccess}
      />
    </div>
  )
}
