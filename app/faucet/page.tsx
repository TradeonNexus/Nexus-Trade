"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useWallet } from "@/contexts/wallet-context"
import { AuthenticatedLayout } from "@/components/layouts/authenticated-layout"
import { useToast } from "@/components/ui/use-toast"

export default function FaucetPage() {
  const { wallet } = useWallet()
  const { toast } = useToast()

  const [address, setAddress] = useState("")
  const [isHuman, setIsHuman] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [lastClaimTime, setLastClaimTime] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null)

  useEffect(() => {
    if (wallet?.connected) {
      setAddress(wallet.address || "")

      // Check if user has claimed tokens in the last 24 hours
      const lastClaim = localStorage.getItem("lastTokenClaim")
      if (lastClaim) {
        const claimTime = Number.parseInt(lastClaim)
        setLastClaimTime(claimTime)

        // Calculate time remaining
        const updateTimeRemaining = () => {
          const now = Date.now()
          const elapsed = now - claimTime
          const cooldown = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

          if (elapsed < cooldown) {
            const remaining = cooldown - elapsed
            const hours = Math.floor(remaining / (60 * 60 * 1000))
            const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000))
            const seconds = Math.floor((remaining % (60 * 1000)) / 1000)

            setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`)
          } else {
            setTimeRemaining(null)
            setLastClaimTime(null)
          }
        }

        updateTimeRemaining()
        const interval = setInterval(updateTimeRemaining, 1000)
        return () => clearInterval(interval)
      }
    }
  }, [wallet])

  const handleVerifyHuman = () => {
    // In a real app, this would be a CAPTCHA or similar verification
    setIsHuman(true)
    toast({
      title: "Verification Successful",
      description: "You have been verified as human.",
    })
  }

  const handleClaimTokens = () => {
    if (!isHuman) {
      toast({
        title: "Verification Required",
        description: "Please verify you're human before claiming tokens.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Record claim time
      const now = Date.now()
      localStorage.setItem("lastTokenClaim", now.toString())
      setLastClaimTime(now)

      // Update wallet balance (in a real app, this would be handled by the backend)
      if (wallet?.balance) {
        wallet.balance.TUSDC = (wallet.balance.TUSDC || 0) + 10
        localStorage.setItem("nexus_wallet", JSON.stringify(wallet))
      }

      toast({
        title: "Tokens Claimed",
        description: "10 TUSDC has been added to your wallet.",
      })

      setIsLoading(false)
    }, 1500)
  }

  const handleFaucet = () => {
    handleClaimTokens()
  }

  const AnimatedButton = motion.button

  return (
    <AuthenticatedLayout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#0A0A0A] rounded-lg border border-gray-800/30 p-6 w-full max-w-sm"
        >
          <h1 className="text-xl font-bold text-center mb-6 text-white">Claim Tokens</h1>

          {timeRemaining ? (
            <div className="text-center mb-6">
              <p className="text-gray-400 mb-2">You've already claimed tokens recently.</p>
              <p className="text-lg font-medium text-white">Next claim available in:</p>
              <p className="text-[#8ECAFF] text-xl font-bold mt-2">{timeRemaining}</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Enter SUI address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#111] border border-gray-800/30 rounded-md py-2 px-3 text-white text-sm"
                  placeholder="0x..."
                />
              </div>

              <div className="flex space-x-3 mb-4">
                <button
                  className="flex-1 bg-[#111] text-white py-2 rounded-md font-medium border border-gray-800/30 text-sm"
                  onClick={handleVerifyHuman}
                  disabled={isHuman}
                >
                  {isHuman ? "Verified ✓" : "Verify you're human"}
                </button>

                <AnimatedButton
                  className="flex-1 bg-[#8ECAFF] text-black py-2 rounded-md font-medium text-sm"
                  onClick={handleFaucet}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? "Processing..." : "Request Tokens"}
                </AnimatedButton>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {Array(6)
                  .fill("TUSDC")
                  .map((token, index) => (
                    <div key={index} className="bg-[#111] p-2 rounded-md text-center text-gray-400 text-xs">
                      {token}
                    </div>
                  ))}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AuthenticatedLayout>
  )
}
