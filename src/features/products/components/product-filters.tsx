import type { ProductFilters as Filters, ProductSort } from '../types/product'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Filter } from 'lucide-react'
import { useState, useEffect } from 'react'

interface ProductFiltersProps {
  filters: Filters
  sort: ProductSort | undefined
  onFilterChange: (filters: Filters) => void
  onSortChange: (sort: ProductSort | undefined) => void
}

export const ProductFilters = ({
  filters,
  sort,
  onFilterChange,
  onSortChange,
}: ProductFiltersProps) => {
  // Local state for pending filter changes
  const [pendingFilters, setPendingFilters] = useState<Filters>(filters)

  // Update pending filters when props change
  useEffect(() => {
    setPendingFilters(filters)
  }, [filters])

  const handlePriceChange = (
    type: 'price_from' | 'price_to',
    value: string
  ) => {
    const numValue = value === '' ? undefined : Number(value)
    setPendingFilters({
      ...pendingFilters,
      [type]: numValue,
    })
  }

  const applyFilters = () => {
    onFilterChange(pendingFilters)
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 border-0 bg-transparent p-0 shadow-none hover:bg-transparent font-semibold"
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 p-4" align="start">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold">Price Range</Label>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label
                    htmlFor="price-from"
                    className="text-xs text-gray-600 font-medium"
                  >
                    From
                  </Label>
                  <Input
                    id="price-from"
                    type="number"
                    min={0}
                    value={pendingFilters.price_from ?? ''}
                    onChange={e =>
                      handlePriceChange('price_from', e.target.value)
                    }
                    placeholder="Min price"
                    className="mt-1"
                  />
                </div>
                <div className="flex-1">
                  <Label
                    htmlFor="price-to"
                    className="text-xs text-gray-600 font-medium"
                  >
                    To
                  </Label>
                  <Input
                    id="price-to"
                    type="number"
                    min={0}
                    value={pendingFilters.price_to ?? ''}
                    onChange={e =>
                      handlePriceChange('price_to', e.target.value)
                    }
                    placeholder="Max price"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Apply Button */}
              <div className="pt-2">
                <Button
                  onClick={applyFilters}
                  className="w-full text-white font-medium"
                  style={{ backgroundColor: '#FF4000' }}
                  onMouseEnter={e =>
                    (e.currentTarget.style.backgroundColor = '#E6390A')
                  }
                  onMouseLeave={e =>
                    (e.currentTarget.style.backgroundColor = '#FF4000')
                  }
                >
                  Apply
                </Button>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <Select
            value={sort || 'default'}
            onValueChange={value =>
              onSortChange(
                value === 'default' ? undefined : (value as ProductSort)
              )
            }
          >
            <SelectTrigger className="border-0 px-0 shadow-none justify-start gap-1 w-auto">
              <SelectValue placeholder="Sort by" className="font-semibold" />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectItem value="default" className="font-semibold">
                Sort by
              </SelectItem>
              <SelectItem value="-created_at">New products First</SelectItem>
              <SelectItem value="price">Price, Low to High</SelectItem>
              <SelectItem value="-price">Price, High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
