import { useState, useEffect } from 'react'
import { wishlistApi } from '@/lib/api/wishlist'
import { Product } from '@/lib/api/products'
import { toast } from 'sonner'

export function useWishlist() {
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      const response = await wishlistApi.getWishlist()
      if (response.success && response.data) {
        setWishlist(response.data)
      }
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [])

  const addToWishlist = async (productId: string) => {
    try {
      const response = await wishlistApi.addToWishlist(productId)
      if (response.success) {
        await fetchWishlist()
        toast.success("Đã thêm vào yêu thích")
      }
    } catch (err: any) {
      toast.error(err.message || "Thêm vào yêu thích thất bại")
      throw err
    }
  }

  const removeFromWishlist = async (productId: string) => {
    try {
      const response = await wishlistApi.removeFromWishlist(productId)
      if (response.success) {
        await fetchWishlist()
        toast.success("Đã xóa khỏi yêu thích")
      }
    } catch (err: any) {
      toast.error(err.message || "Xóa khỏi yêu thích thất bại")
      throw err
    }
  }

  const isInWishlist = async (productId: string): Promise<boolean> => {
    try {
      const response = await wishlistApi.checkWishlist(productId)
      return response.success && response.data === true
    } catch (err) {
      return false
    }
  }

  return {
    wishlist,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refreshWishlist: fetchWishlist,
  }
}

