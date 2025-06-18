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
import { Plus, MoreHorizontal, Pencil, Trash2, UserCheck, UserX, Search, RefreshCw, AlertCircle } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
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
import { useToast } from "@/components/ui/use-toast"
import { getAuthToken } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"

// Define User type based on your backend model
interface User {
  id: number
  username: string
  email: string
  role: string
  age?: number | null
  contact?: string
  bloodType?: string
  status?: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentUser, setCurrentUser] = useState<User>({
    id: 0,
    username: "",
    email: "",
    role: "USER",
    status: "active",
  })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true)
    try {
      // Get the auth token
      const token = getAuthToken()

      if (!token) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to view users",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Make authenticated request
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Get the response text first to see what's coming back
      const responseText = await response.text()
      console.log("Raw API response:", responseText)

      if (!response.ok) {
        // Try to parse as JSON if possible
        let errorDetail = responseText
        try {
          const errorJson = JSON.parse(responseText)
          errorDetail = errorJson.message || errorJson.error || JSON.stringify(errorJson)
        } catch (e) {
          // If not JSON, use the text as is
        }

        throw new Error(`API error (${response.status}): ${errorDetail}`)
      }

      // Parse the response as JSON if it's not empty
      let data = []
      if (responseText) {
        try {
          data = JSON.parse(responseText)
        } catch (e) {
          console.error("Error parsing JSON response:", e)
          throw new Error("Invalid JSON response from server")
        }
      }

      console.log("Fetched users:", data)
      setUsers(Array.isArray(data) ? data : [])
      setFilteredUsers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load users. Check console for details.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers()
    }
  }, [refreshTrigger, toast, isAuthenticated])

  // Filter users based on search term and active tab
  useEffect(() => {
    let result = [...users]

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply tab filter
    if (activeTab !== "all") {
      result = result.filter((user) => user.role?.toLowerCase() === activeTab.toLowerCase())
    }

    setFilteredUsers(result)
  }, [searchTerm, users, activeTab])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Special handling for numeric fields
    if (name === "age") {
      setCurrentUser((prev) => ({
        ...prev,
        [name]: value === "" ? null : Number(value),
      }))
    } else {
      setCurrentUser((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSelectChange = (field: string, value: string) => {
    setCurrentUser((prev) => ({ ...prev, [field]: value }))
  }

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open) {
      setIsEditing(false)
      setCurrentUser({
        id: 0,
        username: "",
        email: "",
        role: "USER",
        status: "active",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const token = getAuthToken()

      if (!token) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to perform this action",
          variant: "destructive",
        })
        return
      }

      if (isEditing) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${currentUser.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(currentUser),
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        toast({
          title: "Success",
          description: "User updated successfully",
        })
      } else {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(currentUser),
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        toast({
          title: "Success",
          description: "User created successfully",
        })
      }

      setRefreshTrigger((prev) => prev + 1)
      setOpen(false)
    } catch (error) {
      console.error("Error saving user:", error)
      toast({
        title: "Error",
        description: isEditing ? "Failed to update user" : "Failed to create user",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (user: User) => {
    setIsEditing(true)
    setCurrentUser({
      ...user,
    })
    setOpen(true)
  }

  const handleDelete = async () => {
    if (userToDelete === null) return

    try {
      const token = getAuthToken()

      if (!token) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to perform this action",
          variant: "destructive",
        })
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      toast({
        title: "Success",
        description: "User deleted successfully",
      })
      setRefreshTrigger((prev) => prev + 1)
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }

  const confirmDelete = (id: number) => {
    setUserToDelete(id)
    setDeleteDialogOpen(true)
  }

  const toggleUserStatus = async (user: User) => {
    try {
      const token = getAuthToken()

      if (!token) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to perform this action",
          variant: "destructive",
        })
        return
      }

      const updatedUser = {
        ...user,
        status: user.status === "active" ? "inactive" : "active",
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      toast({
        title: "Success",
        description: `User ${updatedUser.status === "active" ? "activated" : "deactivated"} successfully`,
      })
      setRefreshTrigger((prev) => prev + 1)
    } catch (error) {
      console.error("Error updating user status:", error)
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      })
    }
  }

  const refreshUsers = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role?.toUpperCase()) {
      case "ADMIN":
        return "destructive"
      case "DONOR":
        return "default"
      case "USER":
        return "secondary"
      default:
        return "outline"
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>You must be logged in to view this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => (window.location.href = "/")} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit User" : "Add New User"}</DialogTitle>
              <DialogDescription>
                {isEditing ? "Update user details." : "Fill in the details to add a new user."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={currentUser.username}
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
                    value={currentUser.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
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
                      onChange={handleInputChange}
                      placeholder="Enter password"
                      required={!isEditing}
                    />
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={currentUser.role}
                    onValueChange={(value) => handleSelectChange("role", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="DONOR">Donor</SelectItem>
                      <SelectItem value="USER">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {currentUser.role === "DONOR" && (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        value={currentUser.age === null || currentUser.age === undefined ? "" : currentUser.age}
                        onChange={(e) => {
                          const value = e.target.value
                          setCurrentUser((prev) => ({
                            ...prev,
                            age: value === "" ? null : Number(value),
                          }))
                        }}
                        placeholder="Enter age"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="contact">Contact</Label>
                      <Input
                        id="contact"
                        name="contact"
                        value={currentUser.contact || ""}
                        onChange={handleInputChange}
                        placeholder="Enter contact number"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="bloodType">Blood Type</Label>
                      <Select
                        value={currentUser.bloodType || ""}
                        onValueChange={(value) => handleSelectChange("bloodType", value)}
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
                  </>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={currentUser.status}
                    onValueChange={(value) => handleSelectChange("status", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{isEditing ? "Update" : "Add"} User</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>View and manage all users in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name, email, or role..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-8"
              />
            </div>
            <div className="flex items-center gap-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="admin">Admins</TabsTrigger>
                  <TabsTrigger value="donor">Donors</TabsTrigger>
                  <TabsTrigger value="user">Users</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="outline" size="icon" onClick={refreshUsers} title="Refresh users">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Blood Type</TableHead>
                  <TableHead className="hidden md:table-cell">Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      <TableCell>
                        <Skeleton className="h-5 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-16" />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Skeleton className="h-5 w-10" />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Skeleton className="h-5 w-24" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-8 w-8 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>{user.role?.toUpperCase()}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.status === "active" ? "default" : "secondary"}
                          className={user.status === "active" ? "bg-green-500" : ""}
                        >
                          {user.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{user.bloodType || "-"}</TableCell>
                      <TableCell className="hidden md:table-cell">{user.contact || "-"}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(user)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleUserStatus(user)}>
                              {user.status === "active" ? (
                                <>
                                  <UserX className="mr-2 h-4 w-4" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => confirmDelete(user.id)}>
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
                    <TableCell colSpan={7} className="h-24 text-center">
                      {searchTerm ? (
                        <div className="flex flex-col items-center justify-center">
                          <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                          <p>No users found matching your search.</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                          <p>No users found. Add some users to get started.</p>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user and remove their data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
