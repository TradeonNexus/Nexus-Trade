"use client"

import type { TradeHistory } from "@/lib/types"
import { useIsMobile } from "@/hooks/use-mobile"

interface TradeHistoryTableProps {
  history: TradeHistory[]
  compact?: boolean
}

export function TradeHistoryTable({ history, compact = false }: TradeHistoryTableProps) {
  const isMobile = useIsMobile() || compact

  if (history.length === 0) {
    return <div className="text-center py-8 text-gray-500">No trade history</div>
  }

  if (isMobile) {
    return (
      <div className="space-y-4">
        {history.map((trade) => (
          <div key={trade.id} className="p-3 rounded-lg border border-gray-800 bg-gray-900">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <span className={`text-sm font-medium ${trade.type === "long" ? "text-green-500" : "text-red-500"}`}>
                  {trade.type === "long" ? "Long" : "Short"}
                </span>
                <span className="ml-2 text-sm">{trade.pair}</span>
              </div>
              <span className="text-sm">{new Date(trade.time).toLocaleTimeString()}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="text-white">{trade.amount}</span>
              </div>
              <div className="flex justify-between">
                <span>Price:</span>
                <span className="text-white">{trade.price}</span>
              </div>
              <div className="flex justify-between">
                <span>Fee:</span>
                <span className="text-white">{trade.fee.toFixed(6)}</span>
              </div>
              <div className="flex justify-between">
                <span>Value:</span>
                <span className="text-white">{(trade.amount * trade.price).toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-500 border-b border-gray-200 dark:border-gray-800">
            <th className="pb-2">Pair</th>
            <th className="pb-2">Type</th>
            <th className="pb-2">Size</th>
            <th className="pb-2">Price</th>
            <th className="pb-2">Value</th>
            <th className="pb-2">Fee</th>
            <th className="pb-2">Time</th>
          </tr>
        </thead>
        <tbody>
          {history.map((trade) => (
            <tr key={trade.id} className="border-b border-gray-200 dark:border-gray-800">
              <td className="py-3">{trade.pair}</td>
              <td className={`py-3 ${trade.type === "long" ? "text-green-500" : "text-red-500"}`}>
                {trade.type === "long" ? "Long" : "Short"}
              </td>
              <td className="py-3">{trade.amount}</td>
              <td className="py-3">{trade.price}</td>
              <td className="py-3">{(trade.amount * trade.price).toFixed(2)}</td>
              <td className="py-3">{trade.fee.toFixed(6)}</td>
              <td className="py-3">{new Date(trade.time).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
