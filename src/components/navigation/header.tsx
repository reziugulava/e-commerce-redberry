import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface HeaderProps {
  children?: ReactNode
}

export function Header({ children }: HeaderProps) {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          E-Commerce Store
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/products">Products</Link>
          {children}
        </nav>
      </div>
    </header>
  )
}
