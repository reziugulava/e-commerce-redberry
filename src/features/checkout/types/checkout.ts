import type { CartItem } from '@/features/cart/api/cart'

export interface CheckoutFormData {
  firstName: string
  lastName: string
  email: string
  address: string
  zipCode: string
}

export interface CheckoutRequest extends CheckoutFormData {
  // Additional fields that might be needed for the API
  cartItems?: CartItem[]
  total?: number
}
