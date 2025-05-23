"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
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
  const pathname = usePathname()
  const { wallet } = useWallet()

  useEffect(() => {
    // Check if wallet is not connected and redirect to sign-in
    if (!wallet?.connected) {
      router.push("/sign-in")
    }
  }, [wallet, router])

  // Don't render anything until we've checked authentication
  // This prevents the flash of protected content before redirect
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
      <div className="fixed left-2 top-20 bottom-4 z-40 w-20 bg-[#0A0A0A] border-r border-gray-800/30 rounded-lg shadow-lg flex flex-col items-center py-3 space-y-3 transition-all duration-300">
        <Link
          href="/dashboard"
          className={`p-2 rounded-md flex items-center justify-center ${pathname === "/dashboard" ? "bg-primary/20 border border-primary text-primary" : "hover:bg-[#111] text-white"} transition-colors`}
        >
          <Image src="/images/icons/dashboard.png" alt="Dashboard" width={24} height={24} />
        </Link>
        <Link
          href="/trading"
          className={`p-2 rounded-md flex items-center justify-center ${pathname === "/trading" ? "bg-primary/20 border border-primary text-primary" : "hover:bg-[#111] text-white"} transition-colors`}
        >
          <Image src="/images/icons/trade.png" alt="Trading" width={24} height={24} />
        </Link>
        <Link
          href="/faucet"
          className={`p-2 rounded-md flex items-center justify-center ${pathname === "/faucet" ? "bg-primary/20 border border-primary text-primary" : "hover:bg-[#111] text-white"} transition-colors`}
        >
          <Image src="/images/icons/faucet.png" alt="Faucet" width={24} height={24} />
        </Link>
        <Link
          href="/deposit"
          className={`p-2 rounded-md flex items-center justify-center ${pathname === "/deposit" ? "bg-primary/20 border border-primary text-primary" : "hover:bg-[#111] text-white"} transition-colors`}
        >
          <Image src="/images/icons/deposit.png" alt="Deposit" width={24} height={24} />
        </Link>
        <Link
          href="/withdraw"
          className={`p-2 rounded-md flex items-center justify-center ${pathname === "/withdraw" ? "bg-primary/20 border border-primary text-primary" : "hover:bg-[#111] text-white"} transition-colors`}
        >
          <Image src="/images/icons/withdraw.png" alt="Withdraw" width={24} height={24} />
        </Link>
        <button
          className="p-2 rounded-md flex items-center justify-center hover:bg-[#111] text-white transition-colors"
          onClick={() => {
            localStorage.removeItem("nexus_wallet")
            window.location.href = "/"
          }}
        >
          <Image src="/images/icons/signout.png" alt="Sign Out" width={24} height={24} />
        </button>
      </div>
      <main className="pt-24 pl-[88px] pr-4 pb-4 min-h-screen">{children}</main>
      <Toaster />
    </div>
  )
}
