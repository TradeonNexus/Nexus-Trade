"use client"

import { motion } from "framer-motion"
import { useWallet } from "@/contexts/wallet-context"
import { AuthenticatedLayout } from "@/components/layouts/authenticated-layout"
import { BarChart3, DollarSign, TrendingDown, TrendingUp } from "lucide-react"
import { formatPrice } from "@/lib/utils"

export default function DashboardPage() {
  const { wallet } = useWallet()

  // Mock data for the dashboard
  const tradingHistory = [
    { id: 1, pair: "BTC/USDT", type: "buy", amount: 0.05, price: 34250, timestamp: new Date(Date.now() - 3600000) },
    { id: 2, pair: "SUI/USDT", type: "sell", amount: 150, price: 1.28, timestamp: new Date(Date.now() - 7200000) },
    { id: 3, pair: "ETH/USDT", type: "buy", amount: 0.5, price: 2105, timestamp: new Date(Date.now() - 10800000) },
    { id: 4, pair: "BTC/USDT", type: "sell", amount: 0.03, price: 34100, timestamp: new Date(Date.now() - 14400000) },
  ]

  const deposits = [
    { id: 1, token: "USDT", amount: 1000, timestamp: new Date(Date.now() - 86400000) },
    { id: 2, token: "SUI", amount: 500, timestamp: new Date(Date.now() - 172800000) },
  ]

  const withdrawals = [{ id: 1, token: "USDT", amount: 500, timestamp: new Date(Date.now() - 43200000) }]

  // Calculate total balance
  const totalBalance = wallet?.balance
    ? Object.entries(wallet.balance).reduce((sum, [token, amount]) => {
        // Simple price estimate for this example
        const tokenPrice = token === "WBTC" ? 34000 : token === "ETH" ? 2100 : token === "SUI" ? 1.3 : 1
        return sum + amount * tokenPrice
      }, 0)
    : 0

  // Mock PnL data
  const totalPnL = 3742.5
  const pnlPercentage = 8.25
  const isPnlPositive = totalPnL >= 0

  return (
    <AuthenticatedLayout>
      <div className="p-6 bg-gradient-to-b from-black to-[#001020]">
        <motion.h1
          className="text-3xl font-bold mb-8 text-white"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Dashboard
        </motion.h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            className="bg-gradient-to-b from-[#0A0A0A] to-[#001C30] rounded-lg border border-gray-800/50 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex justify-between mb-4">
              <h2 className="text-gray-400 font-medium">Total Balance</h2>
              <DollarSign className="text-[#8ECAFF]" size={20} />
            </div>
            <p className="text-2xl font-bold text-white">${formatPrice(totalBalance)}</p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-b from-[#0A0A0A] to-[#001C30] rounded-lg border border-gray-800/50 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex justify-between mb-4">
              <h2 className="text-gray-400 font-medium">Total P&L</h2>
              {isPnlPositive ? (
                <TrendingUp className="text-green-500" size={20} />
              ) : (
                <TrendingDown className="text-red-500" size={20} />
              )}
            </div>
            <p className={`text-2xl font-bold ${isPnlPositive ? "text-green-500" : "text-red-500"}`}>
              {isPnlPositive ? "+" : "-"}${formatPrice(Math.abs(totalPnL))} ({pnlPercentage}%)
            </p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-b from-[#0A0A0A] to-[#001C30] rounded-lg border border-gray-800/50 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex justify-between mb-4">
              <h2 className="text-gray-400 font-medium">Total Trades</h2>
              <BarChart3 className="text-[#8ECAFF]" size={20} />
            </div>
            <p className="text-2xl font-bold text-white">{tradingHistory.length}</p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-b from-[#0A0A0A] to-[#001C30] rounded-lg border border-gray-800/50 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex justify-between mb-4">
              <h2 className="text-gray-400 font-medium">Win Rate</h2>
              <TrendingUp className="text-green-500" size={20} />
            </div>
            <p className="text-2xl font-bold text-white">68%</p>
          </motion.div>
        </div>

        {/* History Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            className="bg-gradient-to-b from-[#0A0A0A] to-[#001C30] rounded-lg border border-gray-800/50 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-xl font-bold mb-4 text-white">Trading History</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-800/50">
                    <th className="pb-2 text-left">Pair</th>
                    <th className="pb-2 text-left">Type</th>
                    <th className="pb-2 text-right">Amount</th>
                    <th className="pb-2 text-right">Price</th>
                    <th className="pb-2 text-right">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {tradingHistory.map((trade) => (
                    <tr key={trade.id} className="border-b border-gray-800/30">
                      <td className="py-3 text-white">{trade.pair}</td>
                      <td className={`py-3 ${trade.type === "buy" ? "text-green-500" : "text-red-500"}`}>
                        {trade.type.toUpperCase()}
                      </td>
                      <td className="py-3 text-right text-white">{trade.amount}</td>
                      <td className="py-3 text-right text-white">${formatPrice(trade.price)}</td>
                      <td className="py-3 text-right text-gray-400">
                        {trade.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-b from-[#0A0A0A] to-[#001C30] rounded-lg border border-gray-800/50 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-xl font-bold mb-4 text-white">Deposits & Withdrawals</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-800/50">
                    <th className="pb-2 text-left">Type</th>
                    <th className="pb-2 text-left">Token</th>
                    <th className="pb-2 text-right">Amount</th>
                    <th className="pb-2 text-right">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {deposits.map((deposit) => (
                    <tr key={`d-${deposit.id}`} className="border-b border-gray-800/30">
                      <td className="py-3 text-green-500">DEPOSIT</td>
                      <td className="py-3 text-white">{deposit.token}</td>
                      <td className="py-3 text-right text-white">{deposit.amount}</td>
                      <td className="py-3 text-right text-gray-400">{deposit.timestamp.toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {withdrawals.map((withdrawal) => (
                    <tr key={`w-${withdrawal.id}`} className="border-b border-gray-800/30">
                      <td className="py-3 text-red-500">WITHDRAW</td>
                      <td className="py-3 text-white">{withdrawal.token}</td>
                      <td className="py-3 text-right text-white">{withdrawal.amount}</td>
                      <td className="py-3 text-right text-gray-400">{withdrawal.timestamp.toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
