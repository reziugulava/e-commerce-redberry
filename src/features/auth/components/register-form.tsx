import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'

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

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Create an Account</h1>
        <p className="text-gray-500">
          Enter your information to create an account
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="hello@example.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe" {...field} />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    type="password"
                    {...field}
                  />
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
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Confirm your password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="avatar"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Profile Photo</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Select a profile photo"
                    type="file"
                    accept="image/*"
                    onChange={e => onChange(e.target.files)}
                    {...field}
                  />
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

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Creating Account...' : 'Register'}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        Already have an account?{' '}
        <Link to="/login" className="underline">
          Login
        </Link>
      </div>
    </div>
  )
}
