import { Link, Outlet } from 'react-router-dom'
import { Header } from '@/components/navigation/header'
import { UserNav } from '@/features/auth/components/user-nav'
import { useUserStore } from '@/features/auth/stores/user'
import { Button } from '@/components/ui/button'
import { CartProvider } from '@/features/cart/components/cart-provider'
import { CartSidebar } from '@/features/cart/components/cart-sidebar'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/features/cart/hooks/use-cart'

export default function RootLayout() {
  const user = useUserStore(state => state.user)

  const { cart } = useCart()
  const itemCount = cart?.reduce((count, item) => count + item.quantity, 0) ?? 0

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header>
          {user ? (
            <div className="flex items-center gap-4">
              <CartSidebar>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </CartSidebar>
              <UserNav />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Register</Button>
              </Link>
            </div>
          )}
        </Header>

        <main className="flex-1 pt-16">
          <div className="container mx-auto px-4">
            <Outlet />
          </div>
        </main>
      </div>
    </CartProvider>
  )
}
