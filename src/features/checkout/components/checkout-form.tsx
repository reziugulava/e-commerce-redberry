'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import type { CheckoutFormData } from '../types/checkout'

const checkoutFormSchema = z.object({
  firstName: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  lastName: z.string().min(2, {
    message: 'Surname must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  address: z.string().min(5, {
    message: 'Address must be at least 5 characters.',
  }),
  zipCode: z
    .string()
    .min(4, {
      message: 'ZIP code must be at least 4 characters.',
    })
    .regex(/^[0-9]+$/, {
      message: 'ZIP code must contain only numbers.',
    }),
})

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void
  isLoading?: boolean
}

export function CheckoutForm({
  onSubmit,
  isLoading = false,
}: CheckoutFormProps) {
  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      zipCode: '',
    },
  })

  const handleSubmit = (data: CheckoutFormData) => {
    onSubmit(data)
  }

  return (
    <div
      className="rounded-xl p-16 w-[900px] h-[600px]"
      style={{ backgroundColor: '#F8F6F7' }}
    >
      <h2 className="text-2xl font-semibold mb-8">order details</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="flex flex-col md:flex-row md:space-x-5">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="name"
                      {...field}
                      disabled={isLoading}
                      className="bg-white w-62"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="surname"
                      {...field}
                      disabled={isLoading}
                      className="bg-white w-62"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="email address"
                    {...field}
                    disabled={isLoading}
                    className="bg-white w-129"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col md:flex-row md:space-x-5">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="address"
                      {...field}
                      disabled={isLoading}
                      className="bg-white w-62"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="ZIP code"
                      {...field}
                      disabled={isLoading}
                      className="bg-white w-62"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  )
}
