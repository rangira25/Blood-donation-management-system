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
import { Plus, ChevronLeft, ChevronRight, Shield } from "lucide-react"
import { appointmentsAPI } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import type { Appointment, PageResponse } from "@/lib/types"

// Mock locations - you can move this to your backend later
const locations = ["City Blood Bank", "Memorial Clinic", "Community Center", "General Hospital", "Mobile Blood Drive"]

export default function AppointmentsPage() {
  const { toast } = useToast()
  const { isAdmin } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const pageSize = 10

  const [newAppointment, setNewAppointment] = useState({
    appointmentDate: "",
    appointmentTime: "",
    location: "",
    notes: "",
  })

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments()
  }, [currentPage, isAdmin])

  const fetchAppointments = async () => {
    try {
      setIsLoading(true)
      let response: PageResponse<Appointment>

      if (isAdmin) {
        // Admin can see all appointments
        response = await appointmentsAPI.getAllAppointments(currentPage, pageSize)
      } else {
        // Regular users see only their appointments
        response = await appointmentsAPI.getMyAppointments(currentPage, pageSize)
      }

      setAppointments(response.content)
      setTotalPages(response.totalPages)
      setTotalElements(response.totalElements)
    } catch (error) {
      console.error("Error fetching appointments:", error)
      toast({
        title: "Error",
        description: "Failed to fetch appointments",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewAppointment((prev) => ({ ...prev, [name]: value }))
  }

  const handleLocationChange = (value: string) => {
    setNewAppointment((prev) => ({ ...prev, location: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await appointmentsAPI.book(newAppointment)

      toast({
        title: "Success",
        description: "Appointment booked successfully!",
      })

      // Reset form and close dialog
      setNewAppointment({
        appointmentDate: "",
        appointmentTime: "",
        location: "",
        notes: "",
      })
      setOpen(false)

      // Refresh appointments list
      await fetchAppointments()
    } catch (error) {
      console.error("Error booking appointment:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to book appointment",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "secondary"
      case "confirmed":
        return "default"
      case "completed":
        return "success"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatTime = (timeString: string) => {
    return timeString || "Not specified"
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Appointments</h2>
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
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold tracking-tight">{isAdmin ? "All Appointments" : "My Appointments"}</h2>
          {isAdmin && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Admin View
            </Badge>
          )}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Book Appointment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Book New Appointment</DialogTitle>
              <DialogDescription>Fill in the details to schedule a blood donation appointment.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="appointmentDate">Date</Label>
                  <Input
                    id="appointmentDate"
                    name="appointmentDate"
                    type="date"
                    value={newAppointment.appointmentDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="appointmentTime">Time</Label>
                  <Input
                    id="appointmentTime"
                    name="appointmentTime"
                    type="time"
                    value={newAppointment.appointmentTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Select onValueChange={handleLocationChange} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={newAppointment.notes}
                    onChange={handleInputChange}
                    placeholder="Any special requirements or information"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Booking..." : "Book Appointment"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Appointment Management
            {isAdmin && (
              <Badge variant="outline" className="text-red-600 border-red-200">
                Full Access
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {isAdmin
              ? "View and manage all blood donation appointments in the system."
              : "View and manage your blood donation appointments."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {isAdmin && <TableHead>User</TableHead>}
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      {isAdmin && (
                        <TableCell className="font-medium">{appointment.user?.username || "Unknown User"}</TableCell>
                      )}
                      <TableCell>{formatDate(appointment.appointmentDate)}</TableCell>
                      <TableCell>{formatTime(appointment.appointmentTime)}</TableCell>
                      <TableCell>{appointment.location}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(appointment.status || "pending") as any}>
                          {(appointment.status || "Pending").charAt(0).toUpperCase() +
                            (appointment.status || "pending").slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{appointment.notes || "No notes"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 6 : 5} className="h-24 text-center">
                      No appointments found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of{" "}
                {totalElements} appointments
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="text-sm">
                  Page {currentPage + 1} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
