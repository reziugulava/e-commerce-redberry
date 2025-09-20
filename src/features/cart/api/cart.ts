import { api } from '@/lib/api/axios'

interface AddToCartPayload {
  color: string
  size: string
  quantity: number
}

export const addToCart = async (
  productId: number,
  payload: AddToCartPayload
) => {
  const { data } = await api.post(`/cart/products/${productId}`, payload)
  return data
}

export const updateCartItem = async (productId: number, quantity: number) => {
  const { data } = await api.patch(`/cart/products/${productId}`, { quantity })
  return data
}

export const removeFromCart = async (productId: number) => {
  await api.delete(`/cart/products/${productId}`)
}

export const getCart = async () => {
  const { data } = await api.get('/cart')
  return data
}

export const checkout = async () => {
  const { data } = await api.post('/cart/checkout')
  return data
}
