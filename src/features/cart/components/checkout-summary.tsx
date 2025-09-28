import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useCart } from '../hooks/use-cart'
import { formatPrice } from '@/lib/utils'

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
  const { cart = [], updateCartItem, removeFromCart } = useCart()

  const DELIVERY_FEE = 5
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )
  const total = subtotal + (subtotal > 0 ? DELIVERY_FEE : 0)

  if (cart.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-500">Your cart is empty</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-6 flex flex-col">
      <div className="mb-4"></div>

      <ScrollArea
        className={`-mx-6 px-6 ${cart.length > 3 ? 'h-80' : 'flex-1'}`}
      >
        <div className="space-y-4 py-4">
          {cart.map(item => (
            <div key={item.cartItemKey || item.id} className="flex gap-4">
              {/* Product Image */}
              <div className="flex-shrink-0">
                {item.cover_image ? (
                  <img
                    src={item.cover_image}
                    alt={item.name}
                    className="w-16 h-26 object-cover rounded-md border"
                  />
                ) : (
                  <div className="w-16 h-26 bg-gray-200 rounded-md border flex items-center justify-center">
                    <span className="text-xs text-gray-500">No Image</span>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium leading-none text-sm truncate">
                      {item.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  {/* Size and Color */}
                  <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                    {item.selected_size && <span>{item.selected_size}</span>}
                    {item.selected_color && <span>{item.selected_color}</span>}
                  </div>
                </div>

                {/* Quantity and Remove Controls */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center bg-white border border-gray-300 rounded-full px-2 py-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full hover:bg-gray-100"
                      onClick={() =>
                        updateCartItem({
                          cartItemKey: item.cartItemKey || item.id.toString(),
                          quantity: item.quantity - 1,
                        })
                      }
                      disabled={item.quantity <= 1}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full hover:bg-gray-100"
                      onClick={() =>
                        updateCartItem({
                          cartItemKey: item.cartItemKey || item.id.toString(),
                          quantity: item.quantity + 1,
                        })
                      }
                    >
                      +
                    </Button>
                  </div>

                  <div className="flex items-center justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() =>
                        removeFromCart(item.cartItemKey || item.id.toString())
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="space-y-4 pt-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm py-0.5">
            <span>items Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {subtotal > 0 && (
            <div className="flex justify-between text-sm py-0.5">
              <span>Delivery</span>
              <span>{formatPrice(DELIVERY_FEE)}</span>
            </div>
          )}
          <div className="flex justify-between font-medium py-0.5">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
        {!hideCheckoutButton && (
          <div className="space-y-2 pt-6">
            <Button
              className="w-full text-white"
              style={{ backgroundColor: '#FF4000' }}
              onMouseEnter={e =>
                (e.currentTarget.style.backgroundColor = '#E6390A')
              }
              onMouseLeave={e =>
                (e.currentTarget.style.backgroundColor = '#FF4000')
              }
              onClick={onCheckout}
              disabled={total === 0 || isCheckingOut}
            >
              {isCheckingOut ? 'Processing...' : 'Complete Order'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
