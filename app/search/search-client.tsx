"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

interface SearchClientProps {
  keyword: string
  currentPage: number
  totalPages: number
}

export function SearchClient({ keyword, currentPage, totalPages }: SearchClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="mt-8 flex justify-center">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (currentPage > 0) {
                  handlePageChange(currentPage - 1)
                }
              }}
              className={currentPage === 0 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
            let pageNum: number
            if (totalPages <= 10) {
              pageNum = i
            } else if (currentPage < 5) {
              pageNum = i
            } else if (currentPage > totalPages - 6) {
              pageNum = totalPages - 10 + i
            } else {
              pageNum = currentPage - 5 + i
            }
            return (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageChange(pageNum)
                  }}
                  isActive={pageNum === currentPage}
                >
                  {pageNum + 1}
                </PaginationLink>
              </PaginationItem>
            )
          })}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (currentPage < totalPages - 1) {
                  handlePageChange(currentPage + 1)
                }
              }}
              className={currentPage >= totalPages - 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
