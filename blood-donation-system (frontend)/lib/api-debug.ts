// Debug utility to help identify connection issues
export const debugAPI = {
  // Test basic connectivity
  testConnection: async () => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
    console.log("🔍 Testing API connection...")
    console.log("📍 API Base URL:", API_BASE_URL)

    try {
      // Test basic fetch to see if server is reachable
      const response = await fetch(API_BASE_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("✅ Server Response Status:", response.status)
      console.log("✅ Server Response Headers:", Object.fromEntries(response.headers.entries()))

      if (response.ok) {
        const data = await response.text()
        console.log("✅ Server Response Body:", data)
      } else {
        console.log("❌ Server Error Response:", await response.text())
      }

      return response
    } catch (error) {
      console.error("❌ Connection Error:", error)
      throw error
    }
  },

  // Test specific endpoints
  testEndpoint: async (endpoint: string, method = "GET", body?: any) => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
    const fullUrl = `${API_BASE_URL}${endpoint}`

    console.log(`🔍 Testing ${method} ${fullUrl}`)

    try {
      const config: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      }

      if (body && method !== "GET") {
        config.body = JSON.stringify(body)
        console.log("📤 Request Body:", body)
      }

      const response = await fetch(fullUrl, config)

      console.log("📥 Response Status:", response.status)
      console.log("📥 Response Headers:", Object.fromEntries(response.headers.entries()))

      const responseText = await response.text()
      console.log("📥 Response Body:", responseText)

      return {
        status: response.status,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseText,
      }
    } catch (error) {
      console.error("❌ Endpoint Test Error:", error)
      throw error
    }
  },

  // Check environment variables
  checkEnvironment: () => {
    console.log("🔍 Environment Check:")
    console.log("📍 NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL)
    console.log("📍 NODE_ENV:", process.env.NODE_ENV)
    console.log("📍 Current Origin:", typeof window !== "undefined" ? window.location.origin : "Server Side")
  },
}
