/**
 * Utilities for storing cart item selections (color, size, image) in localStorage
 */

export interface CartItemSelection {
  productId: number
  selected_color?: string
  selected_size?: string
  cover_image?: string
  quantity: number // Track quantity for this specific variant
  timestamp: number // To help with cleanup of old entries
}

const CART_SELECTIONS_KEY = 'cart_selections'

/**
 * Get all stored cart selections from localStorage
 */
export const getCartSelections = (): CartItemSelection[] => {
  try {
    const stored = localStorage.getItem(CART_SELECTIONS_KEY)
    if (!stored) return []
    return JSON.parse(stored)
  } catch (error) {
    console.error('Error reading cart selections from localStorage:', error)
    return []
  }
}

/**
 * Generate a unique cart item key by combining product ID, color, and size
 * This ensures that different variants of the same product have unique identifiers
 */
export const generateCartItemKey = (
  productId: number,
  color?: string,
  size?: string
): string => {
  const colorKey = color || 'no-color'
  const sizeKey = size || 'no-size'
  return `${productId}-${colorKey}-${sizeKey}`
}

/**
 * Parse a cart item key back into its components
 */
export const parseCartItemKey = (
  key: string
): { productId: number; color?: string; size?: string } => {
  const parts = key.split('-')
  const productId = parseInt(parts[0], 10)
  const color = parts[1] === 'no-color' ? undefined : parts[1]
  const size = parts[2] === 'no-size' ? undefined : parts[2]

  return { productId, color, size }
}

/**
 * Get selection for a specific product (legacy - for backward compatibility)
 */
export const getCartSelection = (
  productId: number
): CartItemSelection | undefined => {
  const selections = getCartSelections()
  return selections.find(selection => selection.productId === productId)
}

/**
 * Get selection for a specific cart item variant
 */
export const getCartItemSelection = (
  productId: number,
  color?: string,
  size?: string
): CartItemSelection | undefined => {
  const selections = getCartSelections()
  return selections.find(
    selection =>
      selection.productId === productId &&
      selection.selected_color === color &&
      selection.selected_size === size
  )
}

/**
 * Store or update selection for a product variant
 * This function now properly handles multiple variants (color/size combinations) per product
 */
export const setCartSelection = (
  selection: Omit<CartItemSelection, 'timestamp'>
): void => {
  try {
    const selections = getCartSelections()

    // Find existing variant with same product ID, color, AND size
    const existingIndex = selections.findIndex(
      s =>
        s.productId === selection.productId &&
        s.selected_color === selection.selected_color &&
        s.selected_size === selection.selected_size
    )

    console.log('🔍 setCartSelection called:', {
      incoming: selection,
      existingIndex,
      existingCount: selections.length,
      existing: existingIndex >= 0 ? selections[existingIndex] : null,
    })

    const newSelection: CartItemSelection = {
      ...selection,
      timestamp: Date.now(),
    }

    if (existingIndex >= 0) {
      // Same variant exists - check if this might be a duplicate call
      const existing = selections[existingIndex]
      const timeSinceLastUpdate = Date.now() - existing.timestamp

      // If updated very recently (within 100ms), it might be a duplicate call from React StrictMode
      if (timeSinceLastUpdate < 100) {
        console.log(
          '🚫 Skipping potential duplicate call - updated very recently'
        )
        return
      }

      // Normal case: increment the quantity
      const existingQuantity = existing.quantity || 1
      const addQuantity = selection.quantity || 1
      const newQuantity = existingQuantity + addQuantity

      selections[existingIndex] = {
        ...newSelection,
        quantity: newQuantity,
      }

      console.log('🔄 Updated existing variant:', {
        variant: `${selection.productId}-${selection.selected_color}-${selection.selected_size}`,
        existingQuantity,
        addQuantity,
        newQuantity,
        timeSinceLastUpdate,
      })
    } else {
      // New variant - add as separate entry
      const quantity = selection.quantity || 1
      selections.push({
        ...newSelection,
        quantity,
      })

      console.log('✅ Added new variant:', {
        variant: `${selection.productId}-${selection.selected_color}-${selection.selected_size}`,
        quantity,
      })
    }

    localStorage.setItem(CART_SELECTIONS_KEY, JSON.stringify(selections))
    console.log('💾 localStorage updated. Total entries:', selections.length)
  } catch (error) {
    console.error('Error saving cart selection to localStorage:', error)
  }
}

/**
 * Update quantity for a specific cart item variant
 */
export const updateCartItemQuantity = (
  productId: number,
  quantity: number,
  color?: string,
  size?: string
): void => {
  try {
    const selections = getCartSelections()
    const existingIndex = selections.findIndex(
      s =>
        s.productId === productId &&
        s.selected_color === color &&
        s.selected_size === size
    )

    if (existingIndex >= 0) {
      if (quantity <= 0) {
        // Remove if quantity is 0 or less
        selections.splice(existingIndex, 1)
      } else {
        // Update quantity
        selections[existingIndex] = {
          ...selections[existingIndex],
          quantity,
          timestamp: Date.now(),
        }
      }
      localStorage.setItem(CART_SELECTIONS_KEY, JSON.stringify(selections))
    }
  } catch (error) {
    console.error('Error updating cart item quantity:', error)
  }
}

/**
 * Remove selection for a specific product (legacy - removes all variants)
 */
export const removeCartSelection = (productId: number): void => {
  try {
    const selections = getCartSelections()
    const filtered = selections.filter(
      selection => selection.productId !== productId
    )
    localStorage.setItem(CART_SELECTIONS_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error('Error removing cart selection from localStorage:', error)
  }
}

/**
 * Remove selection for a specific cart item variant
 */
export const removeCartItemSelection = (
  productId: number,
  color?: string,
  size?: string
): void => {
  try {
    const selections = getCartSelections()
    const filtered = selections.filter(
      selection =>
        !(
          selection.productId === productId &&
          selection.selected_color === color &&
          selection.selected_size === size
        )
    )
    localStorage.setItem(CART_SELECTIONS_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error(
      'Error removing cart item selection from localStorage:',
      error
    )
  }
}

/**
 * Clear all cart selections
 */
export const clearCartSelections = (): void => {
  try {
    localStorage.removeItem(CART_SELECTIONS_KEY)
  } catch (error) {
    console.error('Error clearing cart selections from localStorage:', error)
  }
}

/**
 * Clean up old selections that are no longer in the cart
 * This should be called periodically or when cart is fetched
 */
export const cleanupCartSelections = (activeProductIds: number[]): void => {
  try {
    const selections = getCartSelections()
    const filtered = selections.filter(selection =>
      activeProductIds.includes(selection.productId)
    )
    localStorage.setItem(CART_SELECTIONS_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error('Error cleaning up cart selections:', error)
  }
}
