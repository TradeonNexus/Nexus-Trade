"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useWallet } from "@/contexts/wallet-context"
import { formatPrice } from "@/lib/utils"
import { User } from "lucide-react"

export function Header() {
  const { wallet } = useWallet()

  // Calculate total balance in USD
  const totalBalance = wallet?.balance ? Object.values(wallet.balance).reduce((sum, val) => sum + val, 0) : 0

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800 h-16"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between h-full px-4">
        <Link href="/" className="flex items-center">
          <Image src="/images/logo.png" alt="Nexus Trade Logo" width={40} height={40} className="h-8 w-auto" />
        </Link>

        {wallet?.connected && (
          <div className="flex items-center">
            <motion.div
              className="text-white font-medium mr-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              ${formatPrice(totalBalance)}
            </motion.div>

            <motion.div
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <User size={20} className="text-gray-300" />
            </motion.div>
          </div>
        )}
      </div>
    </motion.header>
  )
}
