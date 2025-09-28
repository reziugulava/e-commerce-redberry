import { api } from '@/lib/api/axios'
import type { Product } from '@/features/products/types/product'
import type { CheckoutFormData } from '@/features/checkout/types/checkout'
import {
  getCartSelections,
  cleanupCartSelections,
  removeCartSelection,
  clearCartSelections,
  generateCartItemKey,
  updateCartItemQuantity,
  type CartItemSelection,
} from '../utils/cart-storage'

interface AxiosErrorResponse {
  response?: {
    status?: number
    statusText?: string
    data?: {
      message?: string
    }
  }
  message?: string
}

export interface CartItem extends Pick<Product, 'id' | 'name' | 'price'> {
  quantity: number
  cover_image?: string
  selected_color?: string
  selected_size?: string
  brand?: {
    id: number
    name: string
  }
  // Unique key for React rendering and cart management
  cartItemKey?: string
}

export interface AddToCartPayload {
  color?: string
  size?: string
  quantity: number
}

/**
 * Add a product to the cart
 * @returns void - The product is added to the cart
 * @throws 401 Unauthorized - User is not authenticated
 * @throws 422 Validation Error - Invalid payload
 */
export const addToCart = async (
  productId: number,
  payload: AddToCartPayload
): Promise<void> => {
  await api.post(`/cart/products/${productId}`, payload)
}

/**
 * Update the quantity of a product in the cart
 * @returns void - The product quantity is updated
 * @throws 401 Unauthorized - User is not authenticated
 * @throws 422 Validation Error - Invalid quantity
 */
export const updateCartItem = async (
  productId: number,
  quantity: number
): Promise<void> => {
  await api.patch(`/cart/products/${productId}`, { quantity })
}

/**
 * Update the quantity of a specific cart item variant
 */
export const updateCartItemVariant = async (
  cartItemKey: string,
  quantity: number
): Promise<void> => {
  // Parse the cart item key to get product details
  const parts = cartItemKey.split('-')
  const productId = parseInt(parts[0], 10)
  const color = parts[1] === 'no-color' ? undefined : parts[1]
  const size = parts[2] === 'no-size' ? undefined : parts[2]

  // Update the specific variant quantity in localStorage
  updateCartItemQuantity(productId, quantity, color, size)

  // Calculate total quantity for all variants of this product
  const allSelections = getCartSelections()
  const totalQuantity = allSelections
    .filter(selection => selection.productId === productId)
    .reduce((sum, selection) => sum + selection.quantity, 0)

  // Update backend with total quantity
  if (totalQuantity > 0) {
    await api.patch(`/cart/products/${productId}`, { quantity: totalQuantity })
  } else {
    // If total quantity is 0, remove the product entirely
    await api.delete(`/cart/products/${productId}`)
    removeCartSelection(productId)
  }
}

/**
 * Remove a product from the cart
 * @returns void
 * @throws 401 Unauthorized - User is not authenticated
 */
export const removeFromCart = async (productId: number): Promise<void> => {
  await api.delete(`/cart/products/${productId}`)
  // Also remove from localStorage
  removeCartSelection(productId)
}

/**
 * Remove a specific cart item variant
 * For the API call, we still use the product ID, but we also clean up
 * the specific variant from localStorage
 */
export const removeCartItemVariant = async (
  cartItemKey: string
): Promise<void> => {
  // Parse the cart item key to get product details
  const parts = cartItemKey.split('-')
  const productId = parseInt(parts[0], 10)
  const color = parts[1] === 'no-color' ? undefined : parts[1]
  const size = parts[2] === 'no-size' ? undefined : parts[2]

  // Remove the specific variant from localStorage first
  const allSelections = getCartSelections()
  const remainingSelections = allSelections.filter(
    selection =>
      !(
        selection.productId === productId &&
        selection.selected_color === color &&
        selection.selected_size === size
      )
  )

  // Check if there are any remaining variants for this product
  const hasRemainingVariants = remainingSelections.some(
    selection => selection.productId === productId
  )

  if (!hasRemainingVariants) {
    // No more variants, remove the entire product from backend
    await api.delete(`/cart/products/${productId}`)
    // Remove all selections for this product
    removeCartSelection(productId)
  } else {
    // Calculate new total quantity for backend
    const totalQuantity = remainingSelections
      .filter(selection => selection.productId === productId)
      .reduce((sum, selection) => sum + selection.quantity, 0)

    // Update backend with new total quantity
    await api.patch(`/cart/products/${productId}`, { quantity: totalQuantity })

    // Update localStorage by removing the specific variant
    localStorage.setItem('cart_selections', JSON.stringify(remainingSelections))
  }
}

/**
 * Get all items in the cart
 * @returns Array of cart items
 * @throws 401 Unauthorized - User is not authenticated
 */
export const getCart = async (): Promise<CartItem[]> => {
  const { data } = await api.get('/cart')

  // Since the backend only stores one item per product ID, we need to simulate
  // multiple variants by matching them with localStorage selections
  const allSelections = getCartSelections()

  const cartItems: CartItem[] = []

  // Group selections by product ID
  const selectionsByProduct = allSelections.reduce(
    (
      acc: Record<number, CartItemSelection[]>,
      selection: CartItemSelection
    ) => {
      if (!acc[selection.productId]) {
        acc[selection.productId] = []
      }
      acc[selection.productId].push(selection)
      return acc
    },
    {} as Record<number, CartItemSelection[]>
  )

  // For each item from the API, create cart items for each variant stored in localStorage
  data.forEach((apiItem: CartItem) => {
    const selections = selectionsByProduct[apiItem.id] || []

    if (selections.length === 0) {
      // No specific selections, create a default item
      cartItems.push({
        ...apiItem,
        cartItemKey: generateCartItemKey(apiItem.id),
      })
    } else {
      // Create an item for each variant using the quantity from localStorage
      selections.forEach((selection: CartItemSelection) => {
        const cartItem = {
          ...apiItem,
          cover_image: selection.cover_image || apiItem.cover_image,
          selected_color: selection.selected_color,
          selected_size: selection.selected_size,
          cartItemKey: generateCartItemKey(
            apiItem.id,
            selection.selected_color,
            selection.selected_size
          ),
          // Use the quantity stored in localStorage for this specific variant
          quantity: selection.quantity,
        }

        cartItems.push(cartItem)
      })
    }
  })

  // Clean up localStorage for items no longer in cart
  const activeProductIds = data.map((item: CartItem) => item.id)
  cleanupCartSelections(activeProductIds)

  // Deduplicate cart items by cartItemKey (this shouldn't be necessary, but ensures no duplicates)
  const uniqueCartItems = cartItems.reduce((acc: CartItem[], item) => {
    const existingIndex = acc.findIndex(
      existing => existing.cartItemKey === item.cartItemKey
    )
    if (existingIndex === -1) {
      acc.push(item)
    }
    return acc
  }, [])

  return uniqueCartItems
}

/**
 * Checkout all items in the cart
 * @param checkoutData The checkout form data with user information
 * @returns Success message
 * @throws 400 Bad Request - Cart is empty or other error
 * @throws 401 Unauthorized - User is not authenticated
 * @throws 422 Unprocessable Content - Missing required fields
 */
export const checkout = async (
  checkoutData: CheckoutFormData
): Promise<{ message: string }> => {
  try {
    // Transform our form data to match API expectations
    const apiData = {
      name: checkoutData.firstName,
      surname: checkoutData.lastName,
      email: checkoutData.email,
      address: checkoutData.address,
      zip_code: checkoutData.zipCode,
    }

    const { data } = await api.post('/cart/checkout', apiData)

    // Clear localStorage selections after successful checkout
    clearCartSelections()

    return data
  } catch (error: unknown) {
    const axiosError = error as AxiosErrorResponse

    // Provide more specific error messages based on status code
    if (axiosError.response?.status === 422) {
      const errorMessage =
        axiosError.response?.data?.message ||
        'Invalid request. Please check your information and try again.'
      throw new Error(errorMessage)
    }

    throw error
  }
}
