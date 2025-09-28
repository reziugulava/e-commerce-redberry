import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import {
  addToCart,
  checkout,
  getCart,
  removeCartItemVariant,
  updateCartItemVariant,
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

      return addToCart(productId, payload)
    },
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY })

      // Get current cart for rollback purposes
      const previousCart =
        queryClient.getQueryData<CartItem[]>(CART_QUERY_KEY) ?? []

      // We'll let the onSuccess callback handle localStorage updates
      // and onSettled will trigger a fresh fetch

      return { previousCart }
    },
    onSuccess: (_data, { productId, payload, productData }) => {
      // Store product selection data in localStorage only after successful API call
      if (productData) {
        setCartSelection({
          productId,
          selected_color: productData.selected_color,
          selected_size: productData.selected_size,
          cover_image: productData.cover_image,
          quantity: payload.quantity,
        })
      }
    },
    onError: (error: unknown, _variables, context) => {
      // If 401 unauthorized, redirect to login
      if (error instanceof AxiosError && error.response?.status === 401) {
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
      cartItemKey,
      quantity,
    }: {
      cartItemKey: string
      quantity: number
    }) => {
      return updateCartItemVariant(cartItemKey, quantity)
    },
    onMutate: async ({ cartItemKey, quantity }) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY })
      const previousCart =
        queryClient.getQueryData<CartItem[]>(CART_QUERY_KEY) ?? []

      const newCart = previousCart.map(item =>
        item.cartItemKey === cartItemKey ? { ...item, quantity } : item
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
    mutationFn: (cartItemKey: string) => {
      return removeCartItemVariant(cartItemKey)
    },
    onMutate: async cartItemKey => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY })
      const previousCart =
        queryClient.getQueryData<CartItem[]>(CART_QUERY_KEY) ?? []

      const newCart = previousCart.filter(
        item => item.cartItemKey !== cartItemKey
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
