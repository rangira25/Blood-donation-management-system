"use client"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"

// Import the existing DonationsPage component
import DonationsPageContent from "@/components/donations/donations-page-content"

export default function DonationsPage() {
  const router = useRouter()

  // This is a protected route that only admins can access
  return (
    <ProtectedRoute requiredRoles={["admin"]}>
      <DonationsPageContent />
    </ProtectedRoute>
  )
}
