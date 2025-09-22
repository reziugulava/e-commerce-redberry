import type { CartItem } from '../api/cart'
import type { CheckoutFormData } from '@/features/checkout/types/checkout'

export interface CartStore {
  // State
  items: CartItem[]
  isLoading: boolean
  error: string | null

  // Cart totals
  totalItems: number
  totalPrice: number

  // Action states
  isAddingToCart: boolean
  isUpdatingCart: boolean
  isRemovingFromCart: boolean
  isCheckingOut: boolean

  // Internal helpers
  updateTotals: (items: CartItem[]) => void

  // Actions
  fetchCart: () => Promise<void>
  addItem: (
    productId: number,
    color?: string,
    size?: string,
    quantity?: number
  ) => Promise<void>
  updateItem: (productId: number, quantity: number) => Promise<void>
  removeItem: (productId: number) => Promise<void>
  checkout: (checkoutData: CheckoutFormData) => Promise<void>
  clearCart: () => void
  clearError: () => void
}
