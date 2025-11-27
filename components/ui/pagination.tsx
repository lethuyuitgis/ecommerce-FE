import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav role="navigation" aria-label="pagination" className={cn("mx-auto flex w-full justify-center", className)} {...props} />
)
Pagination.displayName = "Pagination"

const PaginationContent = ({ className, ...props }: React.ComponentProps<"ul">) => (
  <ul className={cn("flex flex-row items-center gap-1 text-sm font-medium", className)} {...props} />
)
PaginationContent.displayName = "PaginationContent"

const PaginationItem = ({ className, ...props }: React.ComponentProps<"li">) => (
  <li className={cn("", className)} {...props} />
)
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = React.ComponentProps<"a"> & {
  isActive?: boolean
}

const PaginationLink = ({ className, isActive, ...props }: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      "flex h-9 min-w-[36px] items-center justify-center rounded-md border px-3 text-sm transition-colors hover:bg-muted/80",
      isActive && "border-primary bg-primary text-primary-foreground hover:bg-primary/90",
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({ className, ...props }: PaginationLinkProps) => (
  <PaginationLink className={cn("gap-1 pl-2.5", className)} {...props}>
    <ChevronLeft className="h-4 w-4" />
    <span>Trước</span>
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({ className, ...props }: PaginationLinkProps) => (
  <PaginationLink className={cn("gap-1 pr-2.5", className)} {...props}>
    <span>Sau</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span className={cn("flex h-9 min-w-[36px] items-center justify-center", className)} {...props}>
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}



