import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Eye, EyeOff, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useLogin } from '../hooks/use-auth'
import type { LoginData } from '@/features/auth/types/auth'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export function LoginForm() {
  const { mutate: login, isPending, error } = useLogin()
  const [showPassword, setShowPassword] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: LoginData) => {
    login(data)
  }

  const handleAvatarChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeAvatar = () => {
    setAvatarPreview(null)
  }

  return (
    <div className="fixed inset-0 flex">
      {/* Left Column - Image */}
      <div className="hidden lg:flex lg:w-[50%] relative">
        <img
          src="/rectangle-10.png"
          alt="Rectangle 10"
          className="w-full h-full object-fill"
        />
      </div>

      {/* Right Column - Form */}
      <div className="flex-1 lg:w-[50%] flex flex-col pt-16">
        {/* Form Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            <div className="text-left">
              <h1 className="text-3xl font-bold text-black mb-2">Login</h1>
            </div>

            {/* Profile Picture Upload */}
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex space-x-4 text-sm">
                <label className="text-gray-600 hover:text-gray-900 cursor-pointer">
                  Upload new
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0] || null
                      handleAvatarChange(file)
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Remove
                </button>
              </div>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Email <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          type="email"
                          className="h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Password <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter your password"
                            type={showPassword ? 'text' : 'password'}
                            className="h-12 pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <div className="text-sm text-red-500">
                    {(error as Error).message || 'An error occurred'}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium text-base"
                  disabled={isPending}
                >
                  {isPending ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </Form>

            <div className="text-center text-sm text-gray-600">
              not a member?{' '}
              <Link
                to="/register"
                className="text-red-500 hover:text-red-600 font-medium"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
