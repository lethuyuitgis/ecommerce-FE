import { ProductsClient } from "./products-client"
import { serverCategoriesApi } from "@/lib/api/server"
import { redirect } from "next/navigation"

export default async function SellerProductsPage() {
  // Fetch categories on server
  const categoriesResponse = await serverCategoriesApi.getAll()
  
  if (!categoriesResponse.success) {
    redirect('/seller')
  }

  const categories = categoriesResponse.data || []

  return <ProductsClient initialCategories={categories} />
}
