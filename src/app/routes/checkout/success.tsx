import { useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { useNavigate, useLocation } from 'react-router-dom'
import type { CheckoutFormData } from '@/features/checkout/types/checkout'

interface CheckoutSuccessState {
  orderTotal?: number
  checkoutData?: CheckoutFormData
}

export default function CheckoutSuccessPage() {
  const navigate = useNavigate()
  const location = useLocation()

  // Get data passed from checkout page
  const state = location.state as CheckoutSuccessState | null

  const handleContinueShopping = useCallback(() => {
    navigate('/products')
  }, [navigate])

  useEffect(() => {
    // Redirect to products if no state data (direct access)
    if (!state) {
      navigate('/products', { replace: true })
      return
    }

    // Auto redirect after 15 seconds
    const timer = setTimeout(() => {
      handleContinueShopping()
    }, 15000)

    return () => clearTimeout(timer)
  }, [state, navigate, handleContinueShopping])

  // If no state, don't render anything (will redirect)
  if (!state) {
    return null
  }

  return (
    <div className="min-h-screen bg-white flex items-start justify-center pt-20 px-4">
      {/* Main Content */}
      <div className="max-w-xl mx-auto text-center">
        {/* Success Icon */}
        <div className="flex items-center justify-center w-24 h-24 mx-auto mb-8 bg-gray-100 rounded-full">
          <img
            src="/success.png"
            alt="Success"
            className="w-12 h-12 object-contain"
          />
        </div>

        {/* Congratus */}
        <h1 className="text-5xl font-bold mb-6">Congrats!</h1>

        {/* Order Confirmation */}
        <p className="text-2xl text-gray-700 mb-12">
          Your order was placed successfully
        </p>

        {/* Continue Shopping Button */}
        <Button
          onClick={handleContinueShopping}
          className="px-8 py-4 text-lg bg-orange-500"
          size="lg"
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  )
}
