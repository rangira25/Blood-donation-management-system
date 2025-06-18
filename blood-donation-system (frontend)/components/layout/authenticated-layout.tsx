"use client"

import type React from "react"
import { MainNav } from "@/components/layout/main-nav"
import { Footer } from "@/components/layout/footer"
import { WelcomeMessage } from "@/components/layout/welcome-message"
import { useAuth } from "@/contexts/auth-context"

interface AuthenticatedLayoutProps {
  children: React.ReactNode
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { user } = useAuth()

  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <MainNav />
      <div className="flex-1 container mx-auto px-4 md:px-6 lg:px-8 py-4 overflow-y-auto">
        <WelcomeMessage userName={user?.username || "User"} />
        {children}
      </div>
      <Footer />
    </div>
  )
}
