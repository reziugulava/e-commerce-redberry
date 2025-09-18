import { Outlet } from 'react-router-dom';

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* TODO: Add Navbar component here */}
      <header className="border-b">
        <nav className="container mx-auto p-4">
          {/* Placeholder for Navbar */}
          <h1 className="text-xl font-bold">E-Commerce Store</h1>
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* TODO: Add Footer component here */}
      <footer className="border-t">
        <div className="container mx-auto p-4 text-center">
          <p>© 2025 E-Commerce Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}