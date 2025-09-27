import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface HeaderProps {
  children?: ReactNode
}

export function Header({ children }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
          <img src="/Vector.png" alt="RedSeam Logo" className="w-5 h-6" />
          <span>RedSeam Clothing</span>
        </Link>

        <nav className="flex items-center gap-4">{children}</nav>
      </div>
    </header>
  )
}
