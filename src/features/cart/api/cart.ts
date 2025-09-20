import { api } from '@/lib/api/axios'
import type { Product } from '@/features/products/types/product'

export interface CartItem extends Pick<Product, 'id' | 'name' | 'price'> {
  quantity: number
  brand: {
    id: number
    name: string
  }
}

export interface AddToCartPayload {
  color?: string
  size?: string
  quantity: number
}

/**
 * Add a product to the cart
 * @returns void - The product is added to the cart
 * @throws 401 Unauthorized - User is not authenticated
 * @throws 422 Validation Error - Invalid payload
 */
export const addToCart = async (
  productId: number,
  payload: AddToCartPayload
): Promise<void> => {
  await api.post(`/cart/products/${productId}`, payload)
}

/**
 * Update the quantity of a product in the cart
 * @returns void - The product quantity is updated
 * @throws 401 Unauthorized - User is not authenticated
 * @throws 422 Validation Error - Invalid quantity
 */
export const updateCartItem = async (
  productId: number,
  quantity: number
): Promise<void> => {
  await api.patch(`/cart/products/${productId}`, { quantity })
}

/**
 * Remove a product from the cart
 * @returns void
 * @throws 401 Unauthorized - User is not authenticated
 */
export const removeFromCart = async (productId: number): Promise<void> => {
  await api.delete(`/cart/products/${productId}`)
}

/**
 * Get all items in the cart
 * @returns Array of cart items
 * @throws 401 Unauthorized - User is not authenticated
 */
export const getCart = async (): Promise<CartItem[]> => {
  const { data } = await api.get('/cart')
  return data
}

/**
 * Checkout all items in the cart
 * @returns Success message
 * @throws 400 Bad Request - Cart is empty or other error
 * @throws 401 Unauthorized - User is not authenticated
 */
export const checkout = async (): Promise<{ message: string }> => {
  const { data } = await api.post('/cart/checkout')
  return data
}
