"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ApiTest() {
  const [endpoint, setEndpoint] = useState("auth/login")
  const [method, setMethod] = useState("POST")
  const [body, setBody] = useState(JSON.stringify({ username: "admin", password: "password" }, null, 2))
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [apiBaseUrl, setApiBaseUrl] = useState(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080")

  const handleTest = async () => {
    setLoading(true)
    setError("")
    setResponse("")

    try {
      // Remove any leading slash from the endpoint to avoid double slashes
      const cleanEndpoint = endpoint.startsWith("/") ? endpoint.substring(1) : endpoint

      const url = `${apiBaseUrl}/${cleanEndpoint}`
      console.log(`Testing API: ${method} ${url}`)

      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      }

      if (method !== "GET" && body) {
        try {
          options.body = body
        } catch (e) {
          setError("Invalid JSON in body")
          setLoading(false)
          return
        }
      }

      const res = await fetch(url, options)
      const contentType = res.headers.get("content-type")

      if (contentType && contentType.includes("application/json")) {
        const json = await res.json()
        setResponse(JSON.stringify(json, null, 2))
      } else {
        const text = await res.text()
        setResponse(text)
      }

      if (!res.ok) {
        setError(`HTTP Error: ${res.status} ${res.statusText}`)
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>API Test Tool</CardTitle>
        <CardDescription>Test your API endpoints directly</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="warning" className="mb-4">
          <AlertDescription>
            <strong>Important:</strong> Your controllers are mapped to paths like <code>/auth</code>, not{" "}
            <code>/api/auth</code>. Make sure your API base URL doesn't include <code>/api</code> if your controllers
            don't include it.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="apiBaseUrl">API Base URL</Label>
          <Input
            id="apiBaseUrl"
            value={apiBaseUrl}
            onChange={(e) => setApiBaseUrl(e.target.value)}
            placeholder="e.g., http://localhost:8080"
          />
          <div className="text-xs text-muted-foreground">
            Current environment variable: {process.env.NEXT_PUBLIC_API_URL || "Not set"}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="endpoint">API Endpoint</Label>
          <Input
            id="endpoint"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="e.g., auth/login"
          />
          <div className="text-xs text-muted-foreground">
            Full URL will be: {apiBaseUrl}/{endpoint.startsWith("/") ? endpoint.substring(1) : endpoint}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="method">HTTP Method</Label>
          <select
            id="method"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>

        {method !== "GET" && (
          <div className="space-y-2">
            <Label htmlFor="body">Request Body (JSON)</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              className="font-mono text-sm"
            />
          </div>
        )}

        <Button onClick={handleTest} disabled={loading}>
          {loading ? "Testing..." : "Test API"}
        </Button>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800">
            <strong>Error:</strong> {error}
          </div>
        )}

        {response && (
          <div className="space-y-2">
            <Label>Response</Label>
            <pre className="p-3 bg-gray-50 border rounded overflow-auto max-h-80 font-mono text-sm">{response}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
