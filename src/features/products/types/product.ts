export interface Product {
  id: number
  name: string
  description: string
  release_date: string
  cover_image: string
  images: string[]
  price: number
  total_price: number
  quantity: number
  brand: Brand
}

export interface Brand {
  id: number
  name: string
  image: string
}

export interface ProductListItem {
  id: number
  name: string
  release_year: string
  cover_image: string
  price: number
}

export interface ProductsResponse {
  data: ProductListItem[]
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    per_page: number
    from: number
    to: number
    total: number
    last_page: number
    links: { url: string | null; label: string; active: boolean }[]
  }
}

export interface ProductFilters {
  price_from?: number
  price_to?: number
}

export type ProductSort = 'price' | '-price' | 'created_at' | '-created_at'

export interface ProductQueryParams {
  page?: number
  filter?: ProductFilters
  sort?: ProductSort
}
