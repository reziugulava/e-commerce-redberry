import { useNavigate } from 'react-router-dom'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { useCart } from '../hooks/use-cart'
import { formatPrice } from '@/lib/utils'

interface CartSidebarProps {
  children: React.ReactNode // This will be the trigger element
}

export function CartSidebar({ children }: CartSidebarProps) {
  const navigate = useNavigate()
  const { cart, isLoading, updateCartItem, removeFromCart } = useCart()

  const DELIVERY_FEE = 5
  const subtotal =
    cart?.reduce((total, item) => total + item.price * item.quantity, 0) ?? 0
  const itemCount = cart?.reduce((count, item) => count + item.quantity, 0) ?? 0
  const total = subtotal + (subtotal > 0 ? DELIVERY_FEE : 0) // Only add delivery fee if cart is not empty

  const handleCheckout = () => {
    navigate('/checkout')
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({itemCount} items)</SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-muted-foreground">Loading cart...</div>
          </div>
        ) : cart?.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-start pt-40 space-y-6">
            <div className="text-center space-y-4">
              <img 
                src="/empty-cart.png" 
                alt="Empty cart" 
                className="w-30 h-24 mx-auto mb-4"
              />
              <h2 className="text-4xl font-bold text-gray-800">Ooops!</h2>
              <div className="text-muted-foreground">You've got nothing in your cart just yet...</div>
            </div>
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2"
              onClick={() => navigate('/products')}
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {cart?.map(item => (
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
                          <span className="text-xs text-gray-500">
                            No Image
                          </span>
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
                          {item.selected_size && (
                            <span>{item.selected_size}</span>
                          )}
                          {item.selected_color && (
                            <span>{item.selected_color}</span>
                          )}
                        </div>
                      </div>

                      {/* Quantity and Remove Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center bg-white border border-gray-300 rounded-full px-1 py-1">
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
                            onClick={() => removeFromCart(item.cartItemKey || item.id.toString())}
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
                <div className="flex justify-between text-sm py-0.75">
                  <span>items Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {subtotal > 0 && (
                  <div className="flex justify-between text-sm py-0.75">
                    <span>Delivery</span>
                    <span>{formatPrice(DELIVERY_FEE)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-medium py-0.75">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <div className="space-y-2 pt-15">
                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  onClick={handleCheckout}
                  disabled={total === 0}
                >
                  go to Checkout
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
