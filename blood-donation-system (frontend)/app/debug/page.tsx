import { ApiTest } from "./api-test"
import { DetailedApiTest } from "./detailed-api-test"
import AuthTest from "./auth-test"

export default function DebugPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">API Debug Tools</h1>
      <div className="space-y-8">
        <AuthTest />
        <DetailedApiTest />
        <ApiTest />
      </div>
    </div>
  )
}
