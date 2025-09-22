import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCart } from '../hooks/use-cart'
import type { CartItem } from '../api/cart'

interface CheckoutSummaryProps {
  onCheckout?: () => void
  isCheckingOut?: boolean
  hideCheckoutButton?: boolean
}

export function CheckoutSummary({
  onCheckout,
  isCheckingOut = false,
  hideCheckoutButton = false,
}: CheckoutSummaryProps) {
  const { cart = [] } = useCart()

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const shipping = 5 // Fixed $5 shipping
  const total = subtotal + shipping

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  if (cart.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-500">Your cart is empty</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border p-6 space-y-4">
      <h3 className="text-lg font-semibold">Order Summary</h3>

      <div className="space-y-3">
        {cart.map((item: CartItem) => (
          <div key={item.id} className="flex justify-between items-center">
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">
                {item.brand?.name || 'Unknown Brand'} × {item.quantity}
              </p>
            </div>
            <p className="font-medium">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal ({totalItems} items)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between text-lg font-semibold">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      {!hideCheckoutButton && (
        <Button
          onClick={onCheckout}
          disabled={isCheckingOut}
          className="w-full"
          size="lg"
        >
          {isCheckingOut ? 'Processing...' : `Checkout $${total.toFixed(2)}`}
        </Button>
      )}
    </div>
  )
}
