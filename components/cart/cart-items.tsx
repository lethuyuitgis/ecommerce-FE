"use client"

import { useState, useEffect } from "react"
import { Trash2, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useCart } from "@/hooks/useCart"
import { CartItem as CartItemType } from "@/lib/api/cart"
import { toast } from "sonner"

export function CartItems() {
  const { cartItems, loading, updateQuantity, removeItem, refreshCart } = useCart()
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  useEffect(() => {
    if (cartItems.length > 0 && selectedItems.length === 0) {
      setSelectedItems(cartItems.map((item) => item.id))
    }
  }, [cartItems])

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    try {
      await updateQuantity(id, newQuantity)
      toast.success("Cập nhật số lượng thành công")
    } catch (error: any) {
      toast.error(error.message || "Cập nhật thất bại")
    }
  }

  const handleRemoveItem = async (id: string) => {
    try {
      await removeItem(id)
      setSelectedItems((selected) => selected.filter((itemId) => itemId !== id))
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng")
    } catch (error: any) {
      toast.error(error.message || "Xóa thất bại")
    }
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

  if (loading) {
    return <div className="rounded-lg bg-white p-8 text-center">Đang tải giỏ hàng...</div>
  }

  if (cartItems.length === 0) {
    return (
      <div className="rounded-lg bg-white p-8 text-center">
        <p className="mb-4 text-muted-foreground">Giỏ hàng của bạn đang trống</p>
        <Link href="/">
          <Button>Tiếp tục mua sắm</Button>
        </Link>
      </div>
    )
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
        {cartItems.map((item) => {
          const price = item.variantPrice || item.productPrice
          const totalPrice = price * item.quantity

          return (
            <div key={item.id} className="flex items-center gap-4 p-4">
              <Checkbox checked={selectedItems.includes(item.id)} onCheckedChange={() => toggleSelectItem(item.id)} />
              <Link href={`/product/${item.productId}`} className="flex flex-1 items-center gap-4">
                <div className="h-20 w-20 overflow-hidden rounded border">
                  <img src={item.productImage || "/placeholder.svg"} alt={item.productName} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 font-medium text-foreground line-clamp-2">{item.productName}</h3>
                  {item.variantName && (
                    <p className="text-sm text-muted-foreground">
                      Phân loại: {item.variantName}
                    </p>
                  )}
                </div>
              </Link>
              <div className="w-24 text-center">
                <div className="font-medium text-foreground">₫{price.toLocaleString("vi-VN")}</div>
              </div>
              <div className="w-32">
                <div className="mx-auto flex w-fit items-center rounded-sm border">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    className="flex h-8 w-8 items-center justify-center border-r hover:bg-muted"
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const newQuantity = Number.parseInt(e.target.value) || 1
                      if (newQuantity >= 1 && newQuantity <= item.availableQuantity) {
                        handleUpdateQuantity(item.id, newQuantity)
                      }
                    }}
                    className="h-8 w-12 border-0 text-center text-sm focus:outline-none"
                  />
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    className="flex h-8 w-8 items-center justify-center border-l hover:bg-muted"
                    disabled={item.quantity >= item.availableQuantity}
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <div className="w-24 text-center font-semibold text-primary">
                ₫{totalPrice.toLocaleString("vi-VN")}
              </div>
              <div className="w-12 text-center">
                <button onClick={() => handleRemoveItem(item.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between border-t p-4">
        <div className="flex items-center gap-4">
          <Checkbox checked={selectedItems.length === cartItems.length} onCheckedChange={toggleSelectAll} />
          <span className="text-sm text-foreground">Chọn Tất Cả ({cartItems.length})</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              const itemsToRemove = [...selectedItems]
              for (const id of itemsToRemove) {
                await handleRemoveItem(id)
              }
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
              .reduce((total, item) => total + (item.variantPrice || item.productPrice) * item.quantity, 0)
              .toLocaleString("vi-VN")}
          </span>
        </div>
      </div>
    </div>
  )
}
