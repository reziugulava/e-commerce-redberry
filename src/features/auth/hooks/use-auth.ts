import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/auth'
import { useUserStore } from '../stores/user'
import type { LoginData, RegisterData } from '@/features/auth/types/auth'

export function useLogin() {
  const navigate = useNavigate()
  const { setUser, setToken } = useUserStore()

  return useMutation({
    mutationFn: (data: LoginData) => authApi.login(data),
    onSuccess: data => {
      console.log('Login successful, received user data:', data.user)
      console.log('User profile_photo:', data.user.profile_photo)
      setUser(data.user)
      setToken(data.token)
      navigate('/')
    },
  })
}

export function useRegister() {
  const navigate = useNavigate()
  const { setUser, setToken } = useUserStore()

  return useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: data => {
      console.log('Registration successful, received user data:', data.user)
      console.log('User profile_photo:', data.user.profile_photo)
      setUser(data.user)
      setToken(data.token)
      navigate('/')
    },
    onError: (error: any) => {
      console.error('Registration error:', error)
      // Log more details about the error
      if (error.response) {
        console.error('Response status:', error.response.status)
        console.error('Response data:', error.response.data)
      } else if (error.request) {
        console.error('Request made but no response:', error.request)
      } else {
        console.error('Error message:', error.message)
      }
    },
  })
}

export function useCurrentUser() {
  const { setUser } = useUserStore()

  return useMutation({
    mutationFn: () => authApi.getCurrentUser(),
    onSuccess: data => {
      // Update user with current profile information
      if (data) {
        setUser(data)
      }
    },
  })
}

export function useUpdateProfile() {
  const { setUser, setToken } = useUserStore()

  return useMutation({
    mutationFn: (data: { username?: string; email?: string }) => 
      authApi.updateProfile(data),
    onSuccess: data => {
      // Update both user and token since profile changes might affect authentication
      setUser(data.user)
      setToken(data.token)
    },
  })
}

export function useUpdateAvatar() {
  const { setUser, setToken } = useUserStore()

  return useMutation({
    mutationFn: (avatar: File) => authApi.updateAvatar(avatar),
    onSuccess: data => {
      // Update both user and token since avatar changes should persist
      setUser(data.user)
      setToken(data.token)
    },
  })
}

export function useLogout() {
  const navigate = useNavigate()
  const logout: () => void = useUserStore(state => state.logout)

  return () => {
    logout()
    navigate('/login')
  }
}
