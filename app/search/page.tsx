'use client'

import { Suspense, useEffect, useState } from "react"
import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { ProductCard } from "@/components/product/product-card"
import { useSearchProducts } from "@/hooks/useProducts"
import { Product } from "@/lib/api/products"
import { useSearchParams } from "next/navigation"

function SearchContent() {
    const searchParams = useSearchParams()
    const keyword = searchParams.get('q') || ''
    const { products, loading, error } = useSearchProducts(keyword, 0, 24)

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
                    <p className="text-lg text-muted-foreground">Vui lòng nhập từ khóa tìm kiếm</p>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Đang tìm kiếm...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <p className="text-destructive">Có lỗi xảy ra khi tìm kiếm</p>
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
                    Tìm thấy {products.length} sản phẩm
                </p>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground">Không tìm thấy sản phẩm nào</p>
                    <p className="text-sm text-muted-foreground mt-2">Thử tìm kiếm với từ khóa khác</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={transformProduct(product)} />
                    ))}
                </div>
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
