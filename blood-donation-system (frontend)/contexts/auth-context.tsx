"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authAPI, setAuthToken, removeAuthToken, getAuthToken } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import type { User, JwtResponse } from "@/lib/types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  isDonor: boolean
  login: (credentials: { username: string; password: string }) => Promise<void>
  verifyOTP: (username: string, otp: string) => Promise<void>
  logout: () => void
  register: (userData: any) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const isAuthenticated = !!user
  const isAdmin = user?.role === "ADMIN"
  const isDonor = user?.role === "DONOR"

  // Check for existing auth on mount
  useEffect(() => {
    const token = getAuthToken()
    const userInfo = localStorage.getItem("userInfo")

    if (token && userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo)
        setUser(parsedUser)
      } catch (error) {
        console.error("Error parsing user info:", error)
        removeAuthToken()
      }
    }

    setIsLoading(false)
  }, [])

  const login = async (credentials: { username: string; password: string }) => {
    try {
      const response = await authAPI.login(credentials)
      // Store temporary login state for OTP verification
      localStorage.setItem("tempLoginData", JSON.stringify({ username: credentials.username }))
      return response
    } catch (error) {
      throw error
    }
  }

  const verifyOTP = async (username: string, otp: string) => {
    try {
      const response: JwtResponse = await authAPI.verifyOTP(username, otp)

      if (response.token) {
        setAuthToken(response.token)

        const userData: User = {
          id: 1, // You might want to include user ID in JwtResponse
          username: response.username,
          email: "", // You might want to include email in JwtResponse
          role: response.role as "USER" | "DONOR" | "ADMIN",
        }

        setUser(userData)
        localStorage.setItem("userInfo", JSON.stringify(userData))
        localStorage.removeItem("tempLoginData")

        toast({
          title: "Login Successful",
          description: `Welcome back, ${response.username}!`,
        })

        router.push("/dashboard")
      } else {
        throw new Error("No token received from server")
      }
    } catch (error) {
      throw error
    }
  }

  const register = async (userData: any) => {
    try {
      await authAPI.register(userData)
      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully. Please login.",
      })
      router.push("/")
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    removeAuthToken()
    setUser(null)
    router.push("/")
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
  }

  const value = {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    isDonor,
    login,
    verifyOTP,
    logout,
    register,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
