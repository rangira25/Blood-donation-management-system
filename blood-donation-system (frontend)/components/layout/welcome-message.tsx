import { CalendarCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface WelcomeMessageProps {
  userName?: string
}

export function WelcomeMessage({ userName = "User" }: WelcomeMessageProps) {
  // Get current time of day to personalize greeting
  const hour = new Date().getHours()
  let greeting = "Good morning"

  if (hour >= 12 && hour < 18) {
    greeting = "Good afternoon"
  } else if (hour >= 18) {
    greeting = "Good evening"
  }

  // Get current date formatted
  const today = new Date()
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  const formattedDate = today.toLocaleDateString("en-US", dateOptions)

  return (
    <Card className="mb-6 bg-gradient-to-r from-primary/10 to-background border-primary/20">
      <CardContent className="py-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {greeting}, {userName}!
          </h2>
          <p className="text-muted-foreground mt-1">Welcome back to your Blood Donation Management Dashboard</p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarCheck className="h-4 w-4" />
          <span>{formattedDate}</span>
        </div>
      </CardContent>
    </Card>
  )
}
