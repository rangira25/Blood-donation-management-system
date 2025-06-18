"use client"

import { ProtectedRoute } from "@/components/protected-route"
import RequestsPageContent from "@/components/requests/requests-page-content"

export default function RequestsPage() {
  // This is a protected route that only admins can access
  return (
    <ProtectedRoute requiredRoles={["admin"]}>
      <RequestsPageContent />
    </ProtectedRoute>
  )
}
