import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import RootLayout from './routes/root'

// Lazy load page components
const LoginPage = lazy(() => import('./routes/auth/login'))
const RegisterPage = lazy(() => import('./routes/auth/register'))
const ProductsPage = lazy(() => import('./routes/products/page'))
const ProductDetailPage = lazy(() => import('./routes/products/[id]'))
const CheckoutPage = lazy(() => import('./routes/checkout/page'))
const NotFoundPage = lazy(() => import('./routes/not-found'))

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <p>Loading...</p>
  </div>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProductsPage />
          </Suspense>
        ),
      },
      {
        path: 'login',
        element: (
          <Suspense fallback={<PageLoader />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: 'register',
        element: (
          <Suspense fallback={<PageLoader />}>
            <RegisterPage />
          </Suspense>
        ),
      },
      {
        path: 'products',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProductsPage />
          </Suspense>
        ),
      },
      {
        path: 'products/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProductDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'checkout',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CheckoutPage />
          </Suspense>
        ),
      },
    ],
  },
])
