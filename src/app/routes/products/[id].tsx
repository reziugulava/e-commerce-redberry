import { useParams } from 'react-router-dom'
import { useProduct } from '@/features/products/hooks/use-products'
import { useState, useEffect, useMemo } from 'react'
import { ProductGallery } from '@/features/products/components/product-gallery'
import { ProductOptions } from '@/features/products/components/product-options'
import { useCart } from '@/features/cart/hooks/use-cart'

import { toast } from 'sonner'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { data: product, isLoading } = useProduct(Number(id))
  const { addToCart, isAddingToCart } = useCart()
  const [selectedColor, setSelectedColor] = useState<string>()

  // Initialize with the first available color
  useEffect(() => {
    if (product?.available_colors?.length && !selectedColor) {
      setSelectedColor(product.available_colors[0])
    }
  }, [product?.available_colors, selectedColor])

  // Get image for the selected color
  const currentColorImage = useMemo(() => {
    if (!product || !selectedColor) return null

    // Find the index of the selected color
    const colorIndex = product.available_colors.findIndex(
      color => color.toLowerCase() === selectedColor.toLowerCase()
    )

    if (colorIndex === -1) return null

    // Each index in the images array corresponds to a color
    return colorIndex === 0 ? product.cover_image : product.images[colorIndex]
  }, [product, selectedColor])

  // For now, since we don't have multiple angles, we'll just use the single image
  const allImages = useMemo(() => {
    return currentColorImage ? [currentColorImage] : []
  }, [currentColorImage])

  if (isLoading || !product) {
    return (
      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-square animate-pulse bg-gray-200 rounded-lg" />
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="h-8 w-2/3 animate-pulse bg-gray-200 rounded" />
              <div className="h-4 w-1/3 animate-pulse bg-gray-200 rounded" />
            </div>
            <div className="h-24 animate-pulse bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!product?.id) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Product not found</h2>
          <p className="mt-2 text-gray-600">
            The product you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    )
  }

  const handleAddToCart = (options: {
    color: string
    size: string
    quantity: number
  }) => {
    try {
      addToCart({
        productId: product.id,
        payload: options,
      })
      toast.success('Added to cart!')
      // Stay on current page - user can access cart via sidebar
    } catch (error) {
      console.error('Failed to add to cart:', error)
      toast.error('Failed to add to cart. Please try again.')
    }
  }

  return (
    <div className="container py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Gallery */}
        <ProductGallery images={allImages} alt={product.name} />

        {/* Product Info */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold">{product.name}</h1>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img
                  src={product.brand.image}
                  alt={product.brand.name}
                  className="h-8 w-8 rounded-full"
                />
                <span className="font-medium">{product.brand.name}</span>
              </div>
              <div className="text-2xl font-bold">${product.price}</div>
            </div>
          </div>

          <ProductOptions
            onAddToCart={handleAddToCart}
            onColorChange={setSelectedColor}
            selectedColor={selectedColor}
            availableColors={product.available_colors}
            availableSizes={product.available_sizes}
            isLoading={isAddingToCart}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Details</h3>
              <img
                src={product.brand.image}
                alt={product.brand.name}
                className="h-8 w-8 rounded-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Brand:</span>
                <span className="font-medium">{product.brand.name}</span>
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-600">{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
