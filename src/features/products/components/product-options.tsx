import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

interface ProductOptionsProps {
  onAddToCart: (options: {
    color: string
    size: string
    quantity: number
  }) => void
  onColorChange?: (color: string) => void
  selectedColor?: string
  availableColors?: string[]
  availableSizes?: string[]
}
const MAX_QUANTITY = 10

export function ProductOptions({
  onAddToCart,
  onColorChange,
  selectedColor: initialColor,
  availableColors,
  availableSizes,
}: ProductOptionsProps) {
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    initialColor
  )

  const handleColorChange = (color: string) => {
    setSelectedColor(color)
    onColorChange?.(color)
  }
  const [selectedSize, setSelectedSize] = useState<string>()
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    if (selectedColor && selectedSize) {
      onAddToCart({
        color: selectedColor,
        size: selectedSize,
        quantity,
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Color Selection */}
      <div className="space-y-4">
        <Label>Color</Label>
        <RadioGroup
          onValueChange={handleColorChange}
          value={selectedColor}
          className="flex flex-wrap gap-2"
        >
          {(availableColors || []).map((color, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem
                value={color}
                id={`color-${index}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`color-${index}`}
                className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 peer-aria-checked:border-primary peer-aria-checked:bg-primary/5"
              >
                <div
                  className="h-4 w-4 rounded-full border"
                  style={{ backgroundColor: color.toLowerCase() }}
                />
                {color}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Size Selection */}
      <div className="space-y-4">
        <Label>Size</Label>
        <RadioGroup
          onValueChange={setSelectedSize}
          className="flex flex-wrap gap-2"
        >
          {(availableSizes || []).map((size, index) => (
            <div key={index}>
              <RadioGroupItem
                value={size}
                id={`size-${index}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`size-${index}`}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border text-sm font-medium peer-aria-checked:border-primary peer-aria-checked:bg-primary/5"
              >
                {size}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Quantity Selection */}
      <div className="space-y-4">
        <Label>Quantity</Label>
        <Select
          value={quantity.toString()}
          onValueChange={value => setQuantity(Number(value))}
        >
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: MAX_QUANTITY }, (_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
                {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={!selectedColor || !selectedSize}
        className="w-full"
        size="lg"
      >
        Add to Cart
      </Button>
    </div>
  )
}
