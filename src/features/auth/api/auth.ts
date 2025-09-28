import { api } from '@/lib/api/axios'
import { AxiosError } from 'axios'
import type {
  LoginData,
  RegisterData,
  AuthResponse,
} from '@/features/auth/types/auth'

export const authApi = {
  login: async (data: LoginData) => {
    const response = await api.post<AuthResponse>('/login', data)
    return response.data
  },

  register: async (data: RegisterData) => {
    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('password', data.password)
    formData.append('password_confirmation', data.password_confirmation)
    formData.append('username', data.username) // API expects 'username' field for registration
    if (data.avatar) {
      formData.append('avatar', data.avatar)
    }

    const response = await api.post<AuthResponse>('/register', formData)
    return response.data
  },

  getCurrentUser: async () => {
    const response = await api.get('/user')
    return response.data
  },

  updateProfile: async (data: { username?: string; email?: string }) => {
    try {
      const response = await api.put<AuthResponse>('/user', data)
      return response.data
    } catch (error: unknown) {
      // If endpoint doesn't exist, throw a more helpful error
      if (error instanceof AxiosError && error.response?.status === 404) {
        throw new Error(
          'Profile update is not supported by the current API version'
        )
      }
      throw error
    }
  },

  updateAvatar: async (avatar: File) => {
    const formData = new FormData()
    formData.append('avatar', avatar)
    formData.append('_method', 'PATCH') // Laravel method spoofing for PATCH request

    try {
      const response = await api.post<AuthResponse>('/user/avatar', formData)
      return response.data
    } catch (error: unknown) {
      // Try alternative endpoint
      if (error instanceof AxiosError && error.response?.status === 404) {
        try {
          const response = await api.patch<AuthResponse>('/user', formData)
          return response.data
        } catch (secondError: unknown) {
          throw new Error(
            'Avatar update is not supported by the current API version'
          )
        }
      }
      throw error
    }
  },
}
