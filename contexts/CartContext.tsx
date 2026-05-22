"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { cartApi, CartItem } from '@/lib/api/cart'
import { apiCache } from '@/lib/api/cache'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

interface CartContextType {
  cartItems: CartItem[]
  loading: boolean
  error: Error | null
  totalItems: number
  totalPrice: number
  addToCart: (productId: string, variantId: string | null, quantity: number, options?: any) => Promise<any>
  updateQuantity: (cartItemId: string, quantity: number) => Promise<any>
  removeItem: (cartItemId: string) => Promise<any>
  clearCart: () => Promise<any>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { isAuthenticated } = useAuth()

  const fetchCart = useCallback(async (skipCache: boolean = false) => {
    if (!isAuthenticated) {
      setCartItems([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      if (skipCache) {
        apiCache.invalidate('cart')
      }
      
      const response = await apiCache.get(
        'cart',
        () => cartApi.getCart(),
        skipCache ? 0 : 1 * 60 * 1000
      )
      
      if (response.success && response.data) {
        setCartItems(response.data)
      }
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const addToCart = useCallback(async (
    productId: string,
    variantId: string | null = null,
    quantity: number = 1,
    options?: any
  ) => {
    try {
      const response = await cartApi.addToCart(productId, variantId, quantity, options)
      if (response.success) {
        await fetchCart(true)
      }
      return response
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }, [fetchCart])

  const updateQuantity = useCallback(async (cartItemId: string, quantity: number) => {
    try {
      const response = await cartApi.updateCartItem(cartItemId, quantity)
      if (response.success) {
        await fetchCart(true)
      }
      return response
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }, [fetchCart])

  const removeItem = useCallback(async (cartItemId: string) => {
    try {
      const response = await cartApi.removeFromCart(cartItemId)
      if (response.success) {
        await fetchCart(true)
      }
      return response
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }, [fetchCart])

  const clearCart = useCallback(async () => {
    try {
      const response = await cartApi.clearCart()
      if (response.success) {
        setCartItems([])
        apiCache.invalidate('cart')
      }
      return response
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }, [])

  const totalItems = useMemo(() => 
    cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0),
    [cartItems]
  )
  
  const totalPrice = useMemo(() => 
    cartItems.reduce((sum, item) => sum + ((item.variantPrice || item.productPrice || 0) * (item.quantity || 0)), 0),
    [cartItems]
  )

  const value = {
    cartItems,
    loading,
    error,
    totalItems,
    totalPrice,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart: () => fetchCart(true),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
