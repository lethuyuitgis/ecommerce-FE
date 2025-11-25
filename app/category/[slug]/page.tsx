import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { ProductGridServer } from "@/components/product/product-grid-server"
import { serverCategoriesApi, serverProductsApi } from "@/lib/api/server"
import { CategoryBreadcrumb } from "@/components/common/category-breadcrumb"
import { CategoryFilters } from "@/components/common/category-filters"
import { CategoryHeader } from "@/components/common/category-header"
import { notFound } from "next/navigation"

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }> | { slug: string }
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined }
}) {
  const resolvedParams = params instanceof Promise ? await params : params
  const resolvedSearchParams = searchParams instanceof Promise 
    ? await searchParams 
    : (searchParams || {})

  const page = parseInt((resolvedSearchParams.page as string) || '0', 10)
  const size = 24
  
  // Extract filter values
  const filterParams = {
    minPrice: resolvedSearchParams.minPrice ? Number(resolvedSearchParams.minPrice) : undefined,
    maxPrice: resolvedSearchParams.maxPrice ? Number(resolvedSearchParams.maxPrice) : undefined,
    minRating: resolvedSearchParams.rating ? Number(resolvedSearchParams.rating) : undefined,
    subcategory: Array.isArray(resolvedSearchParams.subcategory) 
      ? resolvedSearchParams.subcategory[0] 
      : (resolvedSearchParams.subcategory as string | undefined),
  }

  // Fetch category and products in parallel
  const [categoryResponse, productsResponse] = await Promise.all([
    serverCategoriesApi.getBySlug(resolvedParams.slug),
    serverProductsApi.getByCategorySlug(resolvedParams.slug, page, size, filterParams),
  ])
  
  if (!categoryResponse.success || !categoryResponse.data) {
    notFound()
  }

  const category = categoryResponse.data
  const products = productsResponse.success && productsResponse.data?.content 
    ? productsResponse.data.content 
    : []
  const totalPages = productsResponse.data?.totalPages || 0
  const totalElements = productsResponse.data?.totalElements || 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <CategoryBreadcrumb category={category.name} />
        <CategoryHeader
          name={category.name}
          description={category.description || ''}
          image={category.coverImage || category.icon || "/placeholder.svg"}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <aside className="lg:w-64 shrink-0">
              <CategoryFilters
                subcategories={category.subcategories || []}
                currentFilters={resolvedSearchParams}
              />
            </aside>
            <main className="flex-1">
              <ProductGridServer 
                category={resolvedParams.slug} 
                filters={resolvedSearchParams}
                initialProducts={products}
                initialTotalPages={totalPages}
                initialTotalElements={totalElements}
                initialPage={page}
              />
            </main>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
