import { XIcon } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { useCart } from '../hooks/use-cart'
import { formatPrice } from '@/lib/utils'

interface CartSidebarProps {
  children: React.ReactNode // This will be the trigger element
}

export function CartSidebar({ children }: CartSidebarProps) {
  const {
    cart,
    isLoading,
    updateCartItem,
    removeFromCart,
    checkout,
    isCheckingOut,
  } = useCart()

  const DELIVERY_FEE = 5
  const subtotal =
    cart?.reduce((total, item) => total + item.price * item.quantity, 0) ?? 0
  const itemCount = cart?.reduce((count, item) => count + item.quantity, 0) ?? 0
  const total = subtotal + (subtotal > 0 ? DELIVERY_FEE : 0) // Only add delivery fee if cart is not empty

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
          <div className="flex-1 flex items-center justify-center">
            <div className="text-muted-foreground">Your cart is empty</div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {cart?.map(item => (
                  <div key={item.id} className="flex items-start gap-4">
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium leading-none">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateCartItem({
                              productId: item.id,
                              quantity: item.quantity - 1,
                            })
                          }
                          disabled={item.quantity <= 1}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateCartItem({
                              productId: item.id,
                              quantity: item.quantity + 1,
                            })
                          }
                        >
                          +
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-4">
              <Separator />
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {subtotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Delivery Fee</span>
                    <span>{formatPrice(DELIVERY_FEE)}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <Button
                className="w-full"
                onClick={() => checkout()}
                disabled={isCheckingOut || total === 0}
              >
                {isCheckingOut
                  ? 'Processing...'
                  : `Checkout • ${formatPrice(total)}`}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
