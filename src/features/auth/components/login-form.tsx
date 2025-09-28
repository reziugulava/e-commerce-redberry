import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { getAuthErrorMessage } from '../utils/error-messages'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
  const { mutate: login, isPending, error, reset } = useLogin()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Reset mutation error when user starts typing
  const handleInputChange = () => {
    if (error) {
      reset()
    }
  }

  const onSubmit = (data: LoginData) => {
    // Prevent any default form behavior
    // Clear any previous form errors
    form.clearErrors()
    login(data)
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

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                noValidate
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Email *"
                            type="email"
                            className="h-12"
                            {...field}
                            onChange={e => {
                              field.onChange(e)
                              handleInputChange()
                            }}
                          />
                        </div>
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
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Password *"
                            type={showPassword ? 'text' : 'password'}
                            className="h-12 pr-10"
                            {...field}
                            onChange={e => {
                              field.onChange(e)
                              handleInputChange()
                            }}
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
                  <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md p-3">
                    {getAuthErrorMessage(error)}
                  </div>
                )}

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full h-12 text-white font-medium text-base"
                    style={{ backgroundColor: '#FF4000' }}
                    onMouseEnter={e =>
                      (e.currentTarget.style.backgroundColor = '#E6390A')
                    }
                    onMouseLeave={e =>
                      (e.currentTarget.style.backgroundColor = '#FF4000')
                    }
                    disabled={isPending}
                  >
                    {isPending ? 'Logging in...' : 'Login'}
                  </Button>
                </div>
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
