"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useWallet } from "@/contexts/wallet-context"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import Image from "next/image"

export default function SignInPage() {
  const router = useRouter()
  const { wallet, connectWallet, isConnecting } = useWallet()
  const { toast } = useToast()
  const [error, setError] = useState<string | null>(null)

  const handleConnectWallet = async () => {
    try {
      setError(null)
      const success = await connectWallet("sui")
      if (success) {
        toast({
          title: "Wallet Connected",
          description: "You have successfully connected your wallet.",
        })
        router.push("/trading")
      } else {
        setError("Failed to connect wallet. Please try again.")
      }
    } catch (error) {
      console.error("Connection error:", error)
      setError("An unexpected error occurred. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#001428] via-black to-black opacity-70 z-0"></div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 z-10"
      >
        <Image src="/images/logo.png" alt="Nexus Trade Logo" width={80} height={80} className="h-20 w-auto" />
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold text-white mb-2 text-center z-10"
      >
        Welcome to Nexus Trade
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-gray-400 mb-12 text-center z-10"
      >
        ...the decentralized perpetual futures trading platform
      </motion.p>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-900/30 border border-red-500 text-red-500 px-4 py-2 rounded-md mb-6 flex items-center z-10"
        >
          <div className="mr-2 bg-red-500 rounded-full p-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          {error}
        </motion.div>
      )}

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="w-full max-w-md bg-[#0A0A0A] rounded-lg p-8 border border-gray-900 z-10"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-[#8ECAFF] text-black py-3 rounded-md font-medium mb-4 hover:bg-[#0096FF] transition-colors"
          onClick={handleConnectWallet}
          disabled={isConnecting}
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-[#001C30] text-white py-3 rounded-md font-medium border border-[#0096FF]/30 hover:bg-[#002D4A] transition-colors"
        >
          Connect Stashed
        </motion.button>

        <div className="mt-6 text-center">
          <Link href="/recover-account" className="text-[#0096FF] hover:underline text-sm">
            Recover account
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
