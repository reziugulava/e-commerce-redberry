import type { ProductFilters } from '../types/product'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FilterSummaryProps {
  filters: ProductFilters
  onFilterChange: (filters: ProductFilters) => void
}

export const FilterSummary = ({
  filters,
  onFilterChange,
}: FilterSummaryProps) => {
  const clearPriceFilter = () => {
    onFilterChange({
      ...filters,
      price_from: undefined,
      price_to: undefined,
    })
  }

  // Only show if price filters are active
  if (filters.price_from === undefined && filters.price_to === undefined) {
    return null
  }

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {/* Price filter tag */}
      <div className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm">
        <span>
          {filters.price_from && filters.price_to
            ? `Price: ${filters.price_from}-${filters.price_to}`
            : filters.price_from
              ? `Price: ${filters.price_from}+`
              : `Price: up to ${filters.price_to}`}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-4 w-4 p-0 hover:bg-gray-200"
          onClick={clearPriceFilter}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
