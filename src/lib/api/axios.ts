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
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
