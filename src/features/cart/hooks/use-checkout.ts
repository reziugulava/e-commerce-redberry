import { useState } from 'react'
import { useCart } from './use-cart'
import type { CheckoutFormData } from '@/features/checkout/types/checkout'

interface CheckoutState {
  isLoading: boolean
  error: string | null
  isSuccess: boolean
}

export function useCheckout() {
  const { checkout, isCheckingOut, checkoutError } = useCart()
  const [state, setState] = useState<CheckoutState>({
    isLoading: false,
    error: null,
    isSuccess: false,
  })

  const handleCheckout = async (
    checkoutData: CheckoutFormData
  ): Promise<boolean> => {
    setState({ isLoading: true, error: null, isSuccess: false })

    try {
      // The checkout function doesn't return a promise, so we need to monitor the mutation state
      checkout(checkoutData)

      // Since checkout is a mutation, we'll rely on the mutation state from useCart
      // and set success state optimistically for now
      setState({ isLoading: false, error: null, isSuccess: true })
      return true
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred during checkout'
      setState({ isLoading: false, error: errorMessage, isSuccess: false })
      return false
    }
  }

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }))
  }

  const reset = () => {
    setState({ isLoading: false, error: null, isSuccess: false })
  }

  return {
    // State - combine local state with mutation state
    isLoading: state.isLoading || isCheckingOut,
    error: state.error || (checkoutError ? String(checkoutError) : null),
    isSuccess: state.isSuccess,

    // Actions
    handleCheckout,
    clearError,
    reset,
  }
}
