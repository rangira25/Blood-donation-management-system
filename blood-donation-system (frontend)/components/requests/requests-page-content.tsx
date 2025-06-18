"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Check, X, MoreHorizontal, RefreshCw } from "lucide-react"
import { requestsAPI } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"

// Type for blood request matching your backend model
interface BloodRequest {
  id: number
  bloodType: string
  amount: number
  urgency: string
  requesterName: string
  hospitalName: string
  reason?: string
  neededByDate: string
  requestDate: string
  status: string
  requester?: {
    id: number
    username: string
    email: string
  }
}

export default function RequestsPageContent() {
  const { toast } = useToast()
  const { isAdmin } = useAuth()
  const [requests, setRequests] = useState<BloodRequest[]>([])
  const [open, setOpen] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null)
  const [actionType, setActionType] = useState<"fulfill" | "cancel" | "delete">("fulfill")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newRequest, setNewRequest] = useState({
    bloodType: "",
    amount: "",
    urgency: "Medium",
    requesterName: "",
    hospitalName: "",
    reason: "",
    neededByDate: "",
  })

  // Fetch requests on component mount
  useEffect(() => {
    fetchRequests()
  }, [isAdmin])

  const fetchRequests = async () => {
    try {
      setIsLoading(true)
      let data: BloodRequest[]

      if (isAdmin) {
        // Admin can see all requests
        data = await requestsAPI.getAllRequests()
      } else {
        // Regular users see only their requests
        data = await requestsAPI.getMyRequests()
      }

      setRequests(data)
    } catch (error) {
      console.error("Error fetching requests:", error)
      toast({
        title: "Error",
        description: "Failed to fetch requests",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewRequest((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setNewRequest((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const requestData = {
        bloodType: newRequest.bloodType,
        amount: Number.parseInt(newRequest.amount),
        urgency: newRequest.urgency,
        requesterName: newRequest.requesterName,
        hospitalName: newRequest.hospitalName,
        reason: newRequest.reason,
        neededByDate: newRequest.neededByDate,
      }

      await requestsAPI.createRequest(requestData)

      toast({
        title: "Success",
        description: "Blood request created successfully",
      })

      setNewRequest({
        bloodType: "",
        amount: "",
        urgency: "Medium",
        requesterName: "",
        hospitalName: "",
        reason: "",
        neededByDate: "",
      })
      setOpen(false)
      await fetchRequests()
    } catch (error) {
      console.error("Error creating request:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create request",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAction = (id: number, action: "fulfill" | "cancel" | "delete") => {
    setSelectedRequestId(id)
    setActionType(action)
    setAlertOpen(true)
  }

  const confirmAction = async () => {
    if (selectedRequestId === null) return

    try {
      switch (actionType) {
        case "fulfill":
          await requestsAPI.fulfillRequest(selectedRequestId)
          toast({
            title: "Success",
            description: "Request fulfilled successfully",
          })
          break
        case "cancel":
          // Note: You'll need to add this endpoint to your backend
          await requestsAPI.deleteRequest(selectedRequestId) // Using delete for now
          toast({
            title: "Success",
            description: "Request cancelled successfully",
          })
          break
        case "delete":
          await requestsAPI.deleteRequest(selectedRequestId)
          toast({
            title: "Success",
            description: "Request deleted successfully",
          })
          break
      }

      await fetchRequests()
    } catch (error) {
      console.error(`Error ${actionType}ing request:`, error)
      toast({
        title: "Error",
        description: `Failed to ${actionType} request`,
        variant: "destructive",
      })
    } finally {
      setAlertOpen(false)
      setSelectedRequestId(null)
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency?.toLowerCase()) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "secondary"
      case "fulfilled":
        return "default"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Blood Requests</h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{isAdmin ? "All Blood Requests" : "My Blood Requests"}</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={fetchRequests} title="Refresh requests">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-screen overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Blood Request</DialogTitle>
                <DialogDescription>Fill in the details to create a new blood request.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="requesterName">Requester Name</Label>
                    <Input
                      id="requesterName"
                      name="requesterName"
                      value={newRequest.requesterName}
                      onChange={handleInputChange}
                      placeholder="Enter requester name"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="hospitalName">Hospital Name</Label>
                    <Input
                      id="hospitalName"
                      name="hospitalName"
                      value={newRequest.hospitalName}
                      onChange={handleInputChange}
                      placeholder="Enter hospital name"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="bloodType">Blood Type</Label>
                    <Select onValueChange={(value) => handleSelectChange("bloodType", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount (units)</Label>
                    <Select onValueChange={(value) => handleSelectChange("amount", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select amount" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 unit</SelectItem>
                        <SelectItem value="2">2 units</SelectItem>
                        <SelectItem value="3">3 units</SelectItem>
                        <SelectItem value="4">4 units</SelectItem>
                        <SelectItem value="5">5 units</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="urgency">Urgency</Label>
                    <Select value={newRequest.urgency} onValueChange={(value) => handleSelectChange("urgency", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="neededByDate">Needed By Date</Label>
                    <Input
                      id="neededByDate"
                      name="neededByDate"
                      type="date"
                      value={newRequest.neededByDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reason">Reason (Optional)</Label>
                    <Textarea
                      id="reason"
                      name="reason"
                      value={newRequest.reason}
                      onChange={handleInputChange}
                      placeholder="Reason for blood request"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Request"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Blood Request Management</CardTitle>
          <CardDescription>
            {isAdmin ? "View and manage all blood requests in the system." : "View and manage your blood requests."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Blood Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Requester</TableHead>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Needed By</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Status</TableHead>
                  {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.length > 0 ? (
                  requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                          {request.bloodType}
                        </span>
                      </TableCell>
                      <TableCell>{request.amount} units</TableCell>
                      <TableCell className="font-medium">{request.requesterName}</TableCell>
                      <TableCell>{request.hospitalName}</TableCell>
                      <TableCell>{formatDate(request.neededByDate)}</TableCell>
                      <TableCell>
                        <Badge variant={getUrgencyColor(request.urgency) as any}>{request.urgency}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(request.status) as any}>{request.status}</Badge>
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {request.status === "Pending" && (
                                <DropdownMenuItem onClick={() => handleAction(request.id, "fulfill")}>
                                  <Check className="mr-2 h-4 w-4" />
                                  Fulfill
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleAction(request.id, "delete")}>
                                <X className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 8 : 7} className="h-24 text-center">
                      No requests found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Action Confirmation Dialog */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "fulfill" && "Fulfill Blood Request"}
              {actionType === "cancel" && "Cancel Blood Request"}
              {actionType === "delete" && "Delete Blood Request"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "fulfill" &&
                "Are you sure you want to mark this request as fulfilled? This action cannot be undone."}
              {actionType === "cancel" && "Are you sure you want to cancel this request? This action cannot be undone."}
              {actionType === "delete" && "Are you sure you want to delete this request? This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>
              {actionType === "fulfill" && "Fulfill"}
              {actionType === "cancel" && "Cancel Request"}
              {actionType === "delete" && "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
