'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function SearchClient({ 
  keyword, 
  currentPage, 
  totalPages 
}: { 
  keyword: string
  currentPage: number
  totalPages: number 
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const navigateToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigateToPage(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0}
      >
        Trước
      </Button>
      <div className="flex items-center gap-1">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum: number
          if (totalPages <= 5) {
            pageNum = i
          } else if (currentPage < 3) {
            pageNum = i
          } else if (currentPage > totalPages - 4) {
            pageNum = totalPages - 5 + i
          } else {
            pageNum = currentPage - 2 + i
          }
          return (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => navigateToPage(pageNum)}
            >
              {pageNum + 1}
            </Button>
          )
        })}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigateToPage(Math.min(totalPages - 1, currentPage + 1))}
        disabled={currentPage >= totalPages - 1}
      >
        Sau
      </Button>
    </div>
  )
}

