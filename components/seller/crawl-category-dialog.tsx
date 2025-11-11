"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Globe, Loader2, Download, AlertCircle } from "lucide-react"
import { sellerApi } from "@/lib/api/seller"
import { useToast } from "@/hooks/use-toast"
import { useCategories } from "@/hooks/useCategories"
import { getShopeeCategoryId, validateCategorySlug } from "@/lib/services/crawler-utils"
import * as XLSX from "xlsx"

interface CrawlCategoryDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CrawlCategoryDialog({ open, onOpenChange }: CrawlCategoryDialogProps) {
    const [selectedCategory, setSelectedCategory] = useState("")
    const [selectedPlatform, setSelectedPlatform] = useState("shopee")
    const [limit, setLimit] = useState(30) // Default to 30 to avoid rate limiting
    const [isCrawling, setIsCrawling] = useState(false)
    const [progress, setProgress] = useState<{
        current: number
        total: number
        status: string
    } | null>(null)
    const { categories, loading: categoriesLoading } = useCategories()
    const { toast } = useToast()

    const handleCrawl = async () => {
        if (!selectedCategory) {
            toast({
                title: "Lỗi",
                description: "Vui lòng chọn danh mục",
                variant: "destructive",
            })
            return
        }

        setIsCrawling(true)
        setProgress({
            current: 0,
            total: limit,
            status: "Đang bắt đầu crawl...",
        })

        try {
            console.log('Starting crawl with:', {
                category: selectedCategory,
                platform: selectedPlatform,
                limit: limit,
                categoryType: typeof selectedCategory,
                categoryLength: selectedCategory?.length,
            })

            const response = await sellerApi.crawlCategory({
                category: selectedCategory,
                platform: selectedPlatform,
                limit: limit,
            })

            console.log('Crawl response:', JSON.stringify(response, null, 2)) // Debug log

            // Handle response - check both success flag and data existence
            if (!response.success) {
                toast({
                    title: "Lỗi",
                    description: response.message || "Không thể crawl sản phẩm. Vui lòng thử lại.",
                    variant: "destructive",
                })
                setIsCrawling(false)
                return
            }

            if (!response.data) {
                toast({
                    title: "Lỗi",
                    description: "API không trả về dữ liệu. Vui lòng thử lại.",
                    variant: "destructive",
                })
                setIsCrawling(false)
                return
            }

            // Handle different response structures
            let products: any[] = []
            let total = 0
            let errors: string[] = []

            if (Array.isArray(response.data)) {
                // If data is directly an array
                products = response.data
                total = response.data.length
            } else if (response.data.products && Array.isArray(response.data.products)) {
                // If data has products array (most common)
                products = response.data.products
                total = response.data.total || response.data.products.length
                errors = response.data.errors || []
            } else if (response.data.data && Array.isArray(response.data.data)) {
                // Nested data structure
                products = response.data.data
                total = response.data.total || response.data.data.length
                errors = response.data.errors || []
            } else {
                // Try to find products in any nested structure
                console.warn('Unexpected response structure:', response.data)
                products = []
            }

            console.log('Products extracted:', products.length, 'Total:', total, 'Errors:', errors.length)
            if (products.length > 0) {
                console.log('First product sample:', JSON.stringify(products[0], null, 2)) // Debug log
            }

            // Show errors if any
            if (errors.length > 0) {
                console.warn('Crawl errors:', errors)
            }

            if (products.length === 0) {
                const errorMsg = errors.length > 0
                    ? errors.join('. ')
                    : "Không tìm thấy sản phẩm nào để xuất Excel. Có thể do:\n- Danh mục không có sản phẩm\n- Nền tảng bị rate limit\n- API không trả về dữ liệu\n\nVui lòng thử lại với danh mục hoặc nền tảng khác."

                toast({
                    title: "Cảnh báo",
                    description: errorMsg,
                    variant: "destructive",
                    duration: 8000,
                })
                setIsCrawling(false)
                return
            }

            setProgress({
                current: products.length,
                total: total,
                status: `Đã crawl ${products.length} sản phẩm`,
            })

            // Export to Excel
            try {
                exportToExcel(products, selectedCategory)

                toast({
                    title: "Thành công",
                    description: `Đã crawl ${products.length} sản phẩm từ danh mục ${selectedCategory} và xuất ra Excel`,
                })
            } catch (exportError: any) {
                console.error('Export error:', exportError)
                toast({
                    title: "Lỗi xuất Excel",
                    description: exportError.message || "Không thể xuất file Excel. Vui lòng thử lại.",
                    variant: "destructive",
                })
            }

            // Close dialog after a delay
            setTimeout(() => {
                onOpenChange(false)
                setProgress(null)
            }, 3000)
        } catch (error: any) {
            const errorMessage = error.message || "Không thể crawl sản phẩm. Vui lòng thử lại."

            // Check if it's a rate limit error
            if (errorMessage.includes('rate limit') || errorMessage.includes('rate limited')) {
                toast({
                    title: "⚠️ Rate Limit",
                    description: `${errorMessage}\n\n💡 Gợi ý:\n- Thử lại sau 5-10 phút\n- Giảm số lượng sản phẩm (khuyến nghị: ≤ 20-30)\n- Thử nền tảng khác (Tiki, Lazada)`,
                    variant: "destructive",
                    duration: 10000, // Show for 10 seconds
                })
            } else {
                toast({
                    title: "Lỗi",
                    description: errorMessage,
                    variant: "destructive",
                })
            }
        } finally {
            setIsCrawling(false)
        }
    }

    const exportToExcel = (products: any[], category: string) => {
        // Validate products array
        if (!products || !Array.isArray(products) || products.length === 0) {
            console.error('Export failed: No products provided', products)
            throw new Error("Không có dữ liệu sản phẩm để xuất Excel")
        }

        console.log('Exporting products to Excel:', products.length)
        console.log('Sample product:', products[0]) // Debug first product

        // Prepare data for Excel
        const excelData = products.map((product, index) => {
            // Ensure product has required fields
            if (!product || typeof product !== 'object') {
                console.warn(`Invalid product at index ${index}:`, product)
                return {
                    STT: index + 1,
                    "Tên sản phẩm": "",
                    "Mô tả": "",
                    "Giá": 0,
                    "Giá so sánh": "",
                    "Danh mục": category,
                    "SKU": "",
                    "Hình ảnh": "",
                    "Kích thước": "",
                    "Màu sắc": "",
                    "Giá variant": "",
                    "Số lượng": "",
                }
            }

            // Handle images
            let imagesStr = ""
            if (product.images) {
                if (Array.isArray(product.images)) {
                    imagesStr = product.images.filter(Boolean).join(", ")
                } else if (typeof product.images === 'string') {
                    imagesStr = product.images
                }
            }

            // Handle variants
            let sizesStr = ""
            let colorsStr = ""
            let variantPricesStr = ""
            let variantStocksStr = ""

            if (product.variants && Array.isArray(product.variants)) {
                const sizes = product.variants.map((v: any) => v?.size).filter(Boolean)
                const colors = product.variants.map((v: any) => v?.color).filter(Boolean)
                const prices = product.variants.map((v: any) => v?.price).filter((p: any) => p !== undefined && p !== null)
                const stocks = product.variants.map((v: any) => v?.stock).filter((s: any) => s !== undefined && s !== null)

                sizesStr = sizes.join(", ")
                colorsStr = colors.join(", ")
                variantPricesStr = prices.join(", ")
                variantStocksStr = stocks.join(", ")
            }

            // Ensure name exists - this is critical
            const productName = product.name || product.title || product.product_name || ""

            if (!productName || productName.trim() === "") {
                console.warn(`Product at index ${index} has no name:`, product)
            }

            return {
                STT: index + 1,
                "Tên sản phẩm": productName,
                "Mô tả": product.description || product.desc || "",
                "Giá": product.price || product.original_price || 0,
                "Giá so sánh": product.comparePrice || product.compare_price || product.original_price || "",
                "Danh mục": category,
                "SKU": product.sku || product.item_id || product.id || "",
                "Hình ảnh": imagesStr,
                "Kích thước": sizesStr,
                "Màu sắc": colorsStr,
                "Giá variant": variantPricesStr,
                "Số lượng": variantStocksStr,
            }
        })

        // Log sample data for debugging
        if (excelData.length > 0) {
            console.log('First Excel row sample:', excelData[0])
        }

        // Validate excelData
        if (!excelData || excelData.length === 0) {
            console.error('No excel data to export')
            throw new Error("Không có dữ liệu hợp lệ để xuất Excel")
        }

        console.log('Excel data prepared:', excelData.length, 'rows')
        console.log('Sample excel row:', excelData[0]) // Debug first row

        // Verify data integrity - filter out rows without product name
        const validRows = excelData.filter((row: any) => {
            const hasName = row["Tên sản phẩm"] && row["Tên sản phẩm"].trim() !== ""
            if (!hasName) {
                console.warn('Row without product name:', row)
            }
            return hasName
        })

        if (validRows.length === 0) {
            console.error('No valid rows found. All rows:', excelData)
            throw new Error("Tất cả các sản phẩm đều không có tên. Không thể xuất Excel.")
        }

        console.log('Valid rows to export:', validRows.length, 'out of', excelData.length)

        // Create workbook and worksheet
        const wb = XLSX.utils.book_new()

        // Use valid rows only
        const ws = XLSX.utils.json_to_sheet(validRows)

        // Set column widths
        const colWidths = [
            { wch: 5 },   // STT
            { wch: 30 },  // Tên sản phẩm
            { wch: 50 },  // Mô tả
            { wch: 15 },  // Giá
            { wch: 15 },  // Giá so sánh
            { wch: 20 },  // Danh mục
            { wch: 15 },  // SKU
            { wch: 100 }, // Hình ảnh
            { wch: 20 },  // Kích thước
            { wch: 20 },  // Màu sắc
            { wch: 20 },  // Giá variant
            { wch: 15 },  // Số lượng
        ]
        ws["!cols"] = colWidths

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, "Sản phẩm")

        // Generate filename with timestamp
        const timestamp = new Date().toISOString().split("T")[0]
        const timeStr = new Date().toTimeString().split(" ")[0].replace(/:/g, '-')
        const safeCategory = category.replace(/[^a-z0-9]/gi, '_')
        const filename = `products_${safeCategory}_${timestamp}_${timeStr}.xlsx`

        // Write file
        try {
            XLSX.writeFile(wb, filename)
            console.log('Excel file exported successfully:', filename, 'with', validRows.length, 'rows')
        } catch (writeError: any) {
            console.error('Error writing Excel file:', writeError)
            throw new Error(`Không thể ghi file Excel: ${writeError.message}`)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Crawl Sản Phẩm Theo Danh Mục</DialogTitle>
                    <DialogDescription>
                        Crawl sản phẩm từ các trang thương mại điện tử theo danh mục và xuất ra file Excel
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Category Selection */}
                    <div>
                        <Label htmlFor="category">
                            Danh mục <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={selectedCategory}
                            onValueChange={(value) => {
                                setSelectedCategory(value)
                                // Validate category slug
                                if (value && selectedPlatform) {
                                    const isValid = validateCategorySlug(value, selectedPlatform as 'shopee' | 'lazada' | 'tiki' | 'sendo')
                                    if (!isValid) {
                                        console.warn(`Category slug "${value}" may not be supported for platform "${selectedPlatform}"`)
                                    }
                                }
                            }}
                            disabled={isCrawling || categoriesLoading}
                        >
                            <SelectTrigger className="mt-2">
                                <SelectValue placeholder="Chọn danh mục" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => {
                                    const isValid = validateCategorySlug(category.slug, selectedPlatform as 'shopee' | 'lazada' | 'tiki' | 'sendo')
                                    const categoryId = selectedPlatform === 'shopee' ? getShopeeCategoryId(category.slug) : null

                                    return (
                                        <SelectItem key={category.id} value={category.slug}>
                                            <div className="flex items-center justify-between w-full">
                                                <span>{category.name}</span>
                                                {!isValid && (
                                                    <AlertCircle className="h-3 w-3 ml-2 text-amber-500" title="Category may not be supported for this platform" />
                                                )}
                                            </div>
                                        </SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </Select>
                        {selectedCategory && (
                            <div className="mt-2 text-sm">
                                {selectedPlatform === 'shopee' && (() => {
                                    const categoryId = getShopeeCategoryId(selectedCategory)
                                    if (categoryId) {
                                        return (
                                            <p className="text-green-600">
                                                ✓ Category ID: {categoryId}
                                            </p>
                                        )
                                    } else {
                                        return (
                                            <p className="text-amber-600 flex items-center gap-1">
                                                <AlertCircle className="h-4 w-4" />
                                                Category "{selectedCategory}" may not be mapped. Will try to use as category ID.
                                            </p>
                                        )
                                    }
                                })()}
                            </div>
                        )}
                    </div>

                    {/* Platform Selection */}
                    <div>
                        <Label htmlFor="platform">
                            Nền tảng <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={selectedPlatform}
                            onValueChange={setSelectedPlatform}
                            disabled={isCrawling}
                        >
                            <SelectTrigger className="mt-2">
                                <SelectValue placeholder="Chọn nền tảng" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="shopee">Shopee</SelectItem>
                                <SelectItem value="lazada">Lazada</SelectItem>
                                <SelectItem value="tiki">Tiki</SelectItem>
                                <SelectItem value="sendo">Sendo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Limit */}
                    <div>
                        <Label htmlFor="limit">
                            Số lượng sản phẩm <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="limit"
                            type="number"
                            min={1}
                            max={500}
                            value={limit}
                            onChange={(e) => setLimit(parseInt(e.target.value) || 30)}
                            className="mt-2"
                            disabled={isCrawling}
                        />
                        <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-500">
                                Số lượng sản phẩm tối đa: 500
                            </p>
                            {limit > 50 && (
                                <p className="text-sm text-amber-600">
                                    ⚠️ Số lượng lớn ({limit}) có thể gặp rate limiting. Khuyến nghị: ≤ 30 sản phẩm để tránh bị chặn.
                                </p>
                            )}
                            {limit <= 30 && limit > 0 && (
                                <p className="text-sm text-green-600">
                                    ✓ Số lượng này ít khả năng bị rate limit
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Progress */}
                    {progress && (
                        <div className="p-4 border rounded-lg bg-muted/50">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">{progress.status}</span>
                                <span className="text-sm text-muted-foreground">
                                    {progress.current}/{progress.total}
                                </span>
                            </div>
                            <div className="w-full bg-background rounded-full h-2">
                                <div
                                    className="bg-primary h-2 rounded-full transition-all"
                                    style={{
                                        width: `${(progress.current / progress.total) * 100}%`,
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isCrawling}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleCrawl}
                        disabled={isCrawling || !selectedCategory}
                    >
                        {isCrawling ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Đang crawl...
                            </>
                        ) : (
                            <>
                                <Globe className="w-4 h-4 mr-2" />
                                Crawl & Xuất Excel
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

