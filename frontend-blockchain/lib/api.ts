import { ethers } from "ethers"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined")
}

export type AuthUser = {
  token: string
  walletAddress: string
  role: string
  blockchainRole: string
}

declare global {
  interface Window {
    ethereum?: any
  }
}

export function getStoredToken() {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

export function getStoredRole() {
  if (typeof window === "undefined") return null
  return localStorage.getItem("role")
}

export function getStoredWalletAddress() {
  if (typeof window === "undefined") return null
  return localStorage.getItem("walletAddress")
}

export function setAuthStorage(data: {
  token: string
  role: string
  walletAddress: string
}) {
  if (typeof window === "undefined") return

  localStorage.setItem("token", data.token)
  localStorage.setItem("role", data.role)
  localStorage.setItem("walletAddress", data.walletAddress)
}

export function clearAuthStorage() {
  if (typeof window === "undefined") return

  localStorage.removeItem("token")
  localStorage.removeItem("role")
  localStorage.removeItem("walletAddress")
}

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
  token?: string
) {
  const headers = new Headers(options.headers || {})

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json")
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const contentType = response.headers.get("content-type")

  if (!response.ok) {
    let errorMessage = `API error: ${response.status}`

    try {
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json()
        errorMessage =
          errorData?.message ||
          errorData?.error ||
          JSON.stringify(errorData)
      } else {
        errorMessage = await response.text()
      }
    } catch {
      errorMessage = `API error: ${response.status}`
    }

    throw new Error(errorMessage)
  }

  if (contentType && contentType.includes("application/json")) {
    return response.json()
  }

  return response.text()
}

export async function connectWalletWithMetaMask(): Promise<AuthUser> {
  if (typeof window === "undefined") {
    throw new Error("Window is not available")
  }

  if (!window.ethereum) {
    throw new Error("MetaMask is not installed")
  }

  const provider = new ethers.BrowserProvider(window.ethereum)

  await provider.send("eth_requestAccounts", [])

  const signer = await provider.getSigner()
  const walletAddress = await signer.getAddress()

  const nonceResponse = await apiFetch("/api/auth/nonce", {
    method: "POST",
    body: JSON.stringify({ walletAddress }),
  })

  const message = nonceResponse?.data?.message

  if (!message) {
    throw new Error("Authentication message not received from backend")
  }

  const signature = await signer.signMessage(message)

  const verifyResponse = await apiFetch("/api/auth/verify", {
    method: "POST",
    body: JSON.stringify({
      walletAddress,
      signature,
    }),
  })

  const authData = verifyResponse?.data

  if (!authData?.token || !authData?.role || !authData?.walletAddress) {
    throw new Error("Invalid authentication response from backend")
  }

  setAuthStorage({
    token: authData.token,
    role: authData.role,
    walletAddress: authData.walletAddress,
  })

  return {
    token: authData.token,
    walletAddress: authData.walletAddress,
    role: authData.role,
    blockchainRole: authData.blockchainRole,
  }
}

export async function getMyProfile() {
  const token = getStoredToken()

  if (!token) {
    throw new Error("Authentication token not found")
  }

  return apiFetch("/api/auth/me", { method: "GET" }, token)
}

export async function disconnectWallet() {
  clearAuthStorage()
}