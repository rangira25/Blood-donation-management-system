import type React from "react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import type { UserRole } from "@/lib/auth"

// The username will now be automatically fetched from auth context
const userRole: UserRole = "admin" // or "user"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthenticatedLayout role={userRole}>{children}</AuthenticatedLayout>
}
