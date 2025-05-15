"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { Position } from "@/lib/types"

interface PositionsTableProps {
  positions: Position[]
  onClosePosition: (id: string) => void
  currentPrice: number
}

export function PositionsTable({ positions, onClosePosition, currentPrice }: PositionsTableProps) {
  const [expandedPosition, setExpandedPosition] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedPosition(expandedPosition === id ? null : id)
  }

  if (positions.length === 0) {
    return <div className="p-8 text-center text-gray-400">No open positions</div>
  }

  return (
    <div className="p-4">
      {positions.map((position) => (
        <motion.div
          key={position.id}
          className="mb-4 bg-[#0A0A0A] rounded-lg border border-gray-800 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4 cursor-pointer" onClick={() => toggleExpand(position.id)}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-white">{position.pair}</h3>
              <span className={`text-sm ${position.pnlPercentage >= 0 ? "text-green-500" : "text-red-500"}`}>
                Unrealized PnL: {position.pnlPercentage.toFixed(2)}%
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-gray-400 text-xs mb-1">Positions</div>
                <div className="font-medium text-white">{position.size.toFixed(3)}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs mb-1">Margin</div>
                <div className="font-medium text-white">{position.margin.toFixed(3)}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs mb-1">MMR</div>
                <div className="font-medium text-white">{Math.abs(position.pnlPercentage).toFixed(2)}%</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-gray-400 text-xs mb-1">Entry price</div>
                <div className="font-medium text-white">{position.entryPrice.toFixed(3)}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs mb-1">Mark price</div>
                <div className="font-medium text-white">{currentPrice.toFixed(3)}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs mb-1">Estimated Liquidation Price</div>
                <div className="font-medium text-white">{position.liquidationPrice.toFixed(3)}</div>
              </div>
            </div>
          </div>

          <div className="flex border-t border-gray-800">
            <button className="flex-1 py-3 text-center text-white bg-[#001C30] hover:bg-[#002D4A] transition-colors">
              TP/SL
            </button>
            <button className="flex-1 py-3 text-center text-white bg-[#001C30] hover:bg-[#002D4A] transition-colors border-l border-r border-gray-800">
              Reverse
            </button>
            <button
              className="flex-1 py-3 text-center text-white bg-[#001C30] hover:bg-[#002D4A] transition-colors"
              onClick={() => onClosePosition(position.id)}
            >
              Close
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
