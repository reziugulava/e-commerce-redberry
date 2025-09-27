import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  addToCart,
  checkout,
  getCart,
  removeFromCart,
  updateCartItem,
} from '../api/cart'
import type { AddToCartPayload, CartItem } from '../api/cart'
import { useUserStore } from '@/features/auth/stores/user'
import { setCartSelection } from '../utils/cart-storage'

export const CART_QUERY_KEY = ['cart']

export function useCart() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const user = useUserStore(state => state.user)

  // Helper function to check authentication and redirect if needed
  const checkAuthAndRedirect = () => {
    if (!user) {
      toast.info('Please log in to add items to your cart')
      navigate('/login')
      return false
    }
    return true
  }

  // Fetch cart
  const { data: cart, isLoading } = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: getCart,
    enabled: !!user, // Only fetch cart if user is authenticated
  })

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: ({
      productId,
      payload,
      productData,
    }: {
      productId: number
      payload: AddToCartPayload
      productData?: {
        cover_image?: string
        selected_color?: string
        selected_size?: string
      }
    }) => {
      if (!checkAuthAndRedirect()) {
        throw new Error('Authentication required')
      }

      // Store product selection data in localStorage
      if (productData) {
        setCartSelection({
          productId,
          selected_color: productData.selected_color,
          selected_size: productData.selected_size,
          cover_image: productData.cover_image,
        })
      }

      return addToCart(productId, payload)
    },
    onMutate: async ({ productId, payload }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY })

      // Get current cart
      const previousCart =
        queryClient.getQueryData<CartItem[]>(CART_QUERY_KEY) ?? []

      // Create optimistic cart item
      const newItem = {
        id: productId,
        quantity: payload.quantity,
        // If the item already exists in cart, use its data
        ...previousCart.find(item => item.id === productId),
      }

      // Update cart optimistically
      const newCart = [...previousCart]
      const existingItemIndex = newCart.findIndex(item => item.id === productId)

      if (existingItemIndex > -1) {
        newCart[existingItemIndex].quantity += payload.quantity
      } else if ('name' in newItem) {
        // Only add if we have full item data
        newCart.push(newItem as CartItem)
      }

      queryClient.setQueryData(CART_QUERY_KEY, newCart)

      return { previousCart }
    },
    onError: (error: any, _variables, context) => {
      // If 401 unauthorized, redirect to login
      if (error?.response?.status === 401) {
        navigate('/login')
      }
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previousCart)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
    },
  })

  // Update cart item mutation
  const updateCartMutation = useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: number
      quantity: number
    }) => updateCartItem(productId, quantity),
    onMutate: async ({ productId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY })
      const previousCart =
        queryClient.getQueryData<CartItem[]>(CART_QUERY_KEY) ?? []

      const newCart = previousCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )

      queryClient.setQueryData(CART_QUERY_KEY, newCart)

      return { previousCart }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previousCart)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
    },
  })

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: (productId: number) => removeFromCart(productId),
    onMutate: async productId => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY })
      const previousCart =
        queryClient.getQueryData<CartItem[]>(CART_QUERY_KEY) ?? []

      const newCart = previousCart.filter(item => item.id !== productId)
      queryClient.setQueryData(CART_QUERY_KEY, newCart)

      return { previousCart }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previousCart)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
    },
  })

  // Checkout mutation
  const checkoutMutation = useMutation({
    mutationFn: checkout,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY })
      const previousCart =
        queryClient.getQueryData<CartItem[]>(CART_QUERY_KEY) ?? []

      queryClient.setQueryData(CART_QUERY_KEY, [])

      return { previousCart }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previousCart)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
    },
  })

  // Wrapper function for addToCart with authentication check
  const addToCartWithAuthCheck = (params: {
    productId: number
    payload: AddToCartPayload
    productData?: {
      cover_image?: string
      selected_color?: string
      selected_size?: string
    }
  }) => {
    if (!checkAuthAndRedirect()) {
      return
    }
    addToCartMutation.mutate(params)
  }

  return {
    // Cart data
    cart,
    isLoading,

    // Mutations
    addToCart: addToCartWithAuthCheck,
    isAddingToCart: addToCartMutation.isPending,
    addToCartError: addToCartMutation.error,

    updateCartItem: updateCartMutation.mutate,
    isUpdatingCart: updateCartMutation.isPending,
    updateCartError: updateCartMutation.error,

    removeFromCart: removeFromCartMutation.mutate,
    isRemovingFromCart: removeFromCartMutation.isPending,
    removeFromCartError: removeFromCartMutation.error,

    checkout: checkoutMutation.mutate,
    isCheckingOut: checkoutMutation.isPending,
    checkoutError: checkoutMutation.error,
  }
}
