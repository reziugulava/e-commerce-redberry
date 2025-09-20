import type { ProductFilters as Filters, ProductSort } from '../types/product'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ProductFiltersProps {
  filters: Filters
  sort: ProductSort | undefined
  onFilterChange: (filters: Filters) => void
  onSortChange: (sort: ProductSort) => void
}

export const ProductFilters = ({
  filters,
  sort,
  onFilterChange,
  onSortChange,
}: ProductFiltersProps) => {
  const handlePriceChange = (
    type: 'price_from' | 'price_to',
    value: string
  ) => {
    const numValue = value === '' ? undefined : Number(value)
    onFilterChange({
      ...filters,
      [type]: numValue,
    })
  }

  return (
    <div className="mb-8 flex flex-col gap-6 rounded-lg border bg-white p-6 sm:flex-row">
      <div className="flex flex-1 gap-4">
        <div className="w-full max-w-[200px]">
          <Label htmlFor="price-from">Price From</Label>
          <Input
            id="price-from"
            type="number"
            min={0}
            value={filters.price_from ?? ''}
            onChange={e => handlePriceChange('price_from', e.target.value)}
            placeholder="Min price"
          />
        </div>
        <div className="w-full max-w-[200px]">
          <Label htmlFor="price-to">Price To</Label>
          <Input
            id="price-to"
            type="number"
            min={0}
            value={filters.price_to ?? ''}
            onChange={e => handlePriceChange('price_to', e.target.value)}
            placeholder="Max price"
          />
        </div>
      </div>
      <div className="w-full max-w-[200px]">
        <Label>Sort By</Label>
        <Select value={sort} onValueChange={onSortChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price">Price: Low to High</SelectItem>
            <SelectItem value="-price">Price: High to Low</SelectItem>
            <SelectItem value="-created_at">Newest First</SelectItem>
            <SelectItem value="created_at">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
