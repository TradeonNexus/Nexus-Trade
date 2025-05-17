"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define wallet types
export interface WalletInfo {
  connected: boolean
  address: string | null
  balance: number
  type: string | null
}

interface WalletContextType {
  wallet: WalletInfo | null
  isConnecting: boolean
  connectWallet: (type: string) => Promise<boolean>
  disconnectWallet: () => void
}

// Create context with default values
const WalletContext = createContext<WalletContextType>({
  wallet: null,
  isConnecting: false,
  connectWallet: async () => false,
  disconnectWallet: () => {},
})

// Hook to use the wallet context
export const useWallet = () => useContext(WalletContext)

// Provider component
export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [wallet, setWallet] = useState<WalletInfo | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  // Check for existing wallet connection on mount
  useEffect(() => {
    const storedWallet = localStorage.getItem("wallet")
    if (storedWallet) {
      try {
        setWallet(JSON.parse(storedWallet))
      } catch (error) {
        console.error("Failed to parse stored wallet:", error)
        localStorage.removeItem("wallet")
      }
    }
  }, [])

  // Connect wallet function
  const connectWallet = async (type: string): Promise<boolean> => {
    setIsConnecting(true)

    try {
      // Simulate wallet connection delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock successful connection
      const newWallet: WalletInfo = {
        connected: true,
        address:
          "0x" +
          Array(40)
            .fill(0)
            .map(() => Math.floor(Math.random() * 16).toString(16))
            .join(""),
        balance: 1000 + Math.random() * 9000,
        type,
      }

      setWallet(newWallet)

      // Store in localStorage for persistence
      localStorage.setItem("wallet", JSON.stringify(newWallet))

      return true
    } catch (error) {
      console.error("Wallet connection error:", error)
      return false
    } finally {
      setIsConnecting(false)
    }
  }

  // Disconnect wallet function
  const disconnectWallet = () => {
    setWallet(null)
    localStorage.removeItem("wallet")
  }

  return (
    <WalletContext.Provider value={{ wallet, isConnecting, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  )
}
