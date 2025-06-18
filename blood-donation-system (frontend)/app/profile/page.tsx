"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

export default function ProfilePage() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    bloodType: "A+",
    address: "123 Main St, Anytown, USA",
    emergencyContact: "Jane Doe - +1 (555) 987-6543",
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
    privacy: {
      showDonationHistory: true,
      allowContactByOrganizations: false,
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSwitchChange = (category: "notifications" | "privacy", field: string, checked: boolean) => {
    setProfileData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: checked,
      },
    }))
  }

  const handleSaveProfile = () => {
    setIsEditing(false)
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    })
  }

  // Mock donation history
  const donationHistory = [
    { id: 1, date: "2023-05-15", location: "City Blood Bank", amount: "1 pint", bloodType: "A+" },
    { id: 2, date: "2023-02-10", location: "Memorial Clinic", amount: "1 pint", bloodType: "A+" },
    { id: 3, date: "2022-11-05", location: "Community Center", amount: "1 pint", bloodType: "A+" },
    { id: 4, date: "2022-08-20", location: "Mobile Blood Drive", amount: "1 pint", bloodType: "A+" },
  ]

  // Mock upcoming appointments
  const upcomingAppointments = [
    {
      id: 1,
      date: "2023-08-15",
      time: "10:00 AM",
      location: "City Blood Bank",
      status: "confirmed",
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="donations">Donation History</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Profile" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <CardTitle>{profileData.name}</CardTitle>
                <CardDescription>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span>{profileData.email}</span>
                    <Badge className="w-fit">{profileData.bloodType}</Badge>
                  </div>
                </CardDescription>
              </div>
              <div className="ml-auto">
                {isEditing ? (
                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                ) : (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Personal Information</h3>
                <Separator />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Blood Type</Label>
                    {isEditing ? (
                      <Select
                        value={profileData.bloodType}
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
                    ) : (
                      <Input id="bloodType" value={profileData.bloodType} disabled />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Contact Information</h3>
                <Separator />
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      name="emergencyContact"
                      value={profileData.emergencyContact}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="donations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Donation History</CardTitle>
              <CardDescription>View your past blood donations</CardDescription>
            </CardHeader>
            <CardContent>
              {donationHistory.length > 0 ? (
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left font-medium">Date</th>
                        <th className="p-3 text-left font-medium">Location</th>
                        <th className="p-3 text-left font-medium">Amount</th>
                        <th className="p-3 text-left font-medium">Blood Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donationHistory.map((donation) => (
                        <tr key={donation.id} className="border-b">
                          <td className="p-3">{donation.date}</td>
                          <td className="p-3">{donation.location}</td>
                          <td className="p-3">{donation.amount}</td>
                          <td className="p-3">
                            <Badge variant="outline">{donation.bloodType}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No donation history found.</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Download Donation Certificate
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>View and manage your scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length > 0 ? (
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left font-medium">Date</th>
                        <th className="p-3 text-left font-medium">Time</th>
                        <th className="p-3 text-left font-medium">Location</th>
                        <th className="p-3 text-left font-medium">Status</th>
                        <th className="p-3 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingAppointments.map((appointment) => (
                        <tr key={appointment.id} className="border-b">
                          <td className="p-3">{appointment.date}</td>
                          <td className="p-3">{appointment.time}</td>
                          <td className="p-3">{appointment.location}</td>
                          <td className="p-3">
                            <Badge variant="default" className="bg-green-500">
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Button variant="outline" size="sm">
                              Reschedule
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No upcoming appointments found.</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full">Book New Appointment</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={profileData.notifications.email}
                  onCheckedChange={(checked) => handleSwitchChange("notifications", "email", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={profileData.notifications.sms}
                  onCheckedChange={(checked) => handleSwitchChange("notifications", "sms", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={profileData.notifications.push}
                  onCheckedChange={(checked) => handleSwitchChange("notifications", "push", checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Manage your privacy preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-donation-history">Show Donation History</Label>
                  <p className="text-sm text-muted-foreground">Allow others to see your donation history</p>
                </div>
                <Switch
                  id="show-donation-history"
                  checked={profileData.privacy.showDonationHistory}
                  onCheckedChange={(checked) => handleSwitchChange("privacy", "showDonationHistory", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allow-contact">Allow Contact by Organizations</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow blood banks and healthcare organizations to contact you
                  </p>
                </div>
                <Switch
                  id="allow-contact"
                  checked={profileData.privacy.allowContactByOrganizations}
                  onCheckedChange={(checked) => handleSwitchChange("privacy", "allowContactByOrganizations", checked)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
