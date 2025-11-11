import { useState, useEffect } from 'react'
import { cartApi, CartItem } from '@/lib/api/cart'

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchCart = async () => {
    try {
      setLoading(true)
      const response = await cartApi.getCart()
      if (response.success && response.data) {
        setCartItems(response.data)
      }
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const addToCart = async (productId: string, variantId: string | null = null, quantity: number = 1) => {
    try {
      const response = await cartApi.addToCart(productId, variantId, quantity)
      if (response.success) {
        await fetchCart()
      }
      return response
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    try {
      const response = await cartApi.updateCartItem(cartItemId, quantity)
      if (response.success) {
        await fetchCart()
      }
      return response
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  const removeItem = async (cartItemId: string) => {
    try {
      const response = await cartApi.removeFromCart(cartItemId)
      if (response.success) {
        await fetchCart()
      }
      return response
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  const clearCart = async () => {
    try {
      const response = await cartApi.clearCart()
      if (response.success) {
        setCartItems([])
      }
      return response
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.variantPrice || item.productPrice) * item.quantity, 0)

  return {
    cartItems,
    loading,
    error,
    totalItems,
    totalPrice,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart: fetchCart,
  }
}
