"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Heart,
  User,
  Droplet,
  AlertCircle,
  Calendar,
  LogOut,
  Menu,
  Search,
  X,
  LayoutDashboard,
  Users,
  MessageSquare,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { GlobalSearch } from "@/components/layout/global-search"
import { SocialLinks } from "@/components/layout/social-links"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationsPopover } from "@/components/notifications/notifications-popover"
import { useAuth } from "@/contexts/auth-context"
import { useApp } from "@/contexts/app-context"

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
  adminOnly?: boolean
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Donors", href: "/donors", icon: User },
  { name: "Donations", href: "/donations", icon: Droplet, adminOnly: true },
  { name: "Requests", href: "/requests", icon: AlertCircle, adminOnly: true },
  { name: "Appointments", href: "/appointments", icon: Calendar },
  { name: "Users", href: "/users", icon: Users, adminOnly: true },
  { name: "Contact Us", href: "/contact", icon: MessageSquare },
]

export function MainNav() {
  const pathname = usePathname()
  const { user, logout, isAdmin } = useAuth()
  const { state, setSidebarOpen } = useApp()
  const [showSearch, setShowSearch] = useState(false)

  // Admins can see everything, others see only non-admin items
  const filteredNavItems = navItems.filter((item) => !item.adminOnly || isAdmin)

  return (
    <div className="sticky top-0 z-50 flex h-16 items-center px-4 border-b bg-background shadow-sm">
      <Sheet open={state.sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon" className="mr-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[300px]">
          <div className="flex items-center gap-2 mb-8">
            <Heart className="h-6 w-6 text-red-500" />
            <span className="font-bold text-lg">Blood Donation</span>
          </div>
          <nav className="flex flex-col gap-4">
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href ? "text-primary" : "text-muted-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
                {item.adminOnly && (
                  <span className="ml-auto text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">Admin</span>
                )}
              </Link>
            ))}
            <button
              onClick={() => {
                logout()
                setSidebarOpen(false)
              }}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </nav>
          <div className="mt-8">
            <SocialLinks className="justify-start" />
          </div>
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-2">
        <Heart className="h-6 w-6 text-red-500" />
        <Link href="/dashboard" className="font-bold text-lg hidden md:block">
          Blood Donation System
        </Link>
      </div>
      <nav className="ml-auto hidden lg:flex gap-6">
        {filteredNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary relative",
              pathname === item.href ? "text-primary" : "text-muted-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
            {item.adminOnly && (
              <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white px-1 py-0.5 rounded-full text-[10px]">
                A
              </span>
            )}
          </Link>
        ))}
      </nav>
      <div className="ml-auto lg:ml-4 flex items-center gap-2">
        {showSearch ? (
          <div className="relative flex items-center">
            <Input className="w-[200px] md:w-[300px] pl-8" placeholder="Search..." autoFocus />
            <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
            <Button variant="ghost" size="icon" className="absolute right-0" onClick={() => setShowSearch(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button variant="ghost" size="icon" onClick={() => setShowSearch(true)}>
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
        )}
        <GlobalSearch />
        <NotificationsPopover />
        <ThemeToggle />
        {user && (
          <span
            className={cn(
              "text-sm font-medium hidden md:inline-block ml-2 px-2 py-1 rounded",
              isAdmin ? "bg-red-100 text-red-700 border border-red-200" : "bg-primary/10 text-primary",
            )}
          >
            {isAdmin ? "Admin" : user.role === "DONOR" ? "Donor" : "User"} - {user.username}
          </span>
        )}
        <Button variant="ghost" size="icon" onClick={logout}>
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Logout</span>
        </Button>
      </div>
    </div>
  )
}
