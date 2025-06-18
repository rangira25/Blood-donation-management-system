"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAuthToken } from "@/lib/api"

export function DetailedApiTest() {
  const [endpoint, setEndpoint] = useState("api/users")
  const [method, setMethod] = useState("GET")
  const [requestBody, setRequestBody] = useState("")
  const [response, setResponse] = useState<{
    status?: number
    statusText?: string
    headers?: Record<string, string>
    body?: string
    error?: string
  }>({})
  const [loading, setLoading] = useState(false)

  const handleTest = async () => {
    setLoading(true)
    setResponse({})

    try {
      const token = getAuthToken()

      // Build request options
      const options: RequestInit = {
        method,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(method !== "GET" ? { "Content-Type": "application/json" } : {}),
        },
      }

      // Add body for non-GET requests if provided
      if (method !== "GET" && requestBody.trim()) {
        try {
          // Validate JSON
          JSON.parse(requestBody)
          options.body = requestBody
        } catch (e) {
          setResponse({ error: "Invalid JSON in request body" })
          setLoading(false)
          return
        }
      }

      // Make the request
      const url = `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`
      console.log(`Testing API: ${method} ${url}`, options)

      const res = await fetch(url, options)

      // Capture headers
      const headers: Record<string, string> = {}
      res.headers.forEach((value, key) => {
        headers[key] = value
      })

      // Get response body
      const responseText = await res.text()

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers,
        body: responseText,
      })
    } catch (error) {
      setResponse({
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle>Detailed API Test</CardTitle>
        <CardDescription>Test API endpoints with full request/response details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="endpoint">API Endpoint</Label>
          <Input
            id="endpoint"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="e.g., api/users"
          />
          <div className="text-xs text-muted-foreground">
            Full URL: {process.env.NEXT_PUBLIC_API_URL}/{endpoint}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="method">HTTP Method</Label>
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger>
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {method !== "GET" && (
          <div className="space-y-2">
            <Label htmlFor="requestBody">Request Body (JSON)</Label>
            <Textarea
              id="requestBody"
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              placeholder="{}"
              className="font-mono text-sm"
              rows={5}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label>Authentication</Label>
          <div className="p-2 bg-muted rounded-md text-xs overflow-auto max-h-20">
            {getAuthToken() ? "Token found" : "No authentication token"}
          </div>
        </div>

        <Button onClick={handleTest} disabled={loading} className="w-full">
          {loading ? "Testing..." : "Send Request"}
        </Button>

        {response.error && (
          <div className="space-y-2">
            <Label className="text-destructive">Error</Label>
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">{response.error}</div>
          </div>
        )}

        {response.status && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <div
                className={`p-2 rounded-md text-sm ${
                  response.status >= 200 && response.status < 300
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-800"
                }`}
              >
                {response.status} {response.statusText}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Response Headers</Label>
              <div className="p-2 bg-muted rounded-md text-xs font-mono overflow-auto max-h-40">
                {response.headers &&
                  Object.entries(response.headers).map(([key, value]) => (
                    <div key={key}>
                      <strong>{key}:</strong> {value}
                    </div>
                  ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Response Body</Label>
              <div className="p-2 bg-muted rounded-md text-xs font-mono overflow-auto max-h-60">
                <pre>{response.body}</pre>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
