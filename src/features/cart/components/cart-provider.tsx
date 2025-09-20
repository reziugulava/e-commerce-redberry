import { type ReactNode } from 'react'
import { CartContext } from '../context/cart-context'
import { useCart } from '../hooks/use-cart'

interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const { cart, isLoading } = useCart()

  return (
    <CartContext.Provider
      value={{
        isLoading,
        items: cart ?? [],
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
