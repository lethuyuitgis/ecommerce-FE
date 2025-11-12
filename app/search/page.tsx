'use client'

import { Suspense, useEffect, useState } from "react"
import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { ProductCard } from "@/components/product/product-card"
import { Product, productsApi } from "@/lib/api/products"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2, Search as SearchIcon } from "lucide-react"

function SearchContent() {
    const searchParams = useSearchParams()
    const keyword = searchParams.get('q') || ''
    const [page, setPage] = useState(0)
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)
    const size = 24

    useEffect(() => {
        if (!keyword) {
            setProducts([])
            setLoading(false)
            return
        }

        const fetchProducts = async () => {
            try {
                setLoading(true)
                setError(null)
                const response = await productsApi.search(keyword, page, size)
                if (response.success && response.data) {
                    setProducts(response.data.content || [])
                    setTotalPages(response.data.totalPages || 0)
                    setTotalElements(response.data.totalElements || 0)
                } else {
                    setError(new Error(response.message || 'Không thể tìm kiếm sản phẩm'))
                }
            } catch (err) {
                setError(err as Error)
                setProducts([])
            } finally {
                setLoading(false)
            }
        }

        const timeoutId = setTimeout(fetchProducts, 300) // Debounce
        return () => clearTimeout(timeoutId)
    }, [keyword, page, size])

    // Reset page when keyword changes
    useEffect(() => {
        setPage(0)
    }, [keyword])

    // Transform API product to component product format
    const transformProduct = (product: Product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.comparePrice,
        image: product.primaryImage || product.images?.[0] || '/placeholder.svg',
        rating: product.rating || 0,
        sold: product.totalSold || 0,
        discount: product.comparePrice ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : undefined,
        category: product.categoryName,
    })

    if (!keyword) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <SearchIcon className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-lg text-muted-foreground">Vui lòng nhập từ khóa tìm kiếm</p>
                    <p className="text-sm text-muted-foreground mt-2">Sử dụng thanh tìm kiếm ở trên để tìm sản phẩm</p>
                </div>
            </div>
        )
    }

    if (loading && products.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Đang tìm kiếm "{keyword}"...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <p className="text-destructive mb-2">Có lỗi xảy ra khi tìm kiếm</p>
                    <p className="text-sm text-muted-foreground">{error.message}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">
                    Kết quả tìm kiếm cho "{keyword}"
                </h1>
                <p className="text-sm text-muted-foreground mt-2">
                    {totalElements > 0 ? `Tìm thấy ${totalElements.toLocaleString('vi-VN')} sản phẩm` : 'Không tìm thấy sản phẩm nào'}
                </p>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-12">
                    <SearchIcon className="mx-auto h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                    <p className="text-lg text-muted-foreground">Không tìm thấy sản phẩm nào</p>
                    <p className="text-sm text-muted-foreground mt-2">Thử tìm kiếm với từ khóa khác</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={transformProduct(product)} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-8 flex items-center justify-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(0, p - 1))}
                                disabled={page === 0 || loading}
                            >
                                Trước
                            </Button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum: number
                                    if (totalPages <= 5) {
                                        pageNum = i
                                    } else if (page < 3) {
                                        pageNum = i
                                    } else if (page > totalPages - 4) {
                                        pageNum = totalPages - 5 + i
                                    } else {
                                        pageNum = page - 2 + i
                                    }
                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={page === pageNum ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setPage(pageNum)}
                                            disabled={loading}
                                        >
                                            {pageNum + 1}
                                        </Button>
                                    )
                                })}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                disabled={page >= totalPages - 1 || loading}
                            >
                                Sau
                            </Button>
                        </div>
                    )}

                    {loading && products.length > 0 && (
                        <div className="mt-4 text-center">
                            <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default function SearchPage() {
    return (
        <div className="min-h-screen">
            <Header />
            <main className="bg-muted/30">
                <Suspense fallback={
                    <div className="container mx-auto px-4 py-8">
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">Đang tải...</p>
                        </div>
                    </div>
                }>
                    <SearchContent />
                </Suspense>
            </main>
            <Footer />
        </div>
    )
}
