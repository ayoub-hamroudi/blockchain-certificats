"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Wallet, Loader2, Shield, GraduationCap, BookOpen, User } from "lucide-react"
import { setDemoRole, type UserRole } from "@/lib/wallet-context"

interface WalletConnectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const roles: { value: UserRole; label: string; description: string; icon: React.ElementType }[] = [
  {
    value: "admin",
    label: "Administrator",
    description: "Generate, validate certificates, manage users",
    icon: Shield,
  },
  {
    value: "teacher",
    label: "Teacher",
    description: "Sign pending certificates",
    icon: BookOpen,
  },
  {
    value: "student",
    label: "Student",
    description: "View and download your certificates",
    icon: GraduationCap,
  },
  {
    value: "visitor",
    label: "Visitor",
    description: "Verify certificate authenticity",
    icon: User,
  },
]

export function WalletConnectModal({ open, onOpenChange }: WalletConnectModalProps) {
  const router = useRouter()
  const [isConnecting, setIsConnecting] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin")

  const handleConnect = async () => {
    setIsConnecting(true)
    
    // Simulate wallet connection
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    // Set the demo role
    setDemoRole(selectedRole)
    
    setIsConnecting(false)
    onOpenChange(false)
    
    // Navigate to appropriate dashboard
    if (selectedRole === "visitor") {
      router.push("/verify")
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect Wallet
          </DialogTitle>
          <DialogDescription>
            Connect your Ethereum wallet to access the platform. For this demo, select a role to explore.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Select Demo Role</Label>
            <RadioGroup
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value as UserRole)}
              className="space-y-2"
            >
              {roles.map((role) => (
                <label
                  key={role.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 ${
                    selectedRole === role.value ? "border-primary bg-primary/5" : ""
                  }`}
                >
                  <RadioGroupItem value={role.value} className="sr-only" />
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    selectedRole === role.value ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>
                    <role.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{role.label}</p>
                    <p className="text-xs text-muted-foreground">{role.description}</p>
                  </div>
                  <div className={`h-4 w-4 rounded-full border-2 ${
                    selectedRole === role.value ? "border-primary bg-primary" : "border-muted-foreground/30"
                  }`}>
                    {selectedRole === role.value && (
                      <div className="h-full w-full scale-50 rounded-full bg-primary-foreground" />
                    )}
                  </div>
                </label>
              ))}
            </RadioGroup>
          </div>
          <Button
            className="w-full gap-2"
            onClick={handleConnect}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="h-4 w-4" />
                Connect with MetaMask
              </>
            )}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            By connecting, you agree to the Terms of Service and Privacy Policy
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
