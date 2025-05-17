"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import TradingPageContent from "@/components/trading/trading-page-content"
import { useIsMobile } from "@/hooks/use-mobile"

export default function TradingPage() {
  const router = useRouter()
  const isMobile = useIsMobile()

  useEffect(() => {
    if (isMobile) {
      router.push("/mobile-trading")
    }
  }, [isMobile, router])

  if (isMobile) {
    return null // This prevents flash of content before redirect
  }

  return <TradingPageContent />
}
