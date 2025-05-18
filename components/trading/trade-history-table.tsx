"use client"

import { motion } from "framer-motion"
import type { TradeHistory } from "@/lib/types"

interface TradeHistoryTableProps {
  history: TradeHistory[]
}

export function TradeHistoryTable({ history }: TradeHistoryTableProps) {
  if (history.length === 0) {
    return <div className="p-8 text-center text-gray-400">No trade history</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-400 text-sm border-b border-gray-800">
            <th className="p-4">Pair</th>
            <th className="p-4">Type</th>
            <th className="p-4">Side</th>
            <th className="p-4">Price</th>
            <th className="p-4">Size</th>
            <th className="p-4">Fee</th>
            <th className="p-4">PnL</th>
            <th className="p-4">Time</th>
          </tr>
        </thead>
        <tbody>
          {history.map((trade) => (
            <motion.tr
              key={trade.id}
              className="border-b border-gray-800 hover:bg-[#001C30]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <td className="p-4">{trade.pair}</td>
              <td className="p-4">{trade.action}</td>
              <td className={`p-4 ${trade.type === "long" ? "text-green-500" : "text-red-500"}`}>
                {trade.type === "long" ? "Long" : "Short"}
              </td>
              <td className="p-4">${trade.price.toFixed(2)}</td>
              <td className="p-4">{trade.size.toFixed(2)}</td>
              <td className="p-4">${trade.fee.toFixed(2)}</td>
              <td className={`p-4 ${trade.pnl && trade.pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                {trade.pnl ? `$${trade.pnl.toFixed(2)}` : "-"}
              </td>
              <td className="p-4">{new Date(trade.timestamp).toLocaleTimeString()}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
