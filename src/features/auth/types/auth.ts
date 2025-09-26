export interface User {
  id: number
  email: string
  username: string
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
  username: string
  avatar?: File
}
