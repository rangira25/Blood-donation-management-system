// This is a simplified auth utility for demo purposes
// In a real application, you would use a proper auth library

export type UserRole = "admin" | "user"

export interface User {
  id: string
  username: string
  email: string
  role: UserRole
  name?: string
}

// Mock function to check if a user has access to a specific route
export function hasAccess(user: User | null, requiredRoles: UserRole[]): boolean {
  if (!user) return false
  return requiredRoles.includes(user.role)
}

// Mock function to get routes based on user role
export function getAuthorizedRoutes(role: UserRole) {
  const routes = [
    { name: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { name: "Donors", href: "/donors", icon: "User" },
  ]

  // Routes available to all authenticated users
  const userRoutes = [
    { name: "Appointments", href: "/appointments", icon: "Calendar" },
    { name: "Contact Us", href: "/contact", icon: "MessageSquare" },
  ]

  // Routes only available to admins
  const adminRoutes = [
    { name: "Donations", href: "/donations", icon: "Droplet" },
    { name: "Requests", href: "/requests", icon: "AlertCircle" },
    { name: "Users", href: "/users", icon: "Users" },
  ]

  return role === "admin" ? [...routes, ...adminRoutes, ...userRoutes] : [...routes, ...userRoutes]
}
