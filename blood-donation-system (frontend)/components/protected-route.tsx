"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: string[]
  adminOverride?: boolean // Allow admins to bypass role restrictions
}

export function ProtectedRoute({ children, requiredRoles = [], adminOverride = true }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/")
        return
      }

      // If admin override is enabled and user is admin, allow access
      if (adminOverride && isAdmin) {
        return
      }

      // Check role-based access for non-admins
      if (requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
        router.push("/unauthorized")
        return
      }
    }
  }, [isAuthenticated, isLoading, user, requiredRoles, router, isAdmin, adminOverride])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  // Allow access if admin (with override) or if user has required role
  if ((adminOverride && isAdmin) || requiredRoles.length === 0 || (user && requiredRoles.includes(user.role))) {
    return <>{children}</>
  }

  return null
}
