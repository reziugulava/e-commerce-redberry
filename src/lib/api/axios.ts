import axios from 'axios'

export const API_URL = 'https://api.redseam.redberryinternship.ge/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
  },
})

// Add request interceptor to handle auth token and content type
api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // Only set JSON content-type if data is not FormData
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json'
  }

  return config
})

// Add response interceptor to handle errors
api.interceptors.response.use(
  response => response,
  error => {
    // Only redirect to login on 401 if user is already logged in
    // Don't redirect during login attempts
    if (
      error.response?.status === 401 &&
      error.config?.url !== '/login' &&
      localStorage.getItem('auth_token')
    ) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      // Redirect to login page only if not already on login page
      if (
        typeof window !== 'undefined' &&
        !window.location.pathname.includes('/login')
      ) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
