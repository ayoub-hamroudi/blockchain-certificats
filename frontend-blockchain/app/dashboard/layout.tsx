"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardTopbar } from "@/components/dashboard-topbar"
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import type { UserRole } from "@/lib/wallet-context"

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/certificates": "All Certificates",
  "/dashboard/generate": "Generate Certificate",
  "/dashboard/validate": "Validate Certificate",
  "/dashboard/users": "User Management",
  "/dashboard/sign": "Pending Signatures",
  "/dashboard/my-certificates": "My Certificates",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [role, setRole] = useState<UserRole | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const address = "0x742d35Cc6634C0532925a3b844Bc9e7595f8fE"
  const title = pageTitles[pathname] || "Dashboard"

  useEffect(() => {
    const storedRole = localStorage.getItem("demo_role") as UserRole | null
    if (!storedRole) {
      router.push("/")
      return
    }
    setRole(storedRole)
  }, [router])

  const handleDisconnect = () => {
    localStorage.removeItem("demo_role")
    router.push("/")
  }

  if (!role) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <DashboardSidebar role={role} onDisconnect={handleDisconnect} />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <VisuallyHidden>
            <SheetTitle>Navigation Menu</SheetTitle>
            <SheetDescription>Dashboard navigation sidebar</SheetDescription>
          </VisuallyHidden>
          <DashboardSidebar role={role} onDisconnect={handleDisconnect} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardTopbar
          title={title}
          address={address}
          role={role}
          onMenuClick={() => setMobileMenuOpen(true)}
        />
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
