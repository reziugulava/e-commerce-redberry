export interface User {
  id: number
  email: string
  name: string
  username?: string // Keep this for backward compatibility, but the API uses 'name'
  is_admin: number
  remember_token: string | null
  profile_photo?: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  password_confirmation: string
  username: string // Keep as username for form, but we'll send as 'name' to API
  avatar?: File
}
