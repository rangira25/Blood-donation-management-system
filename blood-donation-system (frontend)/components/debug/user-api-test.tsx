"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usersAPI } from "@/lib/api"

export function UserApiTest() {
  const [searchQuery, setSearchQuery] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await usersAPI.searchUsers(searchQuery, 0, 5)
      setResult(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test User Search API</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Enter search query..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button onClick={testSearch} disabled={loading || !searchQuery.trim()}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 font-medium">Error:</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {result && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800 font-medium">Success!</p>
            <pre className="text-xs text-green-700 mt-2 overflow-auto">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
