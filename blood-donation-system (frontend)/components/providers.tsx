"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { AppProvider } from "@/contexts/app-context"
import { ToastProvider } from "@/contexts/toast-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ToastProvider>
        <AuthProvider>
          <AppProvider>{children}</AppProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
