import { Button } from '@/components/ui/button'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons'

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

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(1)}
        disabled={!canGoPrevious}
      >
        <DoubleArrowLeftIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-1">
        <span className="text-sm font-medium">Page</span>
        <span className="text-sm font-medium">{currentPage}</span>
        <span className="text-sm font-medium">of</span>
        <span className="text-sm font-medium">{totalPages}</span>
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
      >
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(totalPages)}
        disabled={!canGoNext}
      >
        <DoubleArrowRightIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}
