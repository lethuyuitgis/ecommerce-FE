import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface CategoryBreadcrumbProps {
  category: string
}

export function CategoryBreadcrumb({ category }: CategoryBreadcrumbProps) {
  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="flex items-center gap-1 text-gray-600 hover:text-primary">
            <Home className="w-4 h-4" />
            <span>Trang chủ</span>
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-medium">{category}</span>
        </div>
      </div>
    </div>
  )
}
