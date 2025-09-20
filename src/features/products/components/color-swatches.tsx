import { cn } from '@/lib/utils'

interface ColorSwatchesProps {
  colors: string[]
  selectedColor: string
  onColorChange: (color: string) => void
  colorImages: { [key: string]: string }
}

export function ColorSwatches({
  colors,
  selectedColor,
  onColorChange,
  colorImages,
}: ColorSwatchesProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {colors.map(color => (
        <button
          key={color}
          onClick={() => onColorChange(color)}
          className={cn(
            'group relative h-16 w-16 overflow-hidden rounded-lg border-2 transition-all',
            selectedColor === color
              ? 'border-primary ring-2 ring-primary/20'
              : 'border-gray-200 hover:border-gray-300'
          )}
          title={color}
        >
          <img
            src={colorImages[color.toLowerCase()]}
            alt={`${color} variant`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-black/10" />
        </button>
      ))}
    </div>
  )
}
