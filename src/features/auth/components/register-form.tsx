import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Eye, EyeOff, User } from 'lucide-react'
import { getRegisterErrorMessage } from '../utils/error-messages'

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
import { useRegister } from '../hooks/use-auth'
import type { RegisterData } from '@/features/auth/types/auth'

const MAX_FILE_SIZE = 5000000 // 5MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

const registerSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    username: z.string().min(2, 'Username must be at least 2 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    password_confirmation: z.string(),
    avatar: z
      .custom<File>()
      .refine(
        file => !file || file.size <= MAX_FILE_SIZE,
        `Max file size is 5MB.`
      )
      .refine(
        file => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
        '.jpg, .jpeg, .png and .webp files are accepted.'
      )
      .optional(),
  })
  .refine(data => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ['password_confirmation'],
  })

export function RegisterForm() {
  const { mutate: register, isPending, error } = useRegister()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const form = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      password_confirmation: '',
    },
  })

  const onSubmit = (data: RegisterData) => {
    register(data)
  }

  const handleAvatarChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      form.setValue('avatar', file)
    }
  }

  const removeAvatar = () => {
    setAvatarPreview(null)
    form.setValue('avatar', undefined)
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
              <h1 className="text-3xl font-bold text-black mb-2">
                Registration
              </h1>
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
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Username <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your username"
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

                <FormField
                  control={form.control}
                  name="password_confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Confirm Password <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Confirm your password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            className="h-12 pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? (
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
                  <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md p-3">
                    {getRegisterErrorMessage(error)}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium text-base"
                  disabled={isPending}
                >
                  {isPending ? 'Creating Account...' : 'Register'}
                </Button>
              </form>
            </Form>

            <div className="text-center text-sm text-gray-600">
              Already member?{' '}
              <Link
                to="/login"
                className="text-red-500 hover:text-red-600 font-medium"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
