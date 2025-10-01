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
        <div className="grid grid-cols-5 gap-4 md:grid-cols-10">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="flex flex-col items-center gap-2 rounded-lg p-2 transition-colors hover:bg-muted"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/5">
                <img
                  src={category.icon || "/placeholder.svg"}
                  alt={category.name}
                  className="h-10 w-10 object-contain"
                />
              </div>
              <span className="text-center text-xs text-foreground">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
