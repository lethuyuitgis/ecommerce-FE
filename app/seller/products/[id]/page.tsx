import { ProductDetailClient } from "./product-detail-client"
import { serverSellerApi } from "@/lib/api/server"
import { notFound } from "next/navigation"
import { SellerSidebar } from "@/components/seller/seller-sidebar"
import { cookies, headers } from "next/headers"

export default async function ProductDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> | { id: string } 
}) {
  const resolvedParams = params instanceof Promise ? await params : params
  const cookieStore = await cookies()
  const headersList = await headers()
  
  // Fetch product on server with authentication
  const productResponse = await serverSellerApi.getProductById(resolvedParams.id, cookieStore, headersList)
  
  // Log error for debugging
  if (!productResponse.success) {
    console.error('[ProductDetailPage] Failed to fetch product:', {
      id: resolvedParams.id,
      message: productResponse.message,
      error: productResponse.error,
    })
    
    // If 403 or 404, show not found
    if (productResponse.error?.includes('403') || 
        productResponse.error?.includes('404') ||
        productResponse.message?.includes('not found') ||
        productResponse.message?.includes('Access denied')) {
      notFound()
    }
  }
  
  if (!productResponse.success || !productResponse.data) {
    notFound()
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SellerSidebar />
      <div className="flex-1">
        <ProductDetailClient initialProduct={productResponse.data} />
      </div>
    </div>
  )
}
