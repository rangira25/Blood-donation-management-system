// Types matching your Spring Boot backend models

export interface User {
  id: number
  username: string
  email: string
  password?: string
  role: "USER" | "DONOR" | "ADMIN"
  age?: number | null // Changed to be nullable
  contact?: string
  bloodType?: string
  otp?: string
  otpExpiry?: string
  status?: string
}

export interface Appointment {
  id: number
  appointmentDate: string
  appointmentTime: string
  location: string
  notes?: string
  status?: "Pending" | "Confirmed" | "Completed" | "Cancelled"
  user?: User
}

export interface BloodDonation {
  id: number
  bloodType: string
  amount: number
  donationDate: string
  location: string
  notes?: string
  isAvailable: boolean
  donor?: User
}

export interface BloodRequest {
  id: number
  bloodType: string
  amount: number
  urgency: string
  requesterName: string
  hospitalName: string
  reason?: string
  neededByDate: string
  status?: "Pending" | "Fulfilled" | "Cancelled"
}

// DTOs matching your backend
export interface RegisterRequest {
  username: string
  email: string
  password: string
  role: string
  age?: number
  contact?: string
  bloodType?: string
}

export interface AuthRequest {
  username: string
  password: string
}

export interface JwtResponse {
  token: string
  username: string
  role: string
}

export interface ResetPasswordRequest {
  email: string
  otp: string
  newPassword: string
}

export interface EmailRequest {
  to: string
  subject: string
  text: string
}

export interface SummaryResponse {
  totalUsers: number
  totalAppointments: number
  pendingAppointments: number
  confirmedAppointments: number
  completedAppointments: number
  cancelledAppointments: number
}

// Paginated response type
export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}
