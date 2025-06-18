"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Heart, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/contexts/toast-context"

interface OTPVerificationProps {
  username: string
  onCancel: () => void
}

export function OTPVerification({ username, onCancel }: OTPVerificationProps) {
  const { verifyOTP } = useAuth()
  const { toast } = useToast()
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [error, setError] = useState("")

  // Countdown timer for OTP expiration
  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (otp.length === 6) {
      try {
        await verifyOTP(username, otp)
      } catch (error) {
        setError("Invalid OTP. Please try again.")
        toast({
          title: "Verification Failed",
          description: error instanceof Error ? error.message : "Invalid OTP",
          variant: "destructive",
        })
      }
    } else {
      setError("Please enter a valid 6-digit code")
    }

    setIsLoading(false)
  }

  const handleResendOTP = () => {
    // In a real implementation, you would call the resend OTP API
    setTimeLeft(60)
    setError("")
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-2">
          <Heart className="h-10 w-10 text-red-500" />
        </div>
        <CardTitle className="text-2xl text-center">Two-Factor Authentication</CardTitle>
        <CardDescription className="text-center">
          We've sent a verification code to your email. Please enter the code below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
              maxLength={6}
              required
              className="text-center text-lg tracking-widest"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify Code"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center text-muted-foreground">
          {timeLeft > 0 ? (
            <span>Resend code in {timeLeft} seconds</span>
          ) : (
            <button onClick={handleResendOTP} className="text-primary hover:underline" type="button">
              Resend verification code
            </button>
          )}
        </div>
        <Button variant="ghost" onClick={onCancel} className="w-full">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Login
        </Button>
      </CardFooter>
    </Card>
  )
}
