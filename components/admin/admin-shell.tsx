"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Store,
  Truck,
  TicketPercent,
  AlertCircle,
  BarChart3,
  Settings,
  Home,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const menuItems = [
  { icon: LayoutDashboard, label: "Tổng quan", href: "/admin", tab: "overview" },
  { icon: Users, label: "Người dùng", href: "/admin?tab=users", tab: "users" },
  { icon: Store, label: "Seller", href: "/admin?tab=sellers", tab: "sellers" },
  { icon: Truck, label: "Vận đơn", href: "/admin?tab=shipments", tab: "shipments" },
  { icon: TicketPercent, label: "Voucher", href: "/admin?tab=vouchers", tab: "vouchers" },
  { icon: AlertCircle, label: "Khiếu nại", href: "/admin?tab=complaints", tab: "complaints" },
  { icon: BarChart3, label: "Hệ thống", href: "/admin?tab=system", tab: "system" },
  { icon: Settings, label: "Cấu hình", href: "/admin?tab=settings", tab: "settings" },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex-1 min-h-screen bg-background">{children}</div>
    </div>
  )
}

function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentTab = searchParams?.get("tab") ?? "overview"

  const isItemActive = (itemTab?: string, itemHref?: string) => {
    if (itemTab) {
      return pathname === "/admin" && currentTab === itemTab
    }
    return pathname === itemHref
  }

  return (
    <aside className={`bg-white border-r transition-all duration-300 ${collapsed ? "w-16" : "w-64"} flex flex-col`}>
      <div className="p-6 border-b">
        <Link href="/admin" prefetch={false} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">A</div>
          {!collapsed && <span className="font-bold text-lg">Admin Center</span>}
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const active = isItemActive(item.tab, item.href)
          return (
            <Link key={item.href} href={item.href} prefetch={false}>
              <Button
                variant={active ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 ${collapsed ? "px-2" : ""}`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t space-y-2">
        <Button variant="outline" asChild className="w-full justify-start gap-3">
          <Link href="/" prefetch={false}>
            <Home className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Về trang bán</span>}
          </Link>
        </Button>
        <Button variant="ghost" onClick={() => setCollapsed((prev) => !prev)} className="w-full justify-center">
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </Button>
      </div>
    </aside>
  )
}


