"use client"

import { cn } from "@/lib/utils"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Droplet, AlertCircle, Calendar, Shield, Users, Database } from "lucide-react"
import { adminAPI } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import type { SummaryResponse } from "@/lib/types"

export default function DashboardPage() {
  const { toast } = useToast()
  const { user, isAdmin } = useAuth()
  const [stats, setStats] = useState<SummaryResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch dashboard stats for admin users
    const fetchStats = async () => {
      try {
        if (isAdmin) {
          const data = await adminAPI.getSummary()
          setStats(data)
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard statistics",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [isAdmin, toast])

  // Mock data for non-admin users or when API fails
  const defaultStats: SummaryResponse = {
    totalUsers: 124,
    totalAppointments: 89,
    pendingAppointments: 42,
    confirmedAppointments: 35,
    completedAppointments: 10,
    cancelledAppointments: 2,
  }

  const displayStats = stats || defaultStats

  const dashboardCards = [
    {
      title: "Total Users",
      value: displayStats.totalUsers.toString(),
      description: "Registered users",
      icon: Users,
      change: "+5% from last month",
      adminOnly: true,
    },
    {
      title: "Total Appointments",
      value: displayStats.totalAppointments.toString(),
      description: "All appointments",
      icon: Calendar,
      change: "+12% from last month",
    },
    {
      title: "Pending Appointments",
      value: displayStats.pendingAppointments.toString(),
      description: "Awaiting confirmation",
      icon: AlertCircle,
      change: "-3% from last month",
    },
    {
      title: "Confirmed Appointments",
      value: displayStats.confirmedAppointments.toString(),
      description: "Ready for donation",
      icon: Droplet,
      change: "+8% from last month",
    },
    // Admin-only cards
    ...(isAdmin
      ? [
          {
            title: "System Health",
            value: "98.5%",
            description: "Uptime this month",
            icon: Database,
            change: "+0.2% from last month",
            adminOnly: true,
          },
          {
            title: "Admin Actions",
            value: "156",
            description: "This month",
            icon: Shield,
            change: "+23% from last month",
            adminOnly: true,
          },
        ]
      : []),
  ]

  // Filter cards based on user role (admins see everything)
  const filteredCards = dashboardCards.filter((card) => !card.adminOnly || isAdmin)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div
          className={cn(
            "px-3 py-1 rounded-md text-sm font-medium",
            isAdmin ? "bg-red-100 text-red-700 border border-red-200" : "bg-primary/10 text-primary",
          )}
        >
          {isAdmin ? "Admin Dashboard" : "User Dashboard"}
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          {isAdmin && <TabsTrigger value="reports">Reports</TabsTrigger>}
          {isAdmin && <TabsTrigger value="admin">Admin Tools</TabsTrigger>}
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {filteredCards.map((card) => (
              <Card
                key={card.title}
                className={cn(
                  "overflow-hidden border-t-4",
                  card.adminOnly ? "border-t-red-500" : "border-t-primary/80",
                )}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <div className={cn("rounded-full p-2", card.adminOnly ? "bg-red-100" : "bg-primary/10")}>
                    <card.icon className={cn("h-4 w-4", card.adminOnly ? "text-red-600" : "text-primary")} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{card.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Appointment Status Overview</CardTitle>
                <CardDescription>Current status of all appointments</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pending</span>
                    <span className="font-medium">{displayStats.pendingAppointments}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Confirmed</span>
                    <span className="font-medium">{displayStats.confirmedAppointments}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completed</span>
                    <span className="font-medium">{displayStats.completedAppointments}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cancelled</span>
                    <span className="font-medium">{displayStats.cancelledAppointments}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-primary mr-2" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {i % 2 === 0 ? "New appointment" : "New user registration"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {i % 2 === 0 ? "John Doe scheduled for tomorrow" : "Jane Smith joined as donor"}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">{i}h ago</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>View detailed analytics about appointments and users</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground">
              Analytics content will be displayed here
              {isAdmin && <div className="ml-4 text-red-600">(Admin: Full analytics access)</div>}
            </CardContent>
          </Card>
        </TabsContent>
        {isAdmin && (
          <>
            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Reports</CardTitle>
                  <CardDescription>Generate and view administrative reports</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <p>Admin-only reports will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="admin" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Tools</CardTitle>
                  <CardDescription>Administrative tools and system management</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Database className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <p>Admin tools and system controls will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  )
}
