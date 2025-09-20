import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
  images: string[]
  alt: string
}

export function ProductGallery({ images = [], alt }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  // Filter out any undefined or empty values and remove duplicates
  const uniqueImages = Array.from(new Set(images.filter(Boolean)))

  // Reset selected image if it's out of bounds
  useEffect(() => {
    if (selectedImage >= uniqueImages.length) {
      setSelectedImage(0)
    }
  }, [selectedImage, uniqueImages.length])

  // If no images are provided, show a placeholder
  if (!uniqueImages.length) {
    return (
      <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400">No image available</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {/* Thumbnails */}
      <div className="order-last flex gap-4 lg:order-none lg:flex-col">
        {uniqueImages.map((image, index) => (
          <button
            key={`${image}-${index}`}
            onClick={() => setSelectedImage(index)}
            className={cn(
              'relative aspect-square overflow-hidden rounded-lg border-2',
              selectedImage === index
                ? 'border-primary'
                : 'border-transparent opacity-70'
            )}
          >
            <img
              src={image}
              alt={`${alt} thumbnail ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="lg:col-span-4">
        <div className="aspect-square overflow-hidden rounded-lg">
          <img
            src={uniqueImages[selectedImage] || uniqueImages[0]}
            alt={`${alt} ${selectedImage + 1}`}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}
