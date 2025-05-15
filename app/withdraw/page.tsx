"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useWallet } from "@/contexts/wallet-context"
import { AuthenticatedLayout } from "@/components/layouts/authenticated-layout"
import { useToast } from "@/components/ui/use-toast"
import { X } from "lucide-react"
import type { Token } from "@/lib/types"

export default function WithdrawPage() {
  const { wallet } = useWallet()
  const { toast } = useToast()

  const [amount, setAmount] = useState<number | string>("")
  const [selectedToken, setSelectedToken] = useState<Token>("WBTC")
  const [isLoading, setIsLoading] = useState(false)

  const handleSetMaxAmount = () => {
    if (wallet?.balance && wallet.balance[selectedToken]) {
      setAmount(wallet.balance[selectedToken])
    }
  }

  const handleWithdraw = () => {
    if (!amount || Number(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount.",
        variant: "destructive",
      })
      return
    }

    const numAmount = Number(amount)
    if (wallet?.balance && (wallet.balance[selectedToken] || 0) < numAmount) {
      toast({
        title: "Insufficient Balance",
        description: `You don't have enough ${selectedToken} to withdraw.`,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate withdrawal process
    setTimeout(() => {
      // Update wallet balance
      if (wallet?.balance) {
        wallet.balance[selectedToken] = Math.max(0, (wallet.balance[selectedToken] || 0) - numAmount)
        localStorage.setItem("nexus_wallet", JSON.stringify(wallet))
      }

      toast({
        title: "Withdrawal Successful",
        description: `Successfully withdrew ${amount} ${selectedToken} from your wallet.`,
      })

      setAmount("")
      setIsLoading(false)
    }, 1500)
  }

  return (
    <AuthenticatedLayout>
      <div className="p-6 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-b from-black to-[#001020]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-b from-[#0A0A0A] to-[#001C30] rounded-lg border border-gray-800/50 p-8 w-full max-w-md"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Withdraw Funds</h1>
            <button className="text-gray-400 hover:text-white rounded-full">
              <X size={20} />
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">Amount to be withdrawn</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-gray-800/50 rounded-md py-3 px-4 text-white"
                placeholder="0.00"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <button className="text-[#8ECAFF] text-sm" onClick={handleSetMaxAmount}>
                  MAX
                </button>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex space-x-2">
              <button
                className={`px-4 py-2 rounded-md ${
                  selectedToken === "WBTC"
                    ? "bg-gradient-to-r from-[#0096FF] to-[#8ECAFF] text-black"
                    : "bg-[#0A0A0A] text-white border border-gray-800/50"
                }`}
                onClick={() => setSelectedToken("WBTC")}
              >
                WBTC
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  selectedToken === "ETH"
                    ? "bg-gradient-to-r from-[#0096FF] to-[#8ECAFF] text-black"
                    : "bg-[#0A0A0A] text-white border border-gray-800/50"
                }`}
                onClick={() => setSelectedToken("ETH")}
              >
                ETH
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  selectedToken === "SUI"
                    ? "bg-gradient-to-r from-[#0096FF] to-[#8ECAFF] text-black"
                    : "bg-[#0A0A0A] text-white border border-gray-800/50"
                }`}
                onClick={() => setSelectedToken("SUI")}
              >
                SUI
              </button>
            </div>
          </div>

          <motion.button
            className="w-full bg-gradient-to-r from-[#0096FF] to-[#8ECAFF] text-black py-3 rounded-md font-medium"
            onClick={handleWithdraw}
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? "Processing..." : "Confirm Withdrawal"}
          </motion.button>
        </motion.div>
      </div>
    </AuthenticatedLayout>
  )
}
