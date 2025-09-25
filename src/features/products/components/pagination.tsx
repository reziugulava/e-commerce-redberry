import { Button } from '@/components/ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  // Generate the page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []

    if (totalPages <= 7) {
      // If we have 7 or fewer pages, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first 2 pages
      pages.push(1, 2)

      // Determine if we need ellipsis after first 2 pages
      const startGap = currentPage > 4
      if (startGap) {
        pages.push('...')
      }

      // Add current page and adjacent pages if not already included
      const start = Math.max(3, currentPage - 1)
      const end = Math.min(totalPages - 2, currentPage + 1)

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i)
        }
      }

      // Determine if we need ellipsis before last 2 pages
      const endGap = currentPage < totalPages - 3
      if (endGap) {
        pages.push('...')
      }

      // Always show last 2 pages
      if (!pages.includes(totalPages - 1)) {
        pages.push(totalPages - 1)
      }
      if (!pages.includes(totalPages)) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex items-center justify-center gap-1">
      {/* Previous button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>

      {/* Page numbers */}
      <div className="flex items-center gap-1 mx-2">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 py-1 text-gray-500"
              >
                ...
              </span>
            )
          }

          const pageNumber = page as number
          const isCurrentPage = pageNumber === currentPage

          return (
            <Button
              key={pageNumber}
              variant={isCurrentPage ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPageChange(pageNumber)}
              className={`min-w-[2.5rem] ${
                isCurrentPage
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-gray-100'
              }`}
            >
              {pageNumber}
            </Button>
          )
        })}
      </div>

      {/* Next button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
      >
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}
