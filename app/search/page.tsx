import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { ProductCard } from "@/components/product/product-card"
import { serverProductsApi, serverCategoriesApi } from "@/lib/api/server"
import { Product } from "@/lib/api/products"
import { SearchClient } from "./search-client"
import { SearchFilters } from "./search-filters"
import { Search as SearchIcon } from "lucide-react"

interface SearchPageProps {
    searchParams: Promise<{ q?: string; page?: string }> | { q?: string; page?: string }
}

async function SearchContent({ 
    keyword, 
    page,
    categoryId,
    minPrice,
    maxPrice,
    minRating,
    sortBy,
    direction
}: { 
    keyword: string
    page: number
    categoryId?: string
    minPrice?: number
    maxPrice?: number
    minRating?: number
    sortBy?: string
    direction?: string
}) {
    const size = 24
    const response = await serverProductsApi.search(keyword, page, size, {
        categoryId,
        minPrice,
        maxPrice,
        minRating,
        sortBy: sortBy || 'createdAt',
        direction: direction || 'DESC'
    })
    
    const products: Product[] = response.success && response.data?.content 
        ? response.data.content 
        : []
    const totalPages = response.data?.totalPages || 0
    const totalElements = response.data?.totalElements || 0

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

    // Fetch categories for filter
    const categoriesResponse = await serverCategoriesApi.getAll()
    const categories = categoriesResponse.success && categoriesResponse.data 
        ? categoriesResponse.data.map(cat => ({ id: cat.id, name: cat.name }))
        : []

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

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Filters Sidebar */}
                <div className="lg:col-span-1">
                    <SearchFilters categories={categories} />
                </div>

                {/* Products Grid */}
                <div className="lg:col-span-3">
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

                        {/* Pagination - Client component for interactivity */}
                        {totalPages > 1 && (
                            <SearchClient keyword={keyword} currentPage={page} totalPages={totalPages} />
                        )}
                    </>
                )}
                </div>
            </div>
        </div>
    )
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const resolvedParams = searchParams instanceof Promise ? await searchParams : searchParams
    const keyword = resolvedParams.q || ''
    const page = parseInt(resolvedParams.page || '0', 10)
    const categoryId = resolvedParams.categoryId
    const minPrice = resolvedParams.minPrice ? Number(resolvedParams.minPrice) : undefined
    const maxPrice = resolvedParams.maxPrice ? Number(resolvedParams.maxPrice) : undefined
    const minRating = resolvedParams.minRating ? Number(resolvedParams.minRating) : undefined
    const sortBy = resolvedParams.sortBy
    const direction = resolvedParams.direction

    return (
        <div className="min-h-screen">
            <Header />
            <main className="bg-muted/30">
                <SearchContent 
                    keyword={keyword} 
                    page={page}
                    categoryId={categoryId}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    minRating={minRating}
                    sortBy={sortBy}
                    direction={direction}
                />
            </main>
            <Footer />
        </div>
    )
}
