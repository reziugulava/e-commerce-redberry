import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useCart } from '@/features/cart/hooks/use-cart'
import { CheckoutSummary } from '@/features/cart/components/checkout-summary'
import { CheckoutForm } from '@/features/checkout/components/checkout-form'
import type { CheckoutFormData } from '@/features/checkout/types/checkout'
import { useUserStore } from '@/features/auth/stores/user'
import { ShoppingCart, AlertCircle, X } from 'lucide-react'
import { toast } from 'sonner'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cart = [], checkout, isCheckingOut, checkoutError } = useCart()
  const { user, token } = useUserStore()

  const [localError, setLocalError] = useState<string | null>(null)

  const calculateTotal = useCallback(() => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    const shipping = 5 // Fixed $5 shipping
    return subtotal + shipping
  }, [cart])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token, navigate])

  const onCheckout = async (formData: CheckoutFormData) => {
    setLocalError(null)
    const total = calculateTotal()

    console.log('Cart items before checkout:', cart)
    console.log('Cart length:', cart.length)
    console.log('Total:', total)
    console.log('User:', user)
    console.log('Token:', token ? 'Present' : 'Missing')
    console.log('Form data:', formData)

    // Check if user is authenticated
    if (!token) {
      setLocalError('You must be logged in to checkout.')
      return
    }

    try {
      await checkout(formData)

      // Show immediate success toast
      toast.success('🎉 Order Confirmed!', {
        description: `Your order for $${total.toFixed(2)} has been successfully processed. Thank you for your purchase!`,
        action: {
          label: 'Continue Shopping',
          onClick: () => navigate('/products'),
        },
        duration: 8000,
      })

      // Store checkout data for reference
      localStorage.setItem('lastOrderTotal', total.toString())
      localStorage.setItem('lastCheckoutData', JSON.stringify(formData))

      // Redirect to products after a short delay
      setTimeout(() => {
        navigate('/products')
      }, 3000)
    } catch (error: unknown) {
      console.error('Checkout failed:', error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to process checkout. Please try again.'
      setLocalError(errorMessage)

      // Show error toast as well
      toast.error('Checkout Failed', {
        description: errorMessage,
        duration: 5000,
      })
    }
  }

  const handleCheckoutFormSubmit = (formData: CheckoutFormData) => {
    // Store the form data locally for reference
    localStorage.setItem('checkoutFormData', JSON.stringify(formData))

    // Proceed with checkout, passing the form data
    onCheckout(formData)
  }

  const handleDismissError = () => {
    setLocalError(null)
  }

  // Display error from either source
  const displayError =
    localError || (checkoutError ? String(checkoutError) : null)

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">
            Add some items to your cart before proceeding to checkout.
          </p>
          <Button onClick={() => navigate('/products')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container ml-0 px-2 py-8">
      <div className="max-w-8xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Checkout</h1>
        </div>

        {/* Error Message */}
        {displayError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-800">{displayError}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismissError}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Billing Information */}
          <div className="lg:col-span-2 space-y-6 -ml-8">
            {/* Checkout Form with Billing Information */}
            <CheckoutForm
              onSubmit={handleCheckoutFormSubmit}
              isLoading={isCheckingOut}
            />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <CheckoutSummary
              onCheckout={() => {
                // Get form data from the form element
                const formElement = document.querySelector(
                  'form'
                ) as HTMLFormElement
                if (formElement) {
                  formElement.requestSubmit()
                }
              }}
              isCheckingOut={isCheckingOut}
              hideCheckoutButton={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
