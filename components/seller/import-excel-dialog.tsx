"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Upload, Loader2, FileSpreadsheet, Download } from "lucide-react"
import { sellerApi } from "@/lib/api/seller"
import { useToast } from "@/hooks/use-toast"
import * as XLSX from "xlsx"

interface ImportExcelDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onImportSuccess?: () => void
}

export function ImportExcelDialog({ open, onOpenChange, onImportSuccess }: ImportExcelDialogProps) {
    const [file, setFile] = useState<File | null>(null)
    const [isImporting, setIsImporting] = useState(false)
    const [importResult, setImportResult] = useState<{
        success: number
        failed: number
        errors?: string[]
    } | null>(null)
    const { toast } = useToast()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            // Check if file is Excel
            const validTypes = [
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "application/vnd.ms-excel",
                "text/csv",
            ]

            if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(xlsx|xls|csv)$/i)) {
                toast({
                    title: "Lỗi",
                    description: "Vui lòng chọn file Excel (.xlsx, .xls) hoặc CSV",
                    variant: "destructive",
                })
                return
            }

            setFile(selectedFile)
            setImportResult(null)
        }
    }

    const handleImport = async () => {
        if (!file) {
            toast({
                title: "Lỗi",
                description: "Vui lòng chọn file Excel",
                variant: "destructive",
            })
            return
        }

        setIsImporting(true)
        setImportResult(null)

        try {
            const response = await sellerApi.importProducts(file)

            if (response.success) {
                setImportResult(response.data)

                toast({
                    title: "Thành công",
                    description: `Đã import ${response.data.success} sản phẩm. ${response.data.failed > 0 ? `${response.data.failed} sản phẩm thất bại.` : ''}`,
                })

                if (onImportSuccess) {
                    onImportSuccess()
                }

                // Close dialog after a delay
                setTimeout(() => {
                    onOpenChange(false)
                    setFile(null)
                    setImportResult(null)
                }, 3000)
            }
        } catch (error: any) {
            toast({
                title: "Lỗi",
                description: error.message || "Không thể import sản phẩm. Vui lòng thử lại.",
                variant: "destructive",
            })
        } finally {
            setIsImporting(false)
        }
    }

    const downloadTemplate = () => {
        // Create a simple template Excel file
        const templateData = [
            {
                "Tên sản phẩm": "Ví dụ: iPhone 15 Pro Max",
                "Mô tả": "Mô tả sản phẩm",
                "Giá": 29990000,
                "Giá so sánh": 32990000,
                "Danh mục": "dien-thoai-phu-kien",
                "SKU": "IP15PM256",
                "Hình ảnh": "https://example.com/image1.jpg, https://example.com/image2.jpg",
                "Kích thước": "256GB, 512GB",
                "Màu sắc": "Xanh, Đen, Trắng",
                "Giá variant": "29990000, 34990000",
                "Số lượng": "10, 5",
            },
        ]

        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.json_to_sheet(templateData)
        XLSX.utils.book_append_sheet(wb, ws, "Mẫu")
        XLSX.writeFile(wb, "template_import_products.xlsx")

        toast({
            title: "Thành công",
            description: "Đã tải file mẫu",
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Import Sản Phẩm Từ Excel</DialogTitle>
                    <DialogDescription>
                        Tải file Excel chứa danh sách sản phẩm để import vào hệ thống
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* File Upload */}
                    <div>
                        <Label htmlFor="excel-file">
                            Chọn file Excel <span className="text-red-500">*</span>
                        </Label>
                        <div className="mt-2">
                            <label
                                htmlFor="excel-file"
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    {file ? (
                                        <>
                                            <FileSpreadsheet className="w-10 h-10 text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-500">{file.name}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-10 h-10 text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-500">
                                                <span className="font-semibold">Click để chọn file</span> hoặc kéo thả
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Excel (.xlsx, .xls) hoặc CSV
                                            </p>
                                        </>
                                    )}
                                </div>
                                <input
                                    id="excel-file"
                                    type="file"
                                    className="hidden"
                                    accept=".xlsx,.xls,.csv"
                                    onChange={handleFileChange}
                                    disabled={isImporting}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Download Template */}
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                            <p className="text-sm font-medium">Chưa có file mẫu?</p>
                            <p className="text-xs text-gray-500">Tải file mẫu để xem định dạng</p>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={downloadTemplate}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Tải mẫu
                        </Button>
                    </div>

                    {/* Import Result */}
                    {importResult && (
                        <div className="p-4 border rounded-lg bg-muted/50">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Kết quả import</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex gap-4 text-sm">
                                    <span className="text-green-600">✓ Thành công: {importResult.success}</span>
                                    <span className="text-red-600">✗ Thất bại: {importResult.failed}</span>
                                </div>
                                {importResult.errors && importResult.errors.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-xs font-medium text-red-600 mb-1">Lỗi:</p>
                                        <div className="max-h-32 overflow-y-auto">
                                            {importResult.errors.map((error, index) => (
                                                <p key={index} className="text-xs text-red-600">
                                                    {error}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            onOpenChange(false)
                            setFile(null)
                            setImportResult(null)
                        }}
                        disabled={isImporting}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleImport}
                        disabled={isImporting || !file}
                    >
                        {isImporting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Đang import...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4 mr-2" />
                                Import
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
