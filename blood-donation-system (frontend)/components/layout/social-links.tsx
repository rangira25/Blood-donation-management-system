import { Facebook, Instagram, Twitter } from "lucide-react"
import { cn } from "@/lib/utils"

interface SocialLinksProps {
  className?: string
}

export function SocialLinks({ className }: SocialLinksProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <a
        href="https://facebook.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-primary transition-colors"
        aria-label="Facebook"
      >
        <Facebook className="h-5 w-5" />
      </a>
      <a
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-primary transition-colors"
        aria-label="Instagram"
      >
        <Instagram className="h-5 w-5" />
      </a>
      <a
        href="https://twitter.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-primary transition-colors"
        aria-label="Twitter"
      >
        <Twitter className="h-5 w-5" />
      </a>
    </div>
  )
}
