import { SellerSidebar } from "@/components/seller/seller-sidebar"
import { CategoriesClient } from "./categories-client"
import { serverCategoriesApi } from "@/lib/api/server"
import { Category } from "@/lib/api/categories"

export default async function SellerCategoriesPage() {
    // Fetch categories on server
    const response = await serverCategoriesApi.getAll()
    const categories: Category[] = response.success && response.data
        ? (Array.isArray(response.data) ? response.data : [])
        : []

    return (
        <div className="flex min-h-screen bg-background">
            <SellerSidebar />
            <div className="flex-1">
                <CategoriesClient initialCategories={categories} />
            </div>
        </div>
    )
}
