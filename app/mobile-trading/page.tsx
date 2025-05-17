"use client"

import dynamic from "next/dynamic"
import { LoadingScreen } from "@/components/ui/loading-screen"

// Dynamically import the mobile trading page to prevent server-side rendering
const MobileTradingPage = dynamic(() => import("@/components/mobile/mobile-trading-page"), {
  loading: () => <LoadingScreen />,
  ssr: false,
})

export default function MobileTradingRoute() {
  return <MobileTradingPage />
}
