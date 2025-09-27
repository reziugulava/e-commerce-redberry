/**
 * Utilities for storing cart item selections (color, size, image) in localStorage
 */

export interface CartItemSelection {
  productId: number
  selected_color?: string
  selected_size?: string
  cover_image?: string
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
 * Get selection for a specific product
 */
export const getCartSelection = (
  productId: number
): CartItemSelection | undefined => {
  const selections = getCartSelections()
  return selections.find(selection => selection.productId === productId)
}

/**
 * Store or update selection for a product
 */
export const setCartSelection = (
  selection: Omit<CartItemSelection, 'timestamp'>
): void => {
  try {
    const selections = getCartSelections()
    const existingIndex = selections.findIndex(
      s => s.productId === selection.productId
    )

    const newSelection: CartItemSelection = {
      ...selection,
      timestamp: Date.now(),
    }

    if (existingIndex >= 0) {
      selections[existingIndex] = newSelection
    } else {
      selections.push(newSelection)
    }

    localStorage.setItem(CART_SELECTIONS_KEY, JSON.stringify(selections))
  } catch (error) {
    console.error('Error saving cart selection to localStorage:', error)
  }
}

/**
 * Remove selection for a specific product
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
