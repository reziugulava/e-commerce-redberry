import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { CartStore } from '../types/store'
import type { AddToCartPayload, CartItem } from '../api/cart'
import type { CheckoutFormData } from '@/features/checkout/types/checkout'
import {
  addToCart,
  checkout as checkoutAPI,
  getCart,
  removeFromCart,
  updateCartItem,
} from '../api/cart'
import { clearCartSelections } from '../utils/cart-storage'

export const useCartStore = create<CartStore>()(
  devtools((set, get) => ({
    // Initial state
    items: [],
    isLoading: false,
    error: null,
    totalItems: 0,
    totalPrice: 0,
    isAddingToCart: false,
    isUpdatingCart: false,
    isRemovingFromCart: false,
    isCheckingOut: false,

    // Computed values helper
    updateTotals: (items: CartItem[]) => {
      const totalItems = items.reduce(
        (sum: number, item: CartItem) => sum + item.quantity,
        0
      )
      const totalPrice = items.reduce(
        (sum: number, item: CartItem) => sum + item.price * item.quantity,
        0
      )
      set({ totalItems, totalPrice })
    },

    // Actions
    fetchCart: async () => {
      set({ isLoading: true, error: null })
      try {
        const items = await getCart()
        set({ items })
        get().updateTotals(items)
      } catch (error) {
        set({ error: (error as Error).message })
      } finally {
        set({ isLoading: false })
      }
    },

    addItem: async (
      productId: number,
      color?: string,
      size?: string,
      quantity: number = 1
    ) => {
      set({ isAddingToCart: true, error: null })
      try {
        const payload: AddToCartPayload = { quantity, color, size }
        await addToCart(productId, payload)
        // Refresh cart after adding
        await get().fetchCart()
      } catch (error) {
        set({ error: (error as Error).message })
      } finally {
        set({ isAddingToCart: false })
      }
    },

    updateItem: async (productId: number, quantity: number) => {
      set({ isUpdatingCart: true, error: null })
      try {
        await updateCartItem(productId, quantity)
        // Refresh cart after update
        await get().fetchCart()
      } catch (error) {
        set({ error: (error as Error).message })
      } finally {
        set({ isUpdatingCart: false })
      }
    },

    removeItem: async (productId: number) => {
      set({ isRemovingFromCart: true, error: null })
      try {
        await removeFromCart(productId)
        // Refresh cart after removal
        await get().fetchCart()
      } catch (error) {
        set({ error: (error as Error).message })
      } finally {
        set({ isRemovingFromCart: false })
      }
    },

    checkout: async (checkoutData: CheckoutFormData) => {
      set({ isCheckingOut: true, error: null })
      try {
        await checkoutAPI(checkoutData)
        // Clear cart after successful checkout
        set({ items: [] })
        get().updateTotals([])
      } catch (error) {
        set({ error: (error as Error).message })
      } finally {
        set({ isCheckingOut: false })
      }
    },

    clearCart: () => {
      set({ items: [], totalItems: 0, totalPrice: 0 })
      clearCartSelections()
    },

    clearError: () => {
      set({ error: null })
    },
  }))
)
