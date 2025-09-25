import { Link } from 'react-router-dom'
import type { ProductListItem } from '../types/product'

interface ProductCardProps {
  product: ProductListItem
}

export const ProductCard = ({ product }: ProductCardProps) => {
  console.log('Product in card:', product) // Debug log
  return (
    <Link
      to={`/products/${product.id}`}
      className="group rounded-lg bg-gray-50 p-4 transition-all hover:shadow-lg"
    >
      <div className="aspect-square overflow-hidden rounded-md bg-transparent">
        <img
          src={product.cover_image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={e => {
            console.error('Image load error:', e)
            const img = e.target as HTMLImageElement
            img.src = 'https://placehold.co/400x400?text=Product+Image'
          }}
        />
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="mt-1 font-medium text-gray-600">
          Released: {product.release_year}
        </p>
        <p className="mt-2 text-xl font-bold">${product.price}</p>
      </div>
    </Link>
  )
}
