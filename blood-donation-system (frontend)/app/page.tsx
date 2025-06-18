import { LoginForm } from "@/components/auth/login-form"

export default function Home() {
  // In a real app, check if user is authenticated and redirect to dashboard
  // For demo purposes, we'll just show the login page
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md p-6">
        <LoginForm />
      </div>
    </div>
  )
}
