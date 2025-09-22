import { useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { CheckoutFormData } from '@/features/checkout/types/checkout'

interface CheckoutConfirmationProps {
  isOpen: boolean
  onClose: () => void
  orderTotal?: number
  checkoutData?: CheckoutFormData
}

export function CheckoutConfirmation({
  isOpen,
  onClose,
  orderTotal = 0,
  checkoutData,
}: CheckoutConfirmationProps) {
  const navigate = useNavigate()

  const handleContinueShopping = useCallback(() => {
    onClose()
    navigate('/products')
  }, [onClose, navigate])

  const handleViewOrders = useCallback(() => {
    onClose()
    // Navigate to orders page (if implemented)
    // navigate('/orders')
    navigate('/products')
  }, [onClose, navigate])

  useEffect(() => {
    if (isOpen) {
      // Auto close after 10 seconds
      const timer = setTimeout(() => {
        handleContinueShopping()
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [isOpen, handleContinueShopping])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <DialogTitle className="text-center">Order Confirmed!</DialogTitle>
          <DialogDescription className="text-center">
            Thank you for your order. Your payment has been processed
            successfully.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600">Order Total</p>
            <p className="text-2xl font-bold text-green-600">
              ${orderTotal.toFixed(2)}
            </p>
          </div>

          {checkoutData && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                Billing Information
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Name:</span>{' '}
                  {checkoutData.firstName} {checkoutData.lastName}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{' '}
                  {checkoutData.email}
                </p>
                <p>
                  <span className="font-medium">Address:</span>{' '}
                  {checkoutData.address}
                </p>
                <p>
                  <span className="font-medium">ZIP Code:</span>{' '}
                  {checkoutData.zipCode}
                </p>
              </div>
            </div>
          )}

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              A confirmation email has been sent to your email address.
            </p>
            <p className="text-sm text-gray-600">
              You can track your order status in your account.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-col space-y-2">
          <Button
            onClick={handleViewOrders}
            variant="outline"
            className="w-full"
          >
            View Orders
          </Button>
          <Button onClick={handleContinueShopping} className="w-full">
            Continue Shopping
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
