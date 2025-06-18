"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { getAuthToken, setAuthToken, removeAuthToken } from "@/lib/api"

export default function AuthTest() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [currentToken, setCurrentToken] = useState(getAuthToken() || "No token found")

  const handleLogin = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()
      setResult({ success: response.ok, data })

      if (response.ok && data.token) {
        setAuthToken(data.token)
        setCurrentToken(data.token)
      }
    } catch (error) {
      setResult({ success: false, error: String(error) })
    } finally {
      setLoading(false)
    }
  }

  const handleTestAuth = async () => {
    setLoading(true)
    setResult(null)

    try {
      const token = getAuthToken()

      if (!token) {
        setResult({ success: false, error: "No auth token found" })
        setLoading(false)
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.text()
      setResult({
        success: response.ok,
        status: response.status,
        data: data ? JSON.parse(data) : "No data returned",
      })
    } catch (error) {
      setResult({ success: false, error: String(error) })
    } finally {
      setLoading(false)
    }
  }

  const handleClearToken = () => {
    removeAuthToken()
    setCurrentToken("Token removed")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Authentication Test</CardTitle>
        <CardDescription>Test your authentication flow</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current-token">Current Token</Label>
          <div className="p-2 bg-muted rounded-md overflow-auto max-h-20 text-xs">{currentToken}</div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleLogin} disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </Button>
          <Button onClick={handleTestAuth} disabled={loading} variant="outline">
            Test Auth
          </Button>
          <Button onClick={handleClearToken} disabled={loading} variant="destructive">
            Clear Token
          </Button>
        </div>

        {result && (
          <div className="mt-4">
            <Label>Result</Label>
            <div
              className={`p-2 rounded-md overflow-auto max-h-60 text-xs ${result.success ? "bg-green-100" : "bg-red-100"}`}
            >
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
