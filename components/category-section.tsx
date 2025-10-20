import Link from "next/link"

const categories = [
  {
    id: 1,
    name: "Thời Trang Nam",
    icon: "/category-men-fashion.jpg",
    href: "/category/thoi-trang-nam",
  },
  {
    id: 2,
    name: "Thời Trang Nữ",
    icon: "/category-women-fashion.jpg",
    href: "/category/thoi-trang-nu",
  },
  {
    id: 3,
    name: "Điện Thoại",
    icon: "/category-phone.jpg",
    href: "/category/dien-thoai",
  },
  {
    id: 4,
    name: "Máy Tính",
    icon: "/category-laptop.jpg",
    href: "/category/may-tinh",
  },
  {
    id: 5,
    name: "Nhà Cửa",
    icon: "/category-home.jpg",
    href: "/category/nha-cua",
  },
  {
    id: 6,
    name: "Sắc Đẹp",
    icon: "/category-beauty.jpg",
    href: "/category/sac-dep",
  },
  {
    id: 7,
    name: "Thể Thao",
    icon: "/category-sports.jpg",
    href: "/category/the-thao",
  },
  {
    id: 8,
    name: "Giày Dép",
    icon: "/category-shoes.jpg",
    href: "/category/giay-dep",
  },
  {
    id: 9,
    name: "Túi Ví",
    icon: "/category-bags.jpg",
    href: "/category/tui-vi",
  },
  {
    id: 10,
    name: "Đồng Hồ",
    icon: "/category-watch.jpg",
    href: "/category/dong-ho",
  },
]

export function CategorySection() {
  return (
    <section className="border-b bg-white">
      <div className="container mx-auto px-4 py-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">DANH MỤC</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group relative overflow-hidden rounded-lg transition-transform hover:scale-105"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                <img
                  src={category.icon || "/placeholder.svg"}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/40">
                  <span className="text-center text-sm font-semibold text-white drop-shadow-lg">{category.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
