import { api } from '@/lib/api/axios'
import type {
  Product,
  ProductQueryParams,
  ProductsResponse,
} from '../types/product'

export const getProducts = async (params?: ProductQueryParams) => {
  const { data } = await api.get<ProductsResponse>('/products', {
    params: {
      page: params?.page,
      'filter[price_from]': params?.filter?.price_from,
      'filter[price_to]': params?.filter?.price_to,
      sort: params?.sort,
    },
  })
  return data
}

export const getProduct = async (id: number) => {
  const { data } = await api.get<Product>(`/products/${id}`)
  return data
}
