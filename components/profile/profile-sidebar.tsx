"use client"

import { User, Package, Heart, MapPin, Bell, Shield, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { usePathname } from "next/navigation"

const menuItems = [
  { icon: User, label: "Thông Tin Tài Khoản", href: "/profile" },
  { icon: Package, label: "Đơn Hàng Của Tôi", href: "/orders" },
  { icon: Heart, label: "Sản Phẩm Yêu Thích", href: "/wishlist" },
  { icon: MapPin, label: "Địa Chỉ Của Tôi", href: "/addresses" },
  { icon: Bell, label: "Thông Báo", href: "/notifications" },
  { icon: Shield, label: "Đổi Mật Khẩu", href: "/change-password" },
]

export function ProfileSidebar() {
  const pathname = usePathname()

  return (
    <div className="rounded-lg bg-white p-6">
      <div className="mb-6 flex items-center gap-3 border-b pb-6">
        <Avatar className="h-16 w-16">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>NV</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-foreground">Nguyễn Văn A</h3>
          <p className="text-sm text-muted-foreground">nguyenvana@email.com</p>
        </div>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-destructive">
          <LogOut className="h-5 w-5" />
          <span>Đăng Xuất</span>
        </button>
      </nav>
    </div>
  )
}
