import { useSearchParams } from 'react-router-dom'
import type {
  ProductFilters,
  ProductSort,
} from '@/features/products/types/product'
import { ProductGrid } from '@/features/products/components/product-grid'
import { ProductFilters as Filters } from '@/features/products/components/product-filters'
import { useProducts } from '@/features/products/hooks/use-products'
import { ResultsCounter } from '@/features/products/components/results-counter'
import { Pagination } from '@/features/products/components/pagination'

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = searchParams.get('page')
  const priceFrom = searchParams.get('price_from')
  const priceTo = searchParams.get('price_to')
  const sort = searchParams.get('sort') as ProductSort | null

  const filters: ProductFilters = {
    price_from: priceFrom ? Number(priceFrom) : undefined,
    price_to: priceTo ? Number(priceTo) : undefined,
  }

  const { data: products, isLoading } = useProducts({
    page: page ? Number(page) : 1,
    filter: filters,
    sort: sort ?? undefined,
  })

  const handleFilterChange = (newFilters: ProductFilters) => {
    const params = new URLSearchParams(searchParams)
    if (newFilters.price_from) {
      params.set('price_from', newFilters.price_from.toString())
    } else {
      params.delete('price_from')
    }
    if (newFilters.price_to) {
      params.set('price_to', newFilters.price_to.toString())
    } else {
      params.delete('price_to')
    }
    setSearchParams(params)
  }

  const handleSortChange = (newSort: ProductSort) => {
    const params = new URLSearchParams(searchParams)
    params.set('sort', newSort)
    setSearchParams(params)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', newPage.toString())
    setSearchParams(params)
  }

  const totalPages = products?.meta.last_page ?? 1

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">Products</h1>

      <Filters
        filters={filters}
        sort={sort ?? undefined}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />

      <div className="mb-4 flex items-center justify-between">
        <ResultsCounter
          currentPage={Number(page) || 1}
          perPage={products?.meta.per_page ?? 0}
          totalResults={products?.meta.total ?? 0}
        />
      </div>

      {products?.data && <ProductGrid products={products.data} />}

      {isLoading && (
        <div className="container py-8">
          <p>Loading...</p>
        </div>
      )}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={Number(page) || 1}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}
