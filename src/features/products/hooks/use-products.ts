import { useQuery } from '@tanstack/react-query'
import { getProduct, getProducts } from '../api/products'
import type { ProductQueryParams } from '../types/product'

export const useProducts = (params?: ProductQueryParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => getProducts(params),
  })
}

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
  })
}
