"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useWallet } from "@/contexts/wallet-context"
import dynamic from "next/dynamic"

// Dynamically import components with SSR disabled
const TradingPageContent = dynamic(() => import("@/components/trading/trading-page-content"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="animate-pulse text-white">Loading trading interface...</div>
    </div>
  ),
})

export default function TradingPage() {
  const router = useRouter()
  const { wallet } = useWallet()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Redirect to sign-in if not authenticated
    if (!wallet?.connected) {
      router.push("/sign-in")
    }
  }, [wallet, router])

  // Don't render anything on server-side
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-pulse text-white">Loading trading interface...</div>
      </div>
    )
  }

  // Don't render the trading page if not authenticated
  if (!wallet?.connected) {
    return null
  }

  return <TradingPageContent />
}
