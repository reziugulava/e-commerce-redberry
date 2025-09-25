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

  useEffect(() => {
    if (isOpen) {
      // Auto close after 15 seconds if user doesn't interact
      const timer = setTimeout(() => {
        handleContinueShopping()
      }, 15000)

      return () => clearTimeout(timer)
    }
  }, [isOpen, handleContinueShopping])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <DialogTitle className="text-center text-2xl font-bold text-green-700">
            🎉 Order Confirmed!
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Thank you for your purchase! Your order has been successfully
            processed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 text-center border border-green-200">
            <p className="text-sm text-gray-600 mb-1">Order Total</p>
            <p className="text-3xl font-bold text-green-600">
              ${orderTotal.toFixed(2)}
            </p>
            <p className="text-xs text-green-600 mt-1">Payment Successful</p>
          </div>

          {checkoutData && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-3 text-center">
                📋 Order Details
              </h4>
              <div className="text-sm text-gray-700 space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Name:</span>
                  <span>
                    {checkoutData.firstName} {checkoutData.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Email:</span>
                  <span>{checkoutData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Address:</span>
                  <span className="text-right">{checkoutData.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">ZIP Code:</span>
                  <span>{checkoutData.zipCode}</span>
                </div>
              </div>
            </div>
          )}

          <div className="text-center space-y-2 bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              📧 A confirmation email has been sent to your email address.
            </p>
            <p className="text-xs text-gray-500">
              This popup will automatically close in 15 seconds.
            </p>
          </div>
        </div>

        <DialogFooter className="flex justify-center">
          <Button onClick={handleContinueShopping} className="w-full" size="lg">
            Continue Shopping
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
