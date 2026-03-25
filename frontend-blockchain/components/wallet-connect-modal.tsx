"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Wallet, Loader2 } from "lucide-react"
import { apiFetch, clearAuthStorage, setAuthStorage } from "@/lib/api"

interface WalletConnectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

declare global {
  interface Window {
    ethereum?: any
  }
}

export function WalletConnectModal({
  open,
  onOpenChange,
}: WalletConnectModalProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState("")

  const handleConnect = async () => {
    setIsConnecting(true)
    setError("")

    try {
      if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("MetaMask is not installed")
      }

      clearAuthStorage()

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      const walletAddress = accounts?.[0]

      if (!walletAddress) {
        throw new Error("No wallet address found")
      }

      const nonceResponse = await apiFetch("/api/auth/nonce", {
        method: "POST",
        body: JSON.stringify({ walletAddress }),
      })

      const message = nonceResponse?.data?.message

      if (!message) {
        throw new Error("Nonce message not received from backend")
      }

      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, walletAddress],
      })

      const verifyResponse = await apiFetch("/api/auth/verify", {
        method: "POST",
        body: JSON.stringify({
          walletAddress,
          signature,
        }),
      })

      const authData = verifyResponse?.data

      if (!authData?.token) {
        throw new Error("Authentication token not received")
      }

      const finalRole = authData?.role || "visitor"

      setAuthStorage({
        token: authData.token,
        role: finalRole,
        walletAddress: authData.walletAddress || walletAddress,
      })

      onOpenChange(false)

      const targetPath = finalRole === "visitor" ? "/verify" : "/dashboard"

      window.location.href = targetPath
    } catch (err: any) {
      setError(err?.message || "Connection failed")
    } finally {
      setIsConnecting(false)
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
            Connect your Ethereum wallet to authenticate with the backend.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && <p className="text-sm text-red-500">{error}</p>}

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
        </div>
      </DialogContent>
    </Dialog>
  )
}