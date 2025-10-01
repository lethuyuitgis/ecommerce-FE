import { Suspense } from "react"
import { CategoryHeader } from "@/components/category-header"
import { CategoryFilters } from "@/components/category-filters"
import { ProductGrid } from "@/components/product-grid"
import { CategoryBreadcrumb } from "@/components/category-breadcrumb"

const categories = {
  "thoi-trang-nam": {
    name: "Thời Trang Nam",
    description: "Khám phá bộ sưu tập thời trang nam đa dạng với các sản phẩm chất lượng cao",
    image: "/category-men-fashion.jpg",
    subcategories: ["Áo Thun", "Áo Sơ Mi", "Quần Jean", "Quần Kaki", "Áo Khoác", "Phụ Kiện"],
  },
  "thoi-trang-nu": {
    name: "Thời Trang Nữ",
    description: "Xu hướng thời trang nữ mới nhất với phong cách hiện đại và thanh lịch",
    image: "/category-women-fashion.jpg",
    subcategories: ["Váy", "Áo Kiểu", "Quần", "Đầm", "Áo Khoác", "Phụ Kiện"],
  },
  "dien-thoai": {
    name: "Điện Thoại & Phụ Kiện",
    description: "Điện thoại thông minh và phụ kiện chính hãng với giá tốt nhất",
    image: "/category-phone.jpg",
    subcategories: ["iPhone", "Samsung", "Xiaomi", "OPPO", "Vivo", "Phụ Kiện"],
  },
  "may-tinh": {
    name: "Máy Tính & Laptop",
    description: "Laptop, PC và thiết bị công nghệ cho công việc và giải trí",
    image: "/category-laptop.jpg",
    subcategories: ["Laptop Gaming", "Laptop Văn Phòng", "PC", "Màn Hình", "Bàn Phím", "Chuột"],
  },
  "my-pham": {
    name: "Làm Đẹp & Sức Khỏe",
    description: "Sản phẩm làm đẹp và chăm sóc sức khỏe chính hãng",
    image: "/category-beauty.jpg",
    subcategories: ["Skincare", "Makeup", "Nước Hoa", "Chăm Sóc Tóc", "Thực Phẩm Chức Năng"],
  },
  "nha-cua": {
    name: "Nhà Cửa & Đời Sống",
    description: "Đồ gia dụng và nội thất cho ngôi nhà của bạn",
    image: "/category-home.jpg",
    subcategories: ["Nội Thất", "Đồ Dùng Nhà Bếp", "Trang Trí", "Đèn", "Chăn Ga Gối"],
  },
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = await params
  const filters = await searchParams
  const category = categories[slug as keyof typeof categories]

  if (!category) {
    return <div>Danh mục không tồn tại</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CategoryBreadcrumb category={category.name} />
      <CategoryHeader name={category.name} description={category.description} image={category.image} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-64 flex-shrink-0">
            <CategoryFilters subcategories={category.subcategories} currentFilters={filters} />
          </aside>
          <main className="flex-1">
            <Suspense fallback={<div>Đang tải...</div>}>
              <ProductGrid category={slug} filters={filters} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}
