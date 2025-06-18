"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NotificationItem } from "@/components/notifications/notification-item"

// Mock notifications data
const notifications = [
  {
    id: 1,
    title: "New Donation Request",
    description: "City Hospital has requested 2 units of A+ blood",
    time: "10 minutes ago",
    read: false,
    type: "request",
  },
  {
    id: 2,
    title: "Appointment Confirmed",
    description: "Your appointment on May 15 has been confirmed",
    time: "1 hour ago",
    read: true,
    type: "appointment",
  },
  {
    id: 3,
    title: "New Donor Registered",
    description: "Sarah Brown has registered as a new donor",
    time: "3 hours ago",
    read: false,
    type: "donor",
  },
  {
    id: 4,
    title: "Donation Completed",
    description: "John Doe has completed his blood donation",
    time: "Yesterday",
    read: true,
    type: "donation",
  },
  {
    id: 5,
    title: "System Update",
    description: "The system will be down for maintenance tonight",
    time: "2 days ago",
    read: true,
    type: "system",
  },
]

export function NotificationsPopover() {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const unreadCount = notifications.filter((n) => !n.read).length

  const filteredNotifications = activeTab === "all" ? notifications : notifications.filter((n) => !n.read)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Notifications</h4>
            <Button variant="ghost" size="sm" className="h-auto text-xs px-2">
              Mark all as read
            </Button>
          </div>
        </div>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b px-4">
            <TabsList className="w-full justify-start rounded-none border-b-0 p-0">
              <TabsTrigger
                value="all"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="unread"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
              >
                Unread
                {unreadCount > 0 && (
                  <span className="ml-1 rounded-full bg-primary/10 px-1.5 text-xs text-primary">{unreadCount}</span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="all" className="m-0">
            <ScrollArea className="h-[300px]">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))
              ) : (
                <div className="flex h-[300px] items-center justify-center">
                  <p className="text-sm text-muted-foreground">No notifications</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="unread" className="m-0">
            <ScrollArea className="h-[300px]">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))
              ) : (
                <div className="flex h-[300px] items-center justify-center">
                  <p className="text-sm text-muted-foreground">No unread notifications</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
        <div className="border-t p-2">
          <Button variant="ghost" size="sm" className="w-full justify-center" asChild>
            <a href="/notifications">View all notifications</a>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
