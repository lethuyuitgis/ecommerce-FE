"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  BarChart3,
  Settings,
  MessageSquare,
  Tag,
  Users,
  ListTree,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

const menuItems = [
  { icon: LayoutDashboard, label: "Tổng quan", href: "/seller" },
  { icon: ShoppingBag, label: "Đơn hàng", href: "/seller/orders" },
  { icon: Package, label: "Sản phẩm", href: "/seller/products" },
  { icon: ListTree, label: "Danh mục", href: "/seller/categories" },
  { icon: Tag, label: "Khuyến mãi", href: "/seller/promotions" },
  { icon: BarChart3, label: "Thống kê", href: "/seller/analytics" },
  { icon: MessageSquare, label: "Tin nhắn", href: "/seller/messages" },
  { icon: Users, label: "Khách hàng", href: "/seller/customers" },
  { icon: Settings, label: "Cài đặt", href: "/seller/settings" },
]

export function SellerSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside
      className={`bg-white border-r transition-all duration-300 ${collapsed ? "w-16" : "w-64"} flex flex-col relative`}
    >
      {/* Logo */}
      <div className="p-6 border-b">
        <Link href="/seller" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">S</div>
          {!collapsed && <span className="font-bold text-lg">Seller Center</span>}
        </Link>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href} prefetch={false}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 ${collapsed ? "px-2" : ""}`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Collapse Button */}
      <div className="p-4 border-t">
        <Button variant="ghost" onClick={() => setCollapsed(!collapsed)} className="w-full justify-center">
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </Button>
      </div>
    </aside>
  )
}
