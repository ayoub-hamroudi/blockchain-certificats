"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"

export type UserRole = "admin" | "teacher" | "student" | "visitor"

interface WalletContextType {
  address: string | null
  role: UserRole | null
  isConnected: boolean
  isConnecting: boolean
  connect: (selectedRole?: UserRole) => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Handle hydration
  useEffect(() => {
    setMounted(true)
    // Check if already connected (from localStorage)
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("demo_role") as UserRole | null
      const storedAddress = localStorage.getItem("demo_address")
      if (storedRole && storedAddress) {
        setRole(storedRole)
        setAddress(storedAddress)
      }
    }
  }, [])

  const connect = useCallback(async (selectedRole?: UserRole) => {
    setIsConnecting(true)
    
    // Simulate wallet connection delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    // For demo, use a mock address
    const mockAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f8fE"
    setAddress(mockAddress)
    
    // Use selected role or check localStorage
    const roleToUse = selectedRole || (typeof window !== "undefined" ? localStorage.getItem("demo_role") as UserRole : null) || "visitor"
    setRole(roleToUse)
    
    // Store in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("demo_role", roleToUse)
      localStorage.setItem("demo_address", mockAddress)
    }
    
    setIsConnecting(false)
  }, [])

  const disconnect = useCallback(() => {
    setAddress(null)
    setRole(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("demo_role")
      localStorage.removeItem("demo_address")
    }
  }, [])

  return (
    <WalletContext.Provider
      value={{
        address,
        role,
        isConnected: !!address,
        isConnecting,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

// Helper to set demo role
export function setDemoRole(role: UserRole) {
  localStorage.setItem("demo_role", role)
}
