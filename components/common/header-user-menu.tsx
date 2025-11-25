"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NotificationDropdown } from "@/components/common/notification-dropdown"
import { useAuth } from "@/contexts/AuthContext"
import { useRouteLoading } from "@/contexts/RouteLoadingContext"
import {
  LayoutDashboard,
  LogOut,
  ShoppingBag,
  Tag,
  Truck,
  User,
} from "lucide-react"
import type { User as UserProfile } from "@/lib/api/user"

type HeaderUserMenuProps = {
  initialUser?: Partial<UserProfile> | null
  initialIsAuthenticated?: boolean
}

export function HeaderUserMenu({ initialUser, initialIsAuthenticated }: HeaderUserMenuProps) {
  const router = useRouter()
  const { startNavigation } = useRouteLoading()
  const { isAuthenticated, user, logout } = useAuth()

  const hydratedUser = user ?? initialUser ?? null
  const loggedIn = typeof isAuthenticated === "boolean" ? isAuthenticated : !!initialIsAuthenticated
  const role = (hydratedUser?.userType || "").toUpperCase()

  const go = (path: string) => () => {
    startNavigation(path)
    router.push(path)
  }

  const handleLogout = () => {
    logout()
    startNavigation("/login")
    router.push("/login")
  }

  if (!loggedIn) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/register" prefetch={false} className="hover:opacity-80">
          Đăng Ký
        </Link>
        <Link href="/login" prefetch={false} className="hover:opacity-80">
          Đăng Nhập
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <NotificationDropdown />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/20">
            <User className="mr-2 h-4 w-4" />
            {hydratedUser?.fullName || hydratedUser?.email || "Tài khoản"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white text-foreground min-w-48">
          <DropdownMenuItem onClick={go("/profile")}>
            <User className="mr-2 h-4 w-4" />
            Tài khoản của tôi
          </DropdownMenuItem>
          <DropdownMenuItem onClick={go("/orders")}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Đơn hàng của tôi
          </DropdownMenuItem>
          {role === "ADMIN" && (
            <DropdownMenuItem onClick={go("/admin")}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Bảng điều khiển Admin
            </DropdownMenuItem>
          )}
          {role === "SELLER" && (
            <DropdownMenuItem onClick={go("/seller")}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Bảng điều khiển Seller
            </DropdownMenuItem>
          )}
          {role === "SHIPPER" && (
            <DropdownMenuItem onClick={go("/ship")}>
              <Truck className="mr-2 h-4 w-4" />
              Bảng điều khiển Shipper
            </DropdownMenuItem>
          )}
          {role === "CUSTOMER" && (
            <DropdownMenuItem onClick={go("/promotions")}>
              <Tag className="mr-2 h-4 w-4" />
              Ưu đãi dành cho bạn
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}


