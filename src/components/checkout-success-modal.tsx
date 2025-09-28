import { useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import type { CheckoutFormData } from '@/features/checkout/types/checkout'

interface CheckoutSuccessState {
  orderTotal?: number
  checkoutData?: CheckoutFormData
}

interface CheckoutSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  orderData?: CheckoutSuccessState
}

export function CheckoutSuccessModal({
  isOpen,
  onClose,
  orderData: _orderData,
}: CheckoutSuccessModalProps) {
  const handleContinueShopping = useCallback(() => {
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return

    // Auto close after 15 seconds
    const timer = setTimeout(() => {
      handleContinueShopping()
    }, 15000)

    return () => clearTimeout(timer)
  }, [isOpen, handleContinueShopping])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl min-h-[600px] p-20 flex flex-col justify-center items-center !rounded-none sm:!rounded-none">
        <div className="text-center">
          {/* Success Icon */}
          <div className="flex items-center justify-center w-24 h-24 mx-auto mb-8 bg-gray-100 rounded-full">
            <img
              src="/success.png"
              alt="Success"
              className="w-12 h-12 object-contain"
            />
          </div>

          {/* Congratulations */}
          <h1 className="text-5xl font-bold mb-6">Congrats!</h1>

          {/* Order Confirmation */}
          <p className="text-2xl text-gray-700 mb-12">
            Your order was placed successfully
          </p>
        </div>

        {/* Continue Shopping Button */}
        <div className="text-center">
          <Button
            onClick={handleContinueShopping}
            className="px-8 py-4 text-lg text-white"
            style={{ backgroundColor: '#FF4000' }}
            onMouseEnter={e =>
              (e.currentTarget.style.backgroundColor = '#E6390A')
            }
            onMouseLeave={e =>
              (e.currentTarget.style.backgroundColor = '#FF4000')
            }
            size="lg"
          >
            Continue Shopping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
