import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { WalletProvider } from "@/contexts/wallet-context"
import { VideoModalProvider } from "@/contexts/video-modal-context"
import { TradingProvider } from "@/contexts/trading-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Nexus Trade - Decentralized Perpetual Futures Trading",
  description: "Trade perpetual futures on Nexus Trade, the decentralized trading platform.",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        <WalletProvider>
          <VideoModalProvider>
            <TradingProvider>
              {children}
              <Toaster />
            </TradingProvider>
          </VideoModalProvider>
        </WalletProvider>
      </body>
    </html>
  )
}
