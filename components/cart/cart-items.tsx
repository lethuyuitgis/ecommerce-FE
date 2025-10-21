"use client"

import { useState } from "react"
import { Trash2, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

interface CartItem {
  id: string
  name: string
  image: string
  price: number
  originalPrice?: number
  quantity: number
  size: string
  color: string
  stock: number
}

const initialCartItems: CartItem[] = [
  {
    id: "1",
    name: "Áo Thun Nam Cotton Cao Cấp",
    image: "/placeholder.svg?height=100&width=100",
    price: 129000,
    originalPrice: 199000,
    quantity: 2,
    size: "M",
    color: "Trắng",
    stock: 50,
  },
  {
    id: "2",
    name: "Quần Jean Nam Slim Fit",
    image: "/placeholder.svg?height=100&width=100",
    price: 299000,
    originalPrice: 499000,
    quantity: 1,
    size: "L",
    color: "Xanh",
    stock: 30,
  },
  {
    id: "3",
    name: "Giày Sneaker Thể Thao",
    image: "/placeholder.svg?height=100&width=100",
    price: 450000,
    originalPrice: 650000,
    quantity: 1,
    size: "42",
    color: "Đen",
    stock: 20,
  },
]

export function CartItems() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems)
  const [selectedItems, setSelectedItems] = useState<string[]>(cartItems.map((item) => item.id))

  const updateQuantity = (id: string, newQuantity: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, Math.min(item.stock, newQuantity)) } : item,
      ),
    )
  }

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
    setSelectedItems((selected) => selected.filter((itemId) => itemId !== id))
  }

  const toggleSelectItem = (id: string) => {
    setSelectedItems((selected) =>
      selected.includes(id) ? selected.filter((itemId) => itemId !== id) : [...selected, id],
    )
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(cartItems.map((item) => item.id))
    }
  }

  return (
    <div className="rounded-lg bg-white">
      {/* Header */}
      <div className="flex items-center gap-4 border-b p-4">
        <Checkbox checked={selectedItems.length === cartItems.length} onCheckedChange={toggleSelectAll} />
        <span className="flex-1 font-medium text-foreground">Sản Phẩm ({cartItems.length})</span>
        <span className="w-24 text-center text-sm text-muted-foreground">Đơn Giá</span>
        <span className="w-32 text-center text-sm text-muted-foreground">Số Lượng</span>
        <span className="w-24 text-center text-sm text-muted-foreground">Số Tiền</span>
        <span className="w-12 text-center text-sm text-muted-foreground">Thao Tác</span>
      </div>

      {/* Cart Items */}
      <div className="divide-y">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4">
            <Checkbox checked={selectedItems.includes(item.id)} onCheckedChange={() => toggleSelectItem(item.id)} />
            <Link href={`/product/${item.id}`} className="flex flex-1 items-center gap-4">
              <div className="h-20 w-20 overflow-hidden rounded border">
                <img src={item.image || "/placeholder.svg"} alt={item.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 font-medium text-foreground line-clamp-2">{item.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Phân loại: {item.color}, {item.size}
                </p>
              </div>
            </Link>
            <div className="w-24 text-center">
              {item.originalPrice && (
                <div className="text-xs text-muted-foreground line-through">
                  ₫{item.originalPrice.toLocaleString("vi-VN")}
                </div>
              )}
              <div className="font-medium text-foreground">₫{item.price.toLocaleString("vi-VN")}</div>
            </div>
            <div className="w-32">
              <div className="mx-auto flex w-fit items-center rounded-sm border">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="flex h-8 w-8 items-center justify-center border-r hover:bg-muted"
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                  className="h-8 w-12 border-0 text-center text-sm focus:outline-none"
                />
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="flex h-8 w-8 items-center justify-center border-l hover:bg-muted"
                  disabled={item.quantity >= item.stock}
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div className="w-24 text-center font-semibold text-primary">
              ₫{(item.price * item.quantity).toLocaleString("vi-VN")}
            </div>
            <div className="w-12 text-center">
              <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between border-t p-4">
        <div className="flex items-center gap-4">
          <Checkbox checked={selectedItems.length === cartItems.length} onCheckedChange={toggleSelectAll} />
          <span className="text-sm text-foreground">Chọn Tất Cả ({cartItems.length})</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const itemsToRemove = selectedItems
              itemsToRemove.forEach((id) => removeItem(id))
            }}
            disabled={selectedItems.length === 0}
          >
            Xóa
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Tổng thanh toán ({selectedItems.length} Sản phẩm):</span>
          <span className="text-2xl font-bold text-primary">
            ₫
            {cartItems
              .filter((item) => selectedItems.includes(item.id))
              .reduce((total, item) => total + item.price * item.quantity, 0)
              .toLocaleString("vi-VN")}
          </span>
        </div>
      </div>
    </div>
  )
}
