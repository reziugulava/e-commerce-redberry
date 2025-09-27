import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Upload, X } from 'lucide-react'
import { toast } from 'sonner'

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useUpdateProfile, useUpdateAvatar } from '../hooks/use-auth'
import { useUserStore } from '../stores/user'

const MAX_FILE_SIZE = 5000000 // 5MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

const profileSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
})

type ProfileFormData = z.infer<typeof profileSchema>

export function ProfileSettings() {
  const user = useUserStore(state => state.user)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateProfile()
  const { mutate: updateAvatar, isPending: isUpdatingAvatar } = useUpdateAvatar()

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: user?.email || '',
      username: user?.name || user?.username || '',
    },
  })

  if (!user) return null

  const onSubmit = (data: ProfileFormData) => {
    updateProfile(data, {
      onSuccess: () => {
        toast.success('Profile updated successfully')
        setIsOpen(false)
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to update profile')
      },
    })
  }

  const handleAvatarChange = (file: File | null) => {
    if (!file) return

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size must be less than 5MB')
      return
    }

    // Validate file type
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Only .jpg, .jpeg, .png and .webp files are accepted')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
    setSelectedAvatar(file)
  }

  const handleAvatarUpload = () => {
    if (!selectedAvatar) return

    updateAvatar(selectedAvatar, {
      onSuccess: () => {
        toast.success('Avatar updated successfully')
        setAvatarPreview(null)
        setSelectedAvatar(null)
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to update avatar')
      },
    })
  }

  const removeAvatarPreview = () => {
    setAvatarPreview(null)
    setSelectedAvatar(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
          <DialogDescription>
            Update your profile information and avatar.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden relative">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              ) : user.profile_photo ? (
                <img
                  src={user.profile_photo}
                  alt={user.name || user.username || 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-gray-400" />
              )}
              {avatarPreview && (
                <button
                  onClick={removeAvatarPreview}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <label className="cursor-pointer">
                <div className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
                  <Upload className="w-4 h-4" />
                  <span>Upload new avatar</span>
                </div>
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
              {selectedAvatar && (
                <Button
                  size="sm"
                  onClick={handleAvatarUpload}
                  disabled={isUpdatingAvatar}
                >
                  {isUpdatingAvatar ? 'Uploading...' : 'Save Avatar'}
                </Button>
              )}
            </div>
          </div>

          {/* Profile Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isUpdatingProfile}
              >
                {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}