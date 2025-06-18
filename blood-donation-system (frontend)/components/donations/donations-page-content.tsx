"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Plus, MoreHorizontal, Pencil, Trash2, RefreshCw } from "lucide-react"
import { donationsAPI } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"

// Type for blood donation matching your backend model
interface BloodDonation {
  id: number
  bloodType: string
  amount: number
  donationDate: string
  location: string
  notes?: string
  Available: boolean
  donor?: {
    id: number
    username: string
    email: string
  }
}

export default function DonationsPageContent() {
  const { toast } = useToast()
  const { isAdmin } = useAuth()
  const [donations, setDonations] = useState<BloodDonation[]>([])
  const [open, setOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentDonation, setCurrentDonation] = useState({
    id: 0,
    bloodType: "",
    amount: "",
    location: "",
    notes: "",
    donationDate: new Date().toISOString().split("T")[0],
    isAvailable: true,
  })

  // Fetch donations on component mount
  useEffect(() => {
    fetchDonations()
  }, [isAdmin])

  const fetchDonations = async () => {
    try {
      setIsLoading(true)
      let data: BloodDonation[]

      if (isAdmin) {
        // Admin can see all donations
        data = await donationsAPI.getAllDonations()
      } else {
        // Regular users see only available donations
        data = await donationsAPI.getAvailableDonations()
      }

      setDonations(data)
    } catch (error) {
      console.error("Error fetching donations:", error)
      toast({
        title: "Error",
        description: "Failed to fetch donations",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open) {
      setIsEditing(false)
      setCurrentDonation({
        id: 0,
        bloodType: "",
        amount: "",
        location: "",
        notes: "",
        donationDate: new Date().toISOString().split("T")[0],
        isAvailable: true,
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCurrentDonation((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setCurrentDonation((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const donationData = {
        bloodType: currentDonation.bloodType,
        amount: Number.parseInt(currentDonation.amount),
        location: currentDonation.location,
        notes: currentDonation.notes,
        donationDate: currentDonation.donationDate,
        isAvailable: currentDonation.isAvailable,
      }

      if (isEditing) {
        await donationsAPI.updateDonation(currentDonation.id, donationData)
        toast({
          title: "Success",
          description: "Donation updated successfully",
        })
      } else {
        await donationsAPI.donate(donationData)
        toast({
          title: "Success",
          description: "Donation recorded successfully",
        })
      }

      await fetchDonations()
      setOpen(false)
    } catch (error) {
      console.error("Error saving donation:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save donation",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (donation: BloodDonation) => {
    setIsEditing(true)
    setCurrentDonation({
      id: donation.id,
      bloodType: donation.bloodType,
      amount: donation.amount.toString(),
      location: donation.location,
      notes: donation.notes || "",
      donationDate: donation.donationDate,
      isAvailable: donation.Available,
    })
    setOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await donationsAPI.deleteDonation(id)
      toast({
        title: "Success",
        description: "Donation deleted successfully",
      })
      await fetchDonations()
    } catch (error) {
      console.error("Error deleting donation:", error)
      toast({
        title: "Error",
        description: "Failed to delete donation",
        variant: "destructive",
      })
    }
  }

  const handleMarkAsUsed = async (id: number) => {
    try {
      await donationsAPI.updateDonation(id, { isAvailable: false })
      toast({
        title: "Success",
        description: "Donation marked as used",
      })
      await fetchDonations()
    } catch (error) {
      console.error("Error marking donation as used:", error)
      toast({
        title: "Error",
        description: "Failed to mark donation as used",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Donations</h2>
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
        <h2 className="text-3xl font-bold tracking-tight">Donations</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={fetchDonations} title="Refresh donations">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {isAdmin ? "Add Donation" : "Donate Blood"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{isEditing ? "Edit Donation" : "Record Blood Donation"}</DialogTitle>
                <DialogDescription>
                  {isEditing ? "Update the donation details." : "Fill in the details to record a new blood donation."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="bloodType">Blood Type</Label>
                    <Select
                      value={currentDonation.bloodType}
                      onValueChange={(value) => handleSelectChange("bloodType", value)}
                      required
                    >
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
                    <Select
                      value={currentDonation.amount}
                      onValueChange={(value) => handleSelectChange("amount", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select amount" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 unit</SelectItem>
                        <SelectItem value="2">2 units</SelectItem>
                        <SelectItem value="3">3 units</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={currentDonation.location}
                      onChange={handleInputChange}
                      placeholder="Enter donation location"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="donationDate">Donation Date</Label>
                    <Input
                      id="donationDate"
                      name="donationDate"
                      type="date"
                      value={currentDonation.donationDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Input
                      id="notes"
                      name="notes"
                      value={currentDonation.notes}
                      onChange={handleInputChange}
                      placeholder="Any additional notes"
                    />
                  </div>
                  {isAdmin && isEditing && (
                    <div className="grid gap-2">
                      <Label htmlFor="isAvailable">Availability</Label>
                      <Select
                        value={currentDonation.isAvailable.toString()}
                        onValueChange={(value) => handleSelectChange("isAvailable", value === "true")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Available</SelectItem>
                          <SelectItem value="false">Used</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : isEditing ? "Update" : "Record"} Donation
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Donation Management</CardTitle>
          <CardDescription>
            {isAdmin ? "View and manage all blood donations in the system." : "View available blood donations."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Blood Type</TableHead>
                  <TableHead>Amount (units)</TableHead>
                  {isAdmin && <TableHead>Donor</TableHead>}
                  <TableHead>Location</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations.length > 0 ? (
                  donations.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                          {donation.bloodType}
                        </span>
                      </TableCell>
                      <TableCell>{donation.amount}</TableCell>
                      {isAdmin && (
                        <TableCell className="font-medium">{donation.donor?.username || "Unknown"}</TableCell>
                      )}
                      <TableCell>{donation.location}</TableCell>
                      <TableCell>{formatDate(donation.donationDate)}</TableCell>
                      <TableCell>
                        <Badge variant={donation.Available ? "default" : "secondary"}>
                          {donation.Available ? "Available" : "Used"}
                        </Badge>
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
                              <DropdownMenuItem onClick={() => handleEdit(donation)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              {donation.Available && (
                                <DropdownMenuItem onClick={() => handleMarkAsUsed(donation.id)}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Mark as Used
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleDelete(donation.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
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
                    <TableCell colSpan={isAdmin ? 7 : 6} className="h-24 text-center">
                      No donations found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
