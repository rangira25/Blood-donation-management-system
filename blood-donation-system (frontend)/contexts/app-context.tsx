"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface AppState {
  sidebarOpen: boolean
  notifications: Notification[]
  unreadCount: number
}

interface Notification {
  id: number
  title: string
  description: string
  time: string
  read: boolean
  type: string
}

interface AppContextType {
  state: AppState
  setSidebarOpen: (open: boolean) => void
  addNotification: (notification: Omit<Notification, "id">) => void
  markNotificationAsRead: (id: number) => void
  markAllNotificationsAsRead: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const initialNotifications: Notification[] = [
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
]

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    sidebarOpen: false,
    notifications: initialNotifications,
    unreadCount: initialNotifications.filter((n) => !n.read).length,
  })

  const setSidebarOpen = (open: boolean) => {
    setState((prev) => ({ ...prev, sidebarOpen: open }))
  }

  const addNotification = (notification: Omit<Notification, "id">) => {
    const newNotification = {
      ...notification,
      id: Date.now(),
    }
    setState((prev) => ({
      ...prev,
      notifications: [newNotification, ...prev.notifications],
      unreadCount: prev.unreadCount + 1,
    }))
  }

  const markNotificationAsRead = (id: number) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
      unreadCount: Math.max(0, prev.unreadCount - 1),
    }))
  }

  const markAllNotificationsAsRead = () => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }))
  }

  const value = {
    state,
    setSidebarOpen,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
