"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  FileText,
  FilePlus,
  CheckSquare,
  Users,
  PenTool,
  GraduationCap,
  Search,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { UserRole } from "@/lib/wallet-context"

interface DashboardSidebarProps {
  role: UserRole
  onDisconnect: () => void
}

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  roles: UserRole[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: ["admin", "teacher", "student"],
  },
  {
    title: "All Certificates",
    href: "/dashboard/certificates",
    icon: FileText,
    roles: ["admin"],
  },
  {
    title: "Generate Certificate",
    href: "/dashboard/generate",
    icon: FilePlus,
    roles: ["admin"],
  },
  {
    title: "Validate Certificate",
    href: "/dashboard/validate",
    icon: CheckSquare,
    roles: ["admin"],
  },
  {
    title: "User Management",
    href: "/dashboard/users",
    icon: Users,
    roles: ["admin"],
  },
  {
    title: "Pending Signatures",
    href: "/dashboard/sign",
    icon: PenTool,
    roles: ["teacher"],
  },
  {
    title: "My Certificates",
    href: "/dashboard/my-certificates",
    icon: GraduationCap,
    roles: ["student"],
  },
  {
    title: "Verify Certificate",
    href: "/verify",
    icon: Search,
    roles: ["admin", "teacher", "student", "visitor"],
  },
]

export function DashboardSidebar({ role, onDisconnect }: DashboardSidebarProps) {
  const pathname = usePathname()

  const filteredNavItems = navItems.filter((item) => item.roles.includes(role))

  return (
    <div className="flex h-full w-64 flex-col border-r bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <GraduationCap className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-semibold">CertChain</span>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>
      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
          onClick={onDisconnect}
        >
          <LogOut className="h-4 w-4" />
          Disconnect
        </Button>
      </div>
    </div>
  )
}
