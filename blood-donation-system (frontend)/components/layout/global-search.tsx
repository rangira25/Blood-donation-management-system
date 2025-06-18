"use client"

import { useState, useEffect } from "react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { User, Droplet, AlertCircle, Calendar, Users } from "lucide-react"
import { useRouter } from "next/navigation"

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  // Register keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden md:inline-flex items-center rounded-md border border-input bg-background px-3 py-1 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <span className="hidden lg:inline-flex">Search system...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="ml-2 pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/donors"))}>
              <User className="mr-2 h-4 w-4" />
              <span>Donors</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/donations"))}>
              <Droplet className="mr-2 h-4 w-4" />
              <span>Donations</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/requests"))}>
              <AlertCircle className="mr-2 h-4 w-4" />
              <span>Requests</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/appointments"))}>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Appointments</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => runCommand(() => router.push("/donors?action=add"))}>
              <User className="mr-2 h-4 w-4" />
              <span>Add New Donor</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/appointments?action=book"))}>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Book Appointment</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/contact"))}>
              <Users className="mr-2 h-4 w-4" />
              <span>Contact Support</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
