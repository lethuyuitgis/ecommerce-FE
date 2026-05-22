"use client"

import { useCart as useCartContext } from '@/contexts/CartContext'

/**
 * Hook to access cart functionality
 * Now uses CartContext to share state across components
 */
export function useCart() {
  return useCartContext()
}
