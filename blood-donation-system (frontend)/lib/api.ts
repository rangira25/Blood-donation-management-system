// API configuration matching your Spring Boot backend
// Note: We're removing the /api prefix since your controllers don't have it
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

// Auth token management
export const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken")
  }
  return null
}

export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token)
  }
}

export const removeAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userInfo")
  }
}

// API request wrapper with auth
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken()

  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  // Remove any leading slash from the endpoint to avoid double slashes
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.substring(1) : endpoint

  // Log the full URL for debugging
  console.log(`Making API request to: ${API_BASE_URL}/${cleanEndpoint}`)

  const response = await fetch(`${API_BASE_URL}/${cleanEndpoint}`, config)

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || `HTTP error! status: ${response.status}`)
  }

  // Handle empty responses
  const contentType = response.headers.get("content-type")
  if (contentType && contentType.includes("application/json")) {
    return response.json()
  }
  return response.text()
}

// Auth API calls - matching your AuthController exactly
export const authAPI = {
  register: async (userData: {
    username: string
    email: string
    password: string
    role: string
    age?: number
    contact?: string
    bloodType?: string
  }) => {
    return apiRequest("auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  },

  login: async (credentials: { username: string; password: string }) => {
    return apiRequest("auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  },

  verifyOTP: async (username: string, otp: string) => {
    return apiRequest(`auth/verify-otp?username=${username}&otp=${otp}`, {
      method: "POST",
    })
  },

  requestPasswordReset: async (email: string) => {
    return apiRequest(`auth/request-reset?email=${email}`, {
      method: "POST",
    })
  },

  resetPassword: async (data: { email: string; otp: string; newPassword: string }) => {
    return apiRequest("auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },
}

// Admin API calls - matching your AdminController
export const adminAPI = {
  getSummary: async () => {
    return apiRequest("api/admin/summary")
  },
}

// Appointments API calls - matching your AppointmentController
export const appointmentsAPI = {
  book: async (appointment: {
    appointmentDate: string
    appointmentTime: string
    location: string
    notes?: string
  }) => {
    return apiRequest("api/appointments/book", {
      method: "POST",
      body: JSON.stringify(appointment),
    })
  },

  getMyAppointments: async (page = 0, size = 10) => {
    return apiRequest(`api/appointments/my?page=${page}&size=${size}`)
  },

  getAllAppointments: async (page = 0, size = 10) => {
    return apiRequest(`api/appointments/all?page=${page}&size=${size}`)
  },
}

// Donors API calls - matching your DonorController
export const donorsAPI = {
  addDonor: async (donor: {
    username: string
    email: string
    age: number
    contact: string
    bloodType: string
    role: string
    password: string
  }) => {
    return apiRequest("api/donors", {
      method: "POST",
      body: JSON.stringify(donor),
    })
  },

  getAllDonors: async () => {
    return apiRequest("api/donors")
  },

  getDonorById: async (id: number) => {
    return apiRequest(`api/donors/${id}`)
  },

  updateDonor: async (id: number, donor: any) => {
    return apiRequest(`api/donors/${id}`, {
      method: "PUT",
      body: JSON.stringify(donor),
    })
  },

  deleteDonor: async (id: number) => {
    return apiRequest(`api/donors/${id}`, {
      method: "DELETE",
    })
  },
}

// Blood Donations API calls - matching your updated BloodDonationController
export const donationsAPI = {
  // Get all donations (Admin only)
  getAllDonations: async () => {
    return apiRequest("api/donations")
  },

  // Create donation
  donate: async (donation: {
    bloodType: string
    amount: number
    donationDate?: string
    location: string
    notes?: string
    isAvailable?: boolean
  }) => {
    return apiRequest("api/donations/donate", {
      method: "POST",
      body: JSON.stringify(donation),
    })
  },

  // Update donation (Admin only)
  updateDonation: async (id: number, donation: any) => {
    return apiRequest(`api/donations/${id}`, {
      method: "PUT",
      body: JSON.stringify(donation),
    })
  },

  // Delete donation (Admin only)
  deleteDonation: async (id: number) => {
    return apiRequest(`api/donations/${id}`, {
      method: "DELETE",
    })
  },

  // Get available donations
  getAvailableDonations: async () => {
    return apiRequest("api/donations/available")
  },

  // Get donations by blood type
  getDonationsByBloodType: async (bloodType: string) => {
    return apiRequest(`api/donations/blood-type/${bloodType}`)
  },

  // Get my donations
  getMyDonations: async () => {
    return apiRequest("api/donations/my-donations")
  },

  canUserDonate: async () => {
    return apiRequest("api/donations/can-donate")
  },
}

// Blood Requests API calls - matching your updated BloodRequestController
export const requestsAPI = {
  // Get all requests (Admin only)
  getAllRequests: async () => {
    return apiRequest("api/requests")
  },

  // Create request
  createRequest: async (request: {
    bloodType: string
    amount: number
    urgency: string
    requesterName: string
    hospitalName: string
    reason?: string
    neededByDate: string
  }) => {
    return apiRequest("api/requests/request", {
      method: "POST",
      body: JSON.stringify(request),
    })
  },

  // Update request (Admin only)
  updateRequest: async (id: number, request: any) => {
    return apiRequest(`api/requests/${id}`, {
      method: "PUT",
      body: JSON.stringify(request),
    })
  },

  // Delete request (Admin only)
  deleteRequest: async (id: number) => {
    return apiRequest(`api/requests/${id}`, {
      method: "DELETE",
    })
  },

  // Fulfill request (Admin only)
  fulfillRequest: async (id: number) => {
    return apiRequest(`api/requests/${id}/fulfill`, {
      method: "PUT",
    })
  },

  // Get requests by blood type
  getRequestsByBloodType: async (bloodType: string) => {
    return apiRequest(`api/requests/blood-type/${bloodType}`)
  },

  // Get pending requests
  getPendingRequests: async () => {
    return apiRequest("api/requests/pending")
  },

  // Get urgent requests
  getUrgentRequests: async () => {
    return apiRequest("api/requests/urgent")
  },

  // Get my requests
  getMyRequests: async () => {
    return apiRequest("api/requests/my-requests")
  },
}

// Users API calls - matching your updated UserController
export const usersAPI = {
  searchUsers: async (query: string, page = 0, size = 10) => {
    return apiRequest(`api/users/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`)
  },

  getAllUsers: async () => {
    return apiRequest("api/users")
  },

  getUserById: async (id: number) => {
    return apiRequest(`api/users/${id}`)
  },

  updateUser: async (id: number, user: any) => {
    return apiRequest(`api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(user),
    })
  },

  deleteUser: async (id: number) => {
    return apiRequest(`api/users/${id}`, {
      method: "DELETE",
    })
  },

  register: async (user: any) => {
    return apiRequest("api/users/register", {
      method: "POST",
      body: JSON.stringify(user),
    })
  },

  login: async (user: { username: string; password: string }) => {
    return apiRequest("api/users/login", {
      method: "POST",
      body: JSON.stringify(user),
    })
  },
}

// Email API calls - matching your EmailController
export const emailAPI = {
  sendEmail: async (emailData: {
    to: string
    subject: string
    text: string
  }) => {
    return apiRequest("api/email/send", {
      method: "POST",
      body: JSON.stringify(emailData),
    })
  },
}
