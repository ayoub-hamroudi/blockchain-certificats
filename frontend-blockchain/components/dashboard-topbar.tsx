"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, Check, Menu } from "lucide-react"
import { useState } from "react"
import type { UserRole } from "@/lib/wallet-context"

interface DashboardTopbarProps {
  title: string
  address: string
  role: UserRole
  onMenuClick?: () => void
}

const roleLabels: Record<UserRole, { label: string; variant: "default" | "secondary" | "outline" }> = {
  admin: { label: "Administrator", variant: "default" },
  teacher: { label: "Teacher", variant: "secondary" },
  student: { label: "Student", variant: "outline" },
  visitor: { label: "Visitor", variant: "outline" },
}

export function DashboardTopbar({ title, address, role, onMenuClick }: DashboardTopbarProps) {
  const [copied, setCopied] = useState(false)

  const copyAddress = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`
  const roleInfo = roleLabels[role]

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant={roleInfo.variant}>{roleInfo.label}</Badge>
        <div className="hidden items-center gap-1 rounded-lg bg-muted px-3 py-1.5 sm:flex">
          <code className="text-sm">{truncatedAddress}</code>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={copyAddress}
          >
            {copied ? (
              <Check className="h-3 w-3 text-success" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}
