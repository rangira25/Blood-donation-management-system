import { AlertCircle, Calendar, Droplet, User, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

interface NotificationProps {
  notification: {
    id: number
    title: string
    description: string
    time: string
    read: boolean
    type: string
  }
}

export function NotificationItem({ notification }: NotificationProps) {
  const getIcon = () => {
    switch (notification.type) {
      case "request":
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      case "appointment":
        return <Calendar className="h-5 w-5 text-blue-500" />
      case "donor":
        return <User className="h-5 w-5 text-green-500" />
      case "donation":
        return <Droplet className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors",
        !notification.read && "bg-primary/5",
      )}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">{getIcon()}</div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h5 className={cn("text-sm font-medium", !notification.read && "font-semibold")}>{notification.title}</h5>
          <span className="text-xs text-muted-foreground">{notification.time}</span>
        </div>
        <p className="text-xs text-muted-foreground">{notification.description}</p>
      </div>
      {!notification.read && <div className="mt-1 h-2 w-2 rounded-full bg-primary" />}
    </div>
  )
}
