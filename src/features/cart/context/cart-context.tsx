import { createContext, useContext } from 'react'
import type { CartItem } from '../api/cart'

interface CartContextType {
  isLoading: boolean
  items: CartItem[]
}

export const CartContext = createContext<CartContextType | undefined>(undefined)

export function useCartContext() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider')
  }
  return context
}
