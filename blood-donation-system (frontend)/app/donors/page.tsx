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
import { Plus, Search, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { donorsAPI } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import type { User } from "@/lib/types"

export default function DonorsPage() {
  const { toast } = useToast()
  const [donors, setDonors] = useState<User[]>([])
  const [filteredDonors, setFilteredDonors] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [open, setOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentDonor, setCurrentDonor] = useState({
    id: 0,
    username: "",
    email: "",
    age: "",
    contact: "",
    bloodType: "",
    password: "",
  })

  // Fetch donors on component mount
  useEffect(() => {
    fetchDonors()
  }, [])

  // Filter donors based on search term
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredDonors(donors)
    } else {
      const filtered = donors.filter(
        (donor) =>
          donor.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (donor.bloodType && donor.bloodType.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredDonors(filtered)
    }
  }, [searchTerm, donors])

  const fetchDonors = async () => {
    try {
      setIsLoading(true)
      const data = await donorsAPI.getAllDonors()
      setDonors(data)
      setFilteredDonors(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch donors",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCurrentDonor((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setCurrentDonor((prev) => ({ ...prev, bloodType: value }))
  }

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open) {
      setIsEditing(false)
      setCurrentDonor({
        id: 0,
        username: "",
        email: "",
        age: "",
        contact: "",
        bloodType: "",
        password: "",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const donorData = {
        username: currentDonor.username,
        email: currentDonor.email,
        age: Number.parseInt(currentDonor.age),
        contact: currentDonor.contact,
        bloodType: currentDonor.bloodType,
        role: "DONOR",
        password: currentDonor.password || "defaultPassword123", // You might want to generate a random password
      }

      if (isEditing) {
        await donorsAPI.updateDonor(currentDonor.id, donorData)
        toast({
          title: "Success",
          description: "Donor updated successfully",
        })
      } else {
        await donorsAPI.addDonor(donorData)
        toast({
          title: "Success",
          description: "Donor added successfully",
        })
      }

      await fetchDonors()
      setOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save donor",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (donor: User) => {
    setIsEditing(true)
    setCurrentDonor({
      id: donor.id,
      username: donor.username,
      email: donor.email,
      age: donor.age?.toString() || "",
      contact: donor.contact || "",
      bloodType: donor.bloodType || "",
      password: "",
    })
    setOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await donorsAPI.deleteDonor(id)
      toast({
        title: "Success",
        description: "Donor deleted successfully",
      })
      await fetchDonors()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete donor",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Donors</h2>
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
        <h2 className="text-3xl font-bold tracking-tight">Donors</h2>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Donor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Donor" : "Add New Donor"}</DialogTitle>
              <DialogDescription>
                {isEditing ? "Update donor information." : "Fill in the details to add a new blood donor."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={currentDonor.username}
                    onChange={handleInputChange}
                    placeholder="Enter username"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={currentDonor.email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                    required
                  />
                </div>
                {!isEditing && (
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={currentDonor.password}
                      onChange={handleInputChange}
                      placeholder="Enter password"
                      required
                    />
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="bloodType">Blood Type</Label>
                  <Select onValueChange={handleSelectChange} value={currentDonor.bloodType} required>
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
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    value={currentDonor.age}
                    onChange={handleInputChange}
                    placeholder="Enter age"
                    min="18"
                    max="65"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contact">Contact Number</Label>
                  <Input
                    id="contact"
                    name="contact"
                    value={currentDonor.contact}
                    onChange={handleInputChange}
                    placeholder="Enter contact number"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{isEditing ? "Update" : "Add"} Donor</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Donor Management</CardTitle>
          <CardDescription>View and manage all blood donors in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name, email, or blood type..."
                className="pl-8"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Blood Type</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDonors.length > 0 ? (
                  filteredDonors.map((donor) => (
                    <TableRow key={donor.id}>
                      <TableCell className="font-medium">{donor.username}</TableCell>
                      <TableCell>{donor.email}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                          {donor.bloodType || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>{donor.age || "N/A"}</TableCell>
                      <TableCell>{donor.contact || "N/A"}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(donor)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(donor.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No donors found.
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
