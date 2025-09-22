import { api } from '@/lib/api/axios'
import type { Product } from '@/features/products/types/product'
import type { CheckoutFormData } from '@/features/checkout/types/checkout'

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
  brand?: {
    id: number
    name: string
  }
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
 * Remove a product from the cart
 * @returns void
 * @throws 401 Unauthorized - User is not authenticated
 */
export const removeFromCart = async (productId: number): Promise<void> => {
  await api.delete(`/cart/products/${productId}`)
}

/**
 * Get all items in the cart
 * @returns Array of cart items
 * @throws 401 Unauthorized - User is not authenticated
 */
export const getCart = async (): Promise<CartItem[]> => {
  const { data } = await api.get('/cart')
  return data
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
    console.log('Starting checkout API call with data:', checkoutData)

    // Transform our form data to match API expectations
    const apiData = {
      name: checkoutData.firstName,
      surname: checkoutData.lastName,
      email: checkoutData.email,
      address: checkoutData.address,
      zip_code: checkoutData.zipCode,
    }

    console.log('Sending to API:', apiData)
    const { data } = await api.post('/cart/checkout', apiData)
    console.log('Checkout successful:', data)
    return data
  } catch (error: unknown) {
    const axiosError = error as AxiosErrorResponse
    console.error('Checkout error details:', {
      status: axiosError.response?.status,
      statusText: axiosError.response?.statusText,
      data: axiosError.response?.data,
      message: axiosError.message || 'Unknown error',
    })

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
