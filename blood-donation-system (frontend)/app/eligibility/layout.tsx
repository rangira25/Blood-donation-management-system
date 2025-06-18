import type React from "react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"

export default function EligibilityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>
}
