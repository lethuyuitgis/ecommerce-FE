"use client"

import { useEffect, useState } from "react"
import { AddProductDialog } from "@/components/seller/add-product-dialog"
import { ProductsTable } from "@/components/seller/products-table"
import { SellerSidebar } from "@/components/seller/seller-sidebar"
import { ImportExcelDialog } from "@/components/seller/import-excel-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Download, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Category } from "@/lib/api/categories"

interface ProductsClientProps {
  initialCategories: Category[]
}

export function ProductsClient({ initialCategories }: ProductsClientProps) {
  const [showImportExcel, setShowImportExcel] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  const [debouncedQ, setDebouncedQ] = useState("")
  const [categoryId, setCategoryId] = useState<string>("all")
  const [status, setStatus] = useState<string>("all")
  const { toast } = useToast()

  useEffect(() => {
    const handler = window.setTimeout(() => {
      setDebouncedQ(searchInput.trim())
    }, 450)

    return () => window.clearTimeout(handler)
  }, [searchInput])

  const handleSearchSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault()
    setDebouncedQ(searchInput.trim())
  }

  const handleImportSuccess = () => {
    window.location.reload()
  }

  const handleExportExcel = async () => {
    setIsExporting(true)
    try {
      const { sellerApi } = await import('@/lib/api/seller')
      const { blob, filename } = await sellerApi.exportProducts()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)

      toast({
        title: "Thành công",
        description: `Đã xuất danh sách sản phẩm ra file ${filename}`,
      })
    } catch (error: any) {
      console.error('Export error:', error)
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xuất file. Vui lòng thử lại.",
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
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Quản Lý Sản Phẩm</h1>
            <p className="text-muted-foreground mt-1">Quản lý toàn bộ sản phẩm của shop</p>
          </div>

          <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center flex-1">
              <form className="flex flex-1 max-w-md gap-2" onSubmit={handleSearchSubmit}>
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm sản phẩm..."
                    className="pl-9"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  size="sm"
                  variant="secondary"
                  className="shrink-0"
                  disabled={searchInput.trim() === debouncedQ.trim()}
                >
                  Tìm
                </Button>
              </form>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder="Danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  {initialCategories.filter(c => c.isActive !== false).map(c => (
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

          <ProductsTable
            q={debouncedQ || undefined}
            categoryId={categoryId !== 'all' ? categoryId : undefined}
            status={status !== 'all' ? status : undefined}
          />
        </div>
      </div>

      <ImportExcelDialog
        open={showImportExcel}
        onOpenChange={setShowImportExcel}
        onImportSuccess={handleImportSuccess}
      />
    </div>
  )
}

