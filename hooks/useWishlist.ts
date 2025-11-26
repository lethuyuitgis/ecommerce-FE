import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { wishlistApi } from '@/lib/api/wishlist'
import { Product } from '@/lib/api/products'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'

const WISHLIST_QUERY_KEY = ['wishlist']

export function useWishlist() {
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuth()

  const wishlistQuery = useQuery({
    queryKey: WISHLIST_QUERY_KEY,
    queryFn: async () => {
      const response = await wishlistApi.getWishlist()
      if (response.success && response.data) {
        return response.data
      }
      return []
    },
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 0,
  })

  const requireAuth = () => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để sử dụng danh sách yêu thích')
      throw new Error('UNAUTHENTICATED')
    }
  }

  const addMutation = useMutation({
    mutationFn: async (productId: string) => {
      requireAuth()
      return wishlistApi.addToWishlist(productId)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY })
      toast.success('Đã thêm vào yêu thích')
    },
    onError: (error: any) => {
      if (error?.message === 'UNAUTHENTICATED') return
      toast.error(error?.message || 'Thêm vào yêu thích thất bại')
    },
  })

  const removeMutation = useMutation({
    mutationFn: async (productId: string) => {
      requireAuth()
      return wishlistApi.removeFromWishlist(productId)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY })
      toast.success('Đã xóa khỏi yêu thích')
    },
    onError: (error: any) => {
      if (error?.message === 'UNAUTHENTICATED') return
      toast.error(error?.message || 'Xóa khỏi yêu thích thất bại')
    },
  })

  const wishlist = useMemo<Product[]>(() => {
    if (!isAuthenticated) {
      return []
    }
    return wishlistQuery.data ?? []
  }, [isAuthenticated, wishlistQuery.data])

  const isInWishlist = async (productId: string): Promise<boolean> => {
    if (!isAuthenticated) return false
    const cached = queryClient.getQueryData<Product[]>(WISHLIST_QUERY_KEY)
    if (cached) {
      return cached.some((item) => item.id === productId)
    }
    const response = await wishlistApi.checkWishlist(productId)
    return response.success && response.data === true
  }

  return {
    wishlist,
    loading: wishlistQuery.isFetching,
    error: wishlistQuery.error,
    addToWishlist: (productId: string) => addMutation.mutateAsync(productId),
    removeFromWishlist: (productId: string) => removeMutation.mutateAsync(productId),
    isInWishlist,
    refreshWishlist: () => queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY }),
  }
}









