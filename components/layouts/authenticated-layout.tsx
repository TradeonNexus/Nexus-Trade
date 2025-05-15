"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useWallet } from "@/contexts/wallet-context"
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link"
import Image from "next/image"
import { User } from "lucide-react"

interface AuthenticatedLayoutProps {
  children: React.ReactNode
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const router = useRouter()
  const { wallet } = useWallet()

  useEffect(() => {
    if (!wallet?.connected) {
      router.push("/sign-in")
    }
  }, [wallet, router])

  if (!wallet?.connected) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A] border border-gray-800/30 rounded-lg mx-4 mt-4 py-3 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image src="/images/logo.png" alt="Nexus Trade" width={32} height={32} />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-white font-medium">$450.07</div>
          <button className="w-8 h-8 rounded-full bg-[#0A0A0A] border border-gray-800/30 flex items-center justify-center">
            <User size={18} className="text-white" />
          </button>
        </div>
      </header>
      <div className="fixed left-0 top-0 bottom-0 z-40 w-[72px] bg-[#0A0A0A] border-r border-gray-800/30 mt-24 ml-4 rounded-lg">
        <div className="flex flex-col items-center py-4 space-y-6">
          <Link href="/dashboard" className="p-3 rounded-lg hover:bg-[#111] transition-colors">
            <Image src="/images/icons/dashboard.png" alt="Dashboard" width={24} height={24} />
          </Link>
          <Link href="/trading" className="p-3 rounded-lg bg-[#111] transition-colors">
            <Image src="/images/icons/trade.png" alt="Trading" width={24} height={24} />
          </Link>
          <Link href="/analytics" className="p-3 rounded-lg hover:bg-[#111] transition-colors">
            <Image src="/images/icons/analytics.png" alt="Analytics" width={24} height={24} />
          </Link>
          <Link href="/faucet" className="p-3 rounded-lg hover:bg-[#111] transition-colors">
            <Image src="/images/icons/faucet.png" alt="Faucet" width={24} height={24} />
          </Link>
          <Link href="/deposit" className="p-3 rounded-lg hover:bg-[#111] transition-colors">
            <Image src="/images/icons/deposit.png" alt="Deposit" width={24} height={24} />
          </Link>
          <Link href="/withdraw" className="p-3 rounded-lg hover:bg-[#111] transition-colors">
            <Image src="/images/icons/withdraw.png" alt="Withdraw" width={24} height={24} />
          </Link>
          <button
            className="p-3 rounded-lg hover:bg-[#111] transition-colors"
            onClick={() => {
              localStorage.removeItem("nexus_wallet")
              window.location.href = "/"
            }}
          >
            <Image src="/images/icons/signout.png" alt="Sign Out" width={24} height={24} />
          </button>
        </div>
      </div>
      <main className="pt-24 pl-[88px] pr-4 pb-4 min-h-screen">{children}</main>
      <Toaster />
    </div>
  )
}
