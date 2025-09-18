import { Link, Outlet } from 'react-router-dom'
import { Header } from '@/components/navigation/header'
import { UserNav } from '@/features/auth/components/user-nav'
import { useUserStore } from '@/features/auth/stores/user'
import { Button } from '@/components/ui/button'

export default function RootLayout() {
  const user = useUserStore(state => state.user)

  return (
    <div className="min-h-screen flex flex-col">
      <Header>
        {user ? (
          <div className="flex items-center gap-4">
            <Link to="/cart">Cart</Link>
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

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t">
        <div className="container mx-auto p-4 text-center">
          <p>© 2025 E-Commerce Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
