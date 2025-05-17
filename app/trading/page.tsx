"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useWallet } from "@/contexts/wallet-context"
import { TradingPageContent } from "@/components/trading/trading-page-content"
import { AuthenticatedLayout } from "@/components/layouts/authenticated-layout"
import { useIsMobile } from "@/hooks/use-mobile"

export default function TradingPage() {
  const router = useRouter()
  const { wallet } = useWallet()
  const [isClient, setIsClient] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    setIsClient(true)

    // Redirect to sign-in if not authenticated
    if (!wallet?.connected) {
      router.push("/sign-in")
    }

    // Redirect to mobile version on mobile devices
    if (isMobile) {
      router.push("/mobile-trading")
    }
  }, [wallet, router, isMobile])

  // Don't render anything on server-side
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-pulse text-white">Loading trading interface...</div>
      </div>
    )
  }

  // Don't render the trading page if not authenticated or on mobile
  if (!wallet?.connected || isMobile) {
    return null
  }

  return (
    <AuthenticatedLayout>
      <TradingPageContent />
    </AuthenticatedLayout>
  )
}
