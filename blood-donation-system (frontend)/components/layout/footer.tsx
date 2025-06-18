import Link from "next/link"
import { Heart } from "lucide-react"
import { SocialLinks } from "@/components/layout/social-links"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500" />
              <span className="font-bold text-lg">Blood Donation System</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Connecting donors with those in need, making blood donation simple, efficient, and life-saving.
            </p>
            <SocialLinks />
          </div>

          <div>
            <h3 className="font-medium mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-primary">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/donors" className="text-muted-foreground hover:text-primary">
                  Donors
                </Link>
              </li>
              <li>
                <Link href="/appointments" className="text-muted-foreground hover:text-primary">
                  Appointments
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-3">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/eligibility" className="text-muted-foreground hover:text-primary">
                  Eligibility Checker
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-3">Download Our App</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Get our mobile app for easier donation scheduling and tracking.
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="#"
                className="bg-black text-white px-4 py-2 rounded-md text-sm flex items-center justify-center"
              >
                Download on App Store
              </Link>
              <Link
                href="#"
                className="bg-black text-white px-4 py-2 rounded-md text-sm flex items-center justify-center"
              >
                Get it on Google Play
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Blood Donation System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
