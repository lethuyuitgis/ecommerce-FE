import { useState, useEffect, useCallback, useMemo } from 'react'
import { cartApi, CartItem } from '@/lib/api/cart'
import { apiCache } from '@/lib/api/cache'

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchCart = useCallback(async (skipCache: boolean = false) => {
    const cacheKey = 'cart'
    
    try {
      setLoading(true)
      
      if (skipCache) {
        apiCache.invalidate(cacheKey)
      }
      
      const response = await apiCache.get(
        cacheKey,
        () => cartApi.getCart(),
        1 * 60 * 1000 // 1 minute cache for cart
      )
      
      if (response.success && response.data) {
        setCartItems(response.data)
      }
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const addToCart = useCallback(async (
    productId: string,
    variantId: string | null = null,
    quantity: number = 1,
    options?: { size?: string; color?: string; [key: string]: any }
  ) => {
    // Optimistic update
    const optimisticItem: CartItem = {
      id: `temp-${Date.now()}`,
      productId,
      productName: '',
      productPrice: 0,
      quantity,
      availableQuantity: 0,
      size: options?.size,
      color: options?.color,
    }
    
    setCartItems(prev => [...prev, optimisticItem])
    
    try {
      const response = await cartApi.addToCart(productId, variantId, quantity, options)
      if (response.success) {
        // Invalidate cache and refetch
        apiCache.invalidate('cart')
        await fetchCart(true)
      } else {
        // Rollback on error
        setCartItems(prev => prev.filter(item => item.id !== optimisticItem.id))
      }
      return response
    } catch (err) {
      // Rollback on error
      setCartItems(prev => prev.filter(item => item.id !== optimisticItem.id))
      setError(err as Error)
      throw err
    }
  }, [fetchCart])

  const updateQuantity = useCallback(async (cartItemId: string, quantity: number) => {
    // Optimistic update
    setCartItems(prev => 
      prev.map(item => 
        item.id === cartItemId ? { ...item, quantity } : item
      )
    )
    
    try {
      const response = await cartApi.updateCartItem(cartItemId, quantity)
      if (response.success) {
        apiCache.invalidate('cart')
        await fetchCart(true)
      } else {
        // Rollback on error
        await fetchCart(true)
      }
      return response
    } catch (err) {
      // Rollback on error
      await fetchCart(true)
      setError(err as Error)
      throw err
    }
  }, [fetchCart])

  const removeItem = useCallback(async (cartItemId: string) => {
    // Optimistic update
    let removedItem: CartItem | undefined
    setCartItems(prev => {
      removedItem = prev.find(item => item.id === cartItemId)
      return prev.filter(item => item.id !== cartItemId)
    })
    
    try {
      const response = await cartApi.removeFromCart(cartItemId)
      if (response.success) {
        apiCache.invalidate('cart')
      } else {
        // Rollback on error
        if (removedItem) {
          setCartItems(prev => [...prev, removedItem!])
        }
      }
      return response
    } catch (err) {
      // Rollback on error
      if (removedItem) {
        setCartItems(prev => [...prev, removedItem!])
      }
      setError(err as Error)
      throw err
    }
  }, [])

  const clearCart = useCallback(async () => {
    // Optimistic update
    let previousItems: CartItem[] = []
    setCartItems(prev => {
      previousItems = [...prev]
      return []
    })
    
    try {
      const response = await cartApi.clearCart()
      if (response.success) {
        apiCache.invalidate('cart')
      } else {
        // Rollback on error
        setCartItems(previousItems)
      }
      return response
    } catch (err) {
      // Rollback on error
      setCartItems(previousItems)
      setError(err as Error)
      throw err
    }
  }, [])

  const totalItems = useMemo(() => 
    cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  )
  
  const totalPrice = useMemo(() => 
    cartItems.reduce((sum, item) => sum + (item.variantPrice || item.productPrice) * item.quantity, 0),
    [cartItems]
  )

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
    refreshCart: () => fetchCart(true),
  }
}






