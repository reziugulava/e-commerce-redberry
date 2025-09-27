import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { User, RefreshCw } from 'lucide-react'
import { useLogout, useCurrentUser } from '../hooks/use-auth'
import { useUserStore } from '../stores/user'

export function UserNav() {
  const user = useUserStore(state => state.user)
  const logout = useLogout()
  const { mutate: refreshUser, isPending } = useCurrentUser()

  if (!user) return null

  const handleRefreshUser = () => {
    refreshUser()
  }

  // Debug log to check if profile_photo is available
  console.log('User in UserNav:', user)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {user.profile_photo ? (
              <img
                src={user.profile_photo}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-4 w-4 text-gray-600" />
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {user.profile_photo ? (
                  <img
                    src={user.profile_photo}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-3 w-3 text-gray-600" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium leading-none">
                  {user.username}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleRefreshUser} disabled={isPending}>
          <RefreshCw className="mr-2 h-4 w-4" />
          {isPending ? 'Refreshing...' : 'Refresh Profile'}
        </DropdownMenuItem>
        {user.is_admin === 1 && (
          <DropdownMenuItem>Admin Dashboard</DropdownMenuItem>
        )}
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
