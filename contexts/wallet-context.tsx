"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { WalletInfo, WalletType, Token } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

interface WalletContextType {
  wallet: WalletInfo | null
  connectWallet: (type: WalletType) => Promise<boolean>
  disconnectWallet: () => void
  isConnecting: boolean
}

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  connectWallet: async () => false,
  disconnectWallet: () => {},
  isConnecting: false,
})

export const useWallet = () => useContext(WalletContext)

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [wallet, setWallet] = useState<WalletInfo | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  // Check for existing wallet connection on mount
  useEffect(() => {
    const savedWallet = localStorage.getItem("nexus_wallet")
    if (savedWallet) {
      try {
        setWallet(JSON.parse(savedWallet))
      } catch (error) {
        console.error("Failed to parse saved wallet", error)
        localStorage.removeItem("nexus_wallet")
      }
    }
  }, [])

  // Mock wallet connection
  const connectWallet = async (type: WalletType): Promise<boolean> => {
    setIsConnecting(true)

    try {
      // Check if wallet is already connected
      if (wallet?.connected) {
        return true
      }

      // Check if Sui wallet is available in the browser
      const isSuiWalletAvailable = typeof window !== "undefined" && "suiWallet" in window

      if (type === "sui" && !isSuiWalletAvailable) {
        toast({
          title: "Sui Wallet Not Detected",
          description: "Please install the Sui Wallet extension to connect.",
          variant: "destructive",
        })
        return false
      }

      // Simulate connection delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate mock wallet data
      const mockAddress = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`

      const mockBalance: Record<Token, number> = {
        SUI: Number.parseFloat((Math.random() * 1000).toFixed(2)),
        USDC: Number.parseFloat((Math.random() * 2000).toFixed(2)),
        USDT: Number.parseFloat((Math.random() * 2000).toFixed(2)),
        WETH: Number.parseFloat((Math.random() * 2).toFixed(8)),
        WBTC: Number.parseFloat((Math.random() * 0.1).toFixed(8)),
        CETUS: Number.parseFloat((Math.random() * 5000).toFixed(2)),
        TURBOS: Number.parseFloat((Math.random() * 2000).toFixed(2)),
        AFT: Number.parseFloat((Math.random() * 10000).toFixed(2)),
      }

      const newWallet: WalletInfo = {
        address: mockAddress,
        balance: mockBalance,
        connected: true,
        type,
      }

      setWallet(newWallet)
      localStorage.setItem("nexus_wallet", JSON.stringify(newWallet))

      toast({
        title: "Wallet Connected",
        description: "Your Sui wallet has been successfully connected.",
      })

      return true
    } catch (error) {
      console.error("Failed to connect wallet", error)

      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })

      return false
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setWallet(null)
    localStorage.removeItem("nexus_wallet")

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    })
  }

  return (
    <WalletContext.Provider value={{ wallet, connectWallet, disconnectWallet, isConnecting }}>
      {children}
    </WalletContext.Provider>
  )
}
