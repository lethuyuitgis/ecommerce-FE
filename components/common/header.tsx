"use client"

import { useState } from "react"
import { Search, ShoppingCart, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { NotificationDropdown } from "@/components/common/notification-dropdown"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/hooks/useCart"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const { totalItems } = useCart()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary shadow-sm">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2 text-sm">
            <div className="flex items-center gap-4">
              <Link href="/seller" className="hover:opacity-80">
                Kênh Người Bán
              </Link>

              <div className="flex items-center gap-2">
                <span>Kết nối</span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20"
                  >
                    <span className="sr-only">Facebook</span>
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20"
                  >
                    <span className="sr-only">Instagram</span>
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057-1.645.069-4.849.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/help" className="hover:opacity-80">
                Hỗ Trợ
              </Link>
              {isAuthenticated ? (
                <>
                  <NotificationDropdown />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/20">
                        <User className="mr-2 h-4 w-4" />
                        {user?.fullName || user?.email || user?.shopName}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white text-foreground min-w-48">
                      <DropdownMenuItem onClick={() => router.push('/profile')}>
                        <User className="mr-2 h-4 w-4" />
                        Tài khoản của tôi
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push('/orders')}>
                        Đơn hàng của tôi
                      </DropdownMenuItem>
                      {user?.userType === 'SELLER' && (
                        <DropdownMenuItem onClick={() => router.push('/seller')}>
                          Kênh người bán
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Đăng xuất
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Link href="/register" className="hover:opacity-80">
                    Đăng Ký
                  </Link>
                  <Link href="/login" className="hover:opacity-80">
                    Đăng Nhập
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-8 py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
              <span className="text-2xl font-bold">ShopCuaThuy</span>
            </Link>

            {/* Search Bar */}
            <div className="flex-1">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="search"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full rounded-sm border-0 bg-white pr-12 text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-white"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-0 top-0 h-10 rounded-l-none rounded-r-sm bg-secondary hover:bg-secondary/90"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <Link href="/search?q=áo thun" className="hover:opacity-80">
                  Áo Thun
                </Link>
                <Link href="/search?q=giày thể thao" className="hover:opacity-80">
                  Giày Thể Thao
                </Link>
                <Link href="/search?q=túi xách" className="hover:opacity-80">
                  Túi Xách
                </Link>
                <Link href="/search?q=điện thoại" className="hover:opacity-80">
                  Điện Thoại
                </Link>
              </div>
            </div>

            {/* Cart */}
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-primary-foreground hover:bg-primary-foreground/20"
              >
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full bg-white px-1 text-xs text-primary">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="border-t border-primary-foreground/20 bg-primary">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6 py-2 text-sm text-primary-foreground">
            <Link href="/category/thoi-trang-nam" className="hover:opacity-80">
              Thời Trang Nam
            </Link>
            <Link href="/category/thoi-trang-nu" className="hover:opacity-80">
              Thời Trang Nữ
            </Link>
            <Link href="/category/dien-thoai" className="hover:opacity-80">
              Điện Thoại & Phụ Kiện
            </Link>
            <Link href="/category/may-tinh" className="hover:opacity-80">
              Máy Tính & Laptop
            </Link>
            <Link href="/category/nha-cua" className="hover:opacity-80">
              Nhà Cửa & Đời Sống
            </Link>
            <Link href="/category/sac-dep" className="hover:opacity-80">
              Sắc Đẹp
            </Link>
            <Link href="/category/the-thao" className="hover:opacity-80">
              Thể Thao & Du Lịch
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
