"use client"

import type React from "react"
import { createContext, useContext } from "react"
import { Toaster } from "@/components/ui/toaster"
import { useToast as useToastPrimitive } from "@/components/ui/use-toast"

interface ToastContextType {
  toast: ReturnType<typeof useToastPrimitive>["toast"]
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToastPrimitive()

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
