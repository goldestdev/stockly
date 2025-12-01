'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { Menu, Crown, LogOut, Sun, Moon, Laptop, User } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { TestAlertButton } from '@/components/test-alert-button'
import Link from 'next/link'
import { useTheme } from "next-themes"
import { updateTheme } from "@/app/actions"

export function DashboardNav({ user, profile }: { user: any, profile: any }) {
  const { setTheme } = useTheme()

  const handleThemeChange = (theme: string) => {
    setTheme(theme)
    updateTheme(theme).catch(() => {}) 
  }

  return (
    <div className="flex items-center gap-2">
       {/* Upgrade Button - Always Visible */}
       {profile?.plan === 'free' && (
          <Link href="/upgrade">
            <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-md h-9 px-3">
               <Crown className="h-4 w-4 sm:mr-2" />
               <span className="hidden sm:inline font-medium">Upgrade</span>
            </Button>
          </Link>
       )}

       {/* Desktop Actions */}
       <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <TestAlertButton />
          <form action="/auth/signout" method="post">
             <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
               <LogOut className="h-5 w-5" />
             </Button>
          </form>
       </div>

       {/* Mobile Menu */}
       <div className="md:hidden">
         <DropdownMenu>
           <DropdownMenuTrigger asChild>
             <Button variant="ghost" size="icon" className="-mr-2">
               <Menu className="h-6 w-6" />
             </Button>
           </DropdownMenuTrigger>
           <DropdownMenuContent align="end" className="w-56">
             <DropdownMenuLabel className="font-normal">
               <div className="flex flex-col space-y-1">
                 <p className="text-sm font-medium leading-none">{user.user_metadata.full_name}</p>
                 <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
               </div>
             </DropdownMenuLabel>
             <DropdownMenuSeparator />
             
             <DropdownMenuSub>
               <DropdownMenuSubTrigger>
                 <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                 <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                 <span className="ml-2">Theme</span>
               </DropdownMenuSubTrigger>
               <DropdownMenuSubContent>
                 <DropdownMenuItem onClick={() => handleThemeChange("light")}>
                   <Sun className="mr-2 h-4 w-4" />
                   Light
                 </DropdownMenuItem>
                 <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
                   <Moon className="mr-2 h-4 w-4" />
                   Dark
                 </DropdownMenuItem>
                 <DropdownMenuItem onClick={() => handleThemeChange("system")}>
                   <Laptop className="mr-2 h-4 w-4" />
                   System
                 </DropdownMenuItem>
               </DropdownMenuSubContent>
             </DropdownMenuSub>

             <DropdownMenuItem asChild>
               <div className="w-full cursor-pointer">
                 <TestAlertButton />
               </div>
             </DropdownMenuItem>
             
             <DropdownMenuSeparator />

             <form action="/auth/signout" method="post" className="w-full">
               <button type="submit" className="w-full">
                 <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer">
                   <LogOut className="mr-2 h-4 w-4" />
                   Sign Out
                 </DropdownMenuItem>
               </button>
             </form>
           </DropdownMenuContent>
         </DropdownMenu>
       </div>
    </div>
  )
}
