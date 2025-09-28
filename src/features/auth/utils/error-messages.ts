import { AxiosError } from 'axios'

interface ApiErrorResponse {
  message?: string
  error?: string
  errors?: Record<string, string[]>
}

/**
 * Maps authentication API errors to user-friendly messages
 */
export function getAuthErrorMessage(error: unknown): string {
  if (!error) return 'An unexpected error occurred'

  const axiosError = error as AxiosError<ApiErrorResponse>

  // Check if it's an axios error with response
  if (axiosError.response?.data) {
    const { data, status } = axiosError.response

    // Handle specific HTTP status codes
    switch (status) {
      case 401: {
        // Check for specific error messages that indicate wrong credentials
        const message = data.message?.toLowerCase() || ''
        const error = data.error?.toLowerCase() || ''

        if (
          message.includes('unauthenticated') ||
          message.includes('unauthorized') ||
          error.includes('unauthenticated') ||
          error.includes('unauthorized') ||
          message.includes('invalid credentials') ||
          message.includes('login failed') ||
          error.includes('invalid credentials') ||
          error.includes('login failed')
        ) {
          return 'Incorrect email or password. Please check your credentials and try again.'
        }

        if (message.includes('email') && message.includes('not found')) {
          return 'No account found with this email address.'
        }

        if (message.includes('password') && message.includes('incorrect')) {
          return 'Incorrect password. Please try again.'
        }

        return 'Authentication failed. Please check your email and password.'
      }

      case 422:
        // Validation errors
        if (data.errors) {
          // Get the first validation error
          const firstError = Object.values(data.errors)[0]
          if (firstError && firstError.length > 0) {
            return firstError[0]
          }
        }
        if (data.message) {
          return data.message
        }
        return 'Please check your input and try again.'

      case 429:
        return 'Too many login attempts. Please wait a moment and try again.'

      case 500:
        return 'Server error. Please try again later.'

      default:
        // Try to get specific error message from response
        if (data.message) {
          return data.message
        }
        if (data.error) {
          return data.error
        }
    }
  }

  // Handle network errors
  if (
    axiosError.code === 'NETWORK_ERROR' ||
    axiosError.message?.includes('Network Error')
  ) {
    return 'Network error. Please check your internet connection and try again.'
  }

  // Handle timeout errors
  if (
    axiosError.code === 'ECONNABORTED' ||
    axiosError.message?.includes('timeout')
  ) {
    return 'Request timed out. Please try again.'
  }

  // Fallback to generic error message
  if (axiosError.message) {
    return axiosError.message
  }

  return 'An unexpected error occurred. Please try again.'
}

/**
 * Maps registration API errors to user-friendly messages
 */
export function getRegisterErrorMessage(error: unknown): string {
  if (!error) return 'An unexpected error occurred'

  const axiosError = error as AxiosError<ApiErrorResponse>

  if (axiosError.response?.data) {
    const { data, status } = axiosError.response

    switch (status) {
      case 422: {
        // Handle validation errors
        if (data.errors) {
          const errors = []

          // Email errors (prioritize email errors)
          if (data.errors.email) {
            const emailError = data.errors.email[0]
            if (
              emailError.includes('already') ||
              emailError.includes('taken')
            ) {
              return 'An account with this email already exists.'
            }
            errors.push(...data.errors.email)
          }

          // Password errors
          if (data.errors.password) {
            errors.push(...data.errors.password)
          }

          // Username errors
          if (data.errors.username || data.errors.name) {
            const usernameErrors =
              data.errors.username || data.errors.name || []
            if (
              usernameErrors.some(
                (err: string) =>
                  err.includes('already') || err.includes('taken')
              )
            ) {
              return 'This username is already taken. Please choose a different one.'
            }
            errors.push(...usernameErrors)
          }

          if (errors.length > 0) {
            return errors[0] // Return the first error
          }
        }

        if (data.message) {
          return data.message
        }
        return 'Please check your input and try again.'
      }

      case 409:
        return 'An account with this email already exists.'

      default:
        return getAuthErrorMessage(error) // Use generic auth error handler
    }
  }

  return getAuthErrorMessage(error) // Use generic auth error handler
}
