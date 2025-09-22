import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/button'
import { useCart } from '../../../features/cart/hooks/use-cart'
import { Separator } from '../../../components/ui/separator'
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'

export default function CartPage() {
  const navigate = useNavigate()
  const {
    cart = [],
    updateCartItem,
    removeFromCart,
    isUpdatingCart,
    isRemovingFromCart,
  } = useCart()

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const shipping = 5 // Fixed $5 shipping
  const total = subtotal + shipping

  const handleQuantityChange = (
    productId: number,
    currentQuantity: number,
    change: number
  ) => {
    const newQuantity = currentQuantity + change
    if (newQuantity > 0) {
      updateCartItem({ productId, quantity: newQuantity })
    }
  }

  const handleRemoveItem = (productId: number) => {
    removeFromCart(productId)
  }

  const handleProceedToCheckout = () => {
    navigate('/checkout')
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Button onClick={() => navigate('/products')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border p-6">
              <div className="space-y-4">
                {cart.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{item.name}</h3>
                      <p className="text-gray-600">
                        {item.brand?.name || 'Unknown Brand'}
                      </p>
                      <p className="text-lg font-semibold text-green-600 mt-1">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity, -1)
                        }
                        disabled={isUpdatingCart}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity, 1)
                        }
                        disabled={isUpdatingCart}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={isRemovingFromCart}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-6 sticky top-4">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <Button
                onClick={handleProceedToCheckout}
                className="w-full mt-6"
                size="lg"
              >
                Proceed to Checkout
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate('/products')}
                className="w-full mt-3"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
